import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInquirySchema, insertVehicleSchema, insertCustomerApplicationSchema } from "@shared/schema";
import { z } from "zod";
import { registerAdminRoutes } from "./admin-routes";
import { vehicleHistoryService } from "./vehicle-history-api";
import { emailService } from "./email-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all vehicles
  app.get("/api/vehicles", async (req, res) => {
    try {
      const vehicles = await storage.getAllVehicles();
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vehicles" });
    }
  });

  // Search vehicles with filters
  app.get("/api/vehicles/search", async (req, res) => {
    try {
      const { make, model, year, maxPrice, status } = req.query;
      
      const filters: any = {};
      if (make) filters.make = make as string;
      if (model) filters.model = model as string;
      if (year) filters.year = year as string;
      if (maxPrice) filters.maxPrice = parseInt(maxPrice as string);
      if (status) filters.status = status as string;

      const vehicles = await storage.searchVehicles(filters);
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ message: "Failed to search vehicles" });
    }
  });

  // Get vehicle by slug
  app.get("/api/vehicles/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const vehicle = await storage.getVehicleBySlug(slug);
      
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vehicle" });
    }
  });

  // Create vehicle
  app.post("/api/vehicles", async (req, res) => {
    try {
      const vehicleData = req.body;
      
      // Ensure required fields are provided
      if (!vehicleData.year || !vehicleData.make || !vehicleData.model) {
        return res.status(400).json({ message: "Year, make, and model are required" });
      }
      
      // Generate unique slug if not provided
      if (!vehicleData.slug) {
        vehicleData.slug = await generateUniqueSlug(vehicleData.year, vehicleData.make, vehicleData.model, vehicleData.vin);
      }

      // Validate the vehicle data
      const validatedData = insertVehicleSchema.parse(vehicleData);
      
      const vehicle = await storage.createVehicle(validatedData);
      
      res.status(201).json(vehicle);
    } catch (error) {
      console.error('Error creating vehicle:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      if (error instanceof Error && 'code' in error && error.code === '23505') {
        return res.status(409).json({ message: "A vehicle with this information already exists" });
      }
      res.status(500).json({ message: "Failed to create vehicle" });
    }
  });

  // Create inquiry
  app.post("/api/inquiries", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validatedData);
      
      // Send email notifications
      try {
        await emailService.sendContactNotification(inquiry);
      } catch (emailError) {
        console.warn("Failed to send inquiry notification email:", emailError);
        // Don't fail the request if email fails
      }
      
      res.status(201).json({ 
        success: true, 
        message: "Inquiry submitted successfully",
        inquiryId: inquiry.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create inquiry" });
    }
  });

  // Get all inquiries (for admin)
  app.get("/api/inquiries", async (req, res) => {
    try {
      const inquiries = await storage.getAllInquiries();
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  // Update vehicle
  app.patch("/api/vehicles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const vehicle = await storage.updateVehicle(parseInt(id), updates);
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ message: "Failed to update vehicle" });
    }
  });

  // Delete vehicle
  app.delete("/api/vehicles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteVehicle(parseInt(id));
      res.json({ message: "Vehicle deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete vehicle" });
    }
  });

  // Update vehicle history reports
  app.patch("/api/vehicles/:id/history-reports", async (req, res) => {
    try {
      const { id } = req.params;
      const historyData = req.body;
      
      const vehicle = await storage.updateVehicle(parseInt(id), historyData);
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ message: "Failed to update vehicle history reports" });
    }
  });

  // Update vehicle CarFax embed code (legacy endpoint)
  app.patch("/api/vehicles/:id/carfax", async (req, res) => {
    try {
      const { id } = req.params;
      const { carfaxEmbedCode } = req.body;
      
      if (!carfaxEmbedCode || typeof carfaxEmbedCode !== 'string') {
        return res.status(400).json({ message: "CarFax embed code is required" });
      }
      
      const vehicle = await storage.updateVehicleCarfax(parseInt(id), carfaxEmbedCode);
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ message: "Failed to update CarFax embed code" });
    }
  });

  // Add CORS headers for webhook endpoint
  app.options("/api/webhook/vehicle-update", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(200);
  });

  // Webhook endpoint for Google Apps Script
  app.post("/api/webhook/vehicle-update", async (req, res) => {
    // Add CORS headers
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    try {
      console.log('Received webhook from Google Sheets:', req.body);
      
      const vehicleData = req.body;
      
      // Convert and validate the incoming data
      const insertVehicle = {
        slug: generateSlug(vehicleData.year, vehicleData.make, vehicleData.model, vehicleData.vin),
        title: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`,
        description: vehicleData.description || '',
        price: Number(vehicleData.price) || 0,
        status: vehicleData.status || 'for-sale',
        mileage: vehicleData.miles?.toString() || '0',
        year: vehicleData.year?.toString() || '',
        make: vehicleData.make || '',
        model: vehicleData.model || '',
        vin: vehicleData.vin || '',
        stockNumber: vehicleData.stockNumber || '',
        engine: 'Not specified',
        transmission: 'Not specified',
        driveType: 'Not specified',
        exteriorColor: vehicleData.exteriorColor || '',
        interiorColor: vehicleData.interiorColor || '',
        images: [],
        keyFeatures: [],
        metaTitle: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model} - T-Rex Motors`,
        metaDescription: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model} with ${vehicleData.miles || 0} miles.`,
        notes: vehicleData.notes || ''
      };

      // Check if vehicle already exists by VIN
      const existingVehicles = await storage.searchVehicles({});
      const existingVehicle = existingVehicles.find(v => v.vin === vehicleData.vin);
      
      if (existingVehicle) {
        // Vehicle exists, log update action
        console.log('Vehicle exists, would update if update functionality was implemented');
        res.json({ 
          success: true, 
          action: 'exists',
          message: 'Vehicle already exists in database',
          vin: vehicleData.vin
        });
      } else {
        // Create new vehicle
        const vehicle = await storage.createVehicle(insertVehicle);
        console.log('New vehicle created:', vehicle.id);
        res.json({ 
          success: true, 
          action: 'created',
          message: 'Vehicle created successfully',
          vehicle: vehicle
        });
      }
      
    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(400).json({ 
        success: false, 
        error: error.message 
      });
    }
  });

  // GET-based webhook that bypasses Cloudflare restrictions
  app.get("/api/webhook/add-vehicle", async (req, res) => {
    try {
      console.log('Received GET webhook with params:', req.query);
      
      const vehicleData = {
        status: (req.query.status as string) || 'for-sale',
        stockNumber: (req.query.stockNumber as string) || '',
        vin: (req.query.vin as string) || '',
        year: parseInt((req.query.year as string) || '0'),
        make: (req.query.make as string) || '',
        model: (req.query.model as string) || '',
        miles: parseInt((req.query.miles as string) || '0'),
        price: parseInt((req.query.price as string) || '0'),
        exteriorColor: (req.query.exteriorColor as string) || '',
        interiorColor: (req.query.interiorColor as string) || '',
        description: (req.query.description as string) || '',
        notes: (req.query.notes as string) || ''
      };

      const insertVehicle = {
        slug: generateSlug(vehicleData.year, vehicleData.make, vehicleData.model, vehicleData.vin),
        title: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`,
        description: vehicleData.description,
        price: vehicleData.price,
        status: vehicleData.status,
        mileage: vehicleData.miles.toString(),
        year: vehicleData.year.toString(),
        make: vehicleData.make,
        model: vehicleData.model,
        vin: vehicleData.vin,
        stockNumber: vehicleData.stockNumber,
        engine: 'Not specified',
        transmission: 'Not specified',
        driveType: 'Not specified',
        exteriorColor: vehicleData.exteriorColor,
        interiorColor: vehicleData.interiorColor,
        images: [],
        keyFeatures: [],
        metaTitle: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model} - T-Rex Motors`,
        metaDescription: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model} with ${vehicleData.miles} miles.`,
        notes: vehicleData.notes
      };

      // Check if vehicle already exists
      const existingVehicles = await storage.searchVehicles({});
      const existingVehicle = existingVehicles.find(v => v.vin === vehicleData.vin);
      
      if (existingVehicle) {
        console.log('Vehicle already exists:', vehicleData.vin);
        res.json({ 
          success: true, 
          action: 'exists',
          message: 'Vehicle already exists in database',
          vin: vehicleData.vin
        });
      } else {
        const vehicle = await storage.createVehicle(insertVehicle);
        console.log('New vehicle created via GET:', vehicle.id);
        res.json({ 
          success: true, 
          action: 'created',
          message: 'Vehicle created successfully via GET request',
          vehicle: vehicle
        });
      }
      
    } catch (error: any) {
      console.error('GET webhook error:', error);
      res.status(400).json({ 
        success: false, 
        error: error.message 
      });
    }
  });

  // Test endpoint
  app.get("/test", (req, res) => {
    res.json({ message: "Server is working!", timestamp: new Date().toISOString() });
  });

  // Get available vehicle history providers
  app.get("/api/vehicle-history/providers", async (req, res) => {
    try {
      const providers = await vehicleHistoryService.getAvailableProviders();
      res.json({ providers });
    } catch (error) {
      res.status(500).json({ message: "Failed to check history providers" });
    }
  });

  // Get vehicle history report
  app.get("/api/vehicle-history/:vin", async (req, res) => {
    try {
      const { vin } = req.params;
      const { provider } = req.query;
      
      const report = await vehicleHistoryService.getReport(vin, provider as string);
      
      if (!report) {
        return res.status(404).json({ message: "No history report available for this VIN" });
      }
      
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve vehicle history report" });
    }
  });

  // Request new vehicle history report
  app.post("/api/vehicle-history/:vin/request", async (req, res) => {
    try {
      const { vin } = req.params;
      const { provider } = req.body;
      
      if (!provider) {
        return res.status(400).json({ message: "Provider is required" });
      }
      
      const reportId = await vehicleHistoryService.requestReport(vin, provider);
      
      if (!reportId) {
        return res.status(400).json({ message: "Failed to request report from provider" });
      }
      
      res.json({ reportId, status: "pending" });
    } catch (error) {
      res.status(500).json({ message: "Failed to request vehicle history report" });
    }
  });

  // Auto-populate vehicle history from reports
  app.post("/api/vehicles/:id/auto-populate-history", async (req, res) => {
    try {
      const { id } = req.params;
      const vehicle = await storage.getVehicleById(parseInt(id));
      
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      
      if (!vehicle.vin) {
        return res.status(400).json({ message: "Vehicle VIN is required for history report" });
      }
      
      const report = await vehicleHistoryService.getBestReport(vehicle.vin);
      
      if (!report) {
        return res.status(404).json({ message: "No history report available for this vehicle" });
      }
      
      const updates: any = {
        vehicleHistoryScore: report.summary.historyScore,
        accidentHistory: report.summary.accidentHistory,
        previousOwners: report.summary.previousOwners,
        serviceRecords: report.summary.serviceRecords,
        titleStatus: report.summary.titleStatus,
        lastHistoryUpdate: new Date().toISOString()
      };
      
      if (report.provider === 'carfax' && report.embedCode) {
        updates.carfaxEmbedCode = report.embedCode;
      }
      
      if (report.provider === 'autocheck' && report.reportUrl) {
        updates.autoCheckUrl = report.reportUrl;
      }
      
      const updatedVehicle = await storage.updateVehicle(parseInt(id), updates);
      
      res.json({
        vehicle: updatedVehicle,
        report: report,
        summary: vehicleHistoryService.formatReportSummary(report)
      });
      
    } catch (error) {
      res.status(500).json({ message: "Failed to auto-populate vehicle history" });
    }
  });

  // Simple webhook test endpoint that always works
  app.get("/api/webhook/test", async (req, res) => {
    res.json({ 
      status: "success", 
      message: "Webhook endpoint is working",
      timestamp: new Date().toISOString(),
      url: req.url
    });
  });

  // Helper function to generate slugs
  function generateSlug(year: number, make: string, model: string, vin: string): string {
    const baseSlug = `${year}-${make}-${model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const vinSuffix = vin.slice(-6).toLowerCase();
    return `${baseSlug}-${vinSuffix}`;
  }

  // Generate unique slug to avoid duplicates
  async function generateUniqueSlug(year: number, make: string, model: string, vin?: string): Promise<string> {
    const baseSlug = `${year}-${make}-${model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const vinSuffix = vin ? vin.slice(-6).toLowerCase() : Date.now().toString().slice(-6);
    let slug = `${baseSlug}-${vinSuffix}`;
    
    // Check if slug already exists
    try {
      const existingVehicle = await storage.getVehicleBySlug(slug);
      if (existingVehicle) {
        // If slug exists, add a random suffix
        const randomSuffix = Math.random().toString(36).substr(2, 4);
        slug = `${baseSlug}-${vinSuffix}-${randomSuffix}`;
      }
    } catch (error) {
      // If error checking, just use the original slug
    }
    
    return slug;
  }

  // Customer Applications Routes

  // Submit customer application
  app.post("/api/applications", async (req, res) => {
    try {
      const applicationData = insertCustomerApplicationSchema.parse(req.body);
      const application = await storage.createCustomerApplication(applicationData);
      
      // Send email notifications
      try {
        await emailService.sendApplicationNotification(application);
      } catch (emailError) {
        console.warn("Failed to send application notification email:", emailError);
        // Don't fail the request if email fails
      }
      
      res.status(201).json({ 
        success: true, 
        message: "Application submitted successfully",
        applicationId: application.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Application submission error:", error);
      res.status(500).json({ message: "Failed to submit application" });
    }
  });

  // Get application by ID (for customer confirmation)
  app.get("/api/applications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const application = await storage.getCustomerApplication(parseInt(id));
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      // Remove sensitive data before sending to client
      const safeApplication = {
        id: application.id,
        status: application.status,
        submittedAt: application.submittedAt,
        borrowerFirstName: application.borrowerFirstName,
        borrowerLastName: application.borrowerLastName,
        borrowerEmail: application.borrowerEmail
      };
      
      res.json(safeApplication);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch application" });
    }
  });

  // Register admin routes
  await registerAdminRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
