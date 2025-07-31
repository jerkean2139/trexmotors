var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  customerApplications: () => customerApplications,
  inquiries: () => inquiries,
  insertCustomerApplicationSchema: () => insertCustomerApplicationSchema,
  insertInquirySchema: () => insertInquirySchema,
  insertVehicleSchema: () => insertVehicleSchema,
  vehicles: () => vehicles
});
import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var vehicles, inquiries, insertVehicleSchema, insertInquirySchema, customerApplications, insertCustomerApplicationSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    vehicles = pgTable("vehicles", {
      id: serial("id").primaryKey(),
      slug: text("slug").notNull().unique(),
      title: text("title").notNull(),
      description: text("description").notNull(),
      price: integer("price").notNull(),
      status: text("status").notNull(),
      // "for-sale", "sold", "pending"
      mileage: text("mileage").notNull(),
      year: text("year").notNull(),
      make: text("make").notNull(),
      model: text("model").notNull(),
      vin: text("vin").unique(),
      stockNumber: text("stock_number"),
      engine: text("engine").notNull(),
      transmission: text("transmission").notNull(),
      driveType: text("drive_type").notNull(),
      exteriorColor: text("exterior_color").notNull(),
      interiorColor: text("interior_color").notNull(),
      images: text("images").array().notNull(),
      keyFeatures: text("key_features").array().notNull(),
      metaTitle: text("meta_title").notNull(),
      metaDescription: text("meta_description").notNull(),
      carfaxEmbedCode: text("carfax_embed_code"),
      // Optional CarFax embed code
      autoCheckUrl: text("autocheck_url"),
      // AutoCheck report URL
      vehicleHistoryScore: integer("vehicle_history_score"),
      // 1-100 score from history reports
      accidentHistory: integer("accident_history").default(0),
      // Number of reported accidents
      previousOwners: integer("previous_owners").default(0),
      // Number of previous owners
      serviceRecords: integer("service_records").default(0),
      // Number of service records
      titleStatus: text("title_status").default("unknown"),
      // clean, branded, lemon, flood, etc.
      lastHistoryUpdate: text("last_history_update"),
      // When history data was last updated
      notes: text("notes"),
      lastSyncedAt: text("last_synced_at"),
      // Banner system
      bannerReduced: boolean("banner_reduced").default(false),
      bannerSold: boolean("banner_sold").default(false),
      bannerGreatDeal: boolean("banner_great_deal").default(false),
      bannerNew: boolean("banner_new").default(false),
      createdAt: text("created_at").default((/* @__PURE__ */ new Date()).toISOString())
    });
    inquiries = pgTable("inquiries", {
      id: serial("id").primaryKey(),
      firstName: text("first_name").notNull(),
      lastName: text("last_name").notNull(),
      email: text("email").notNull(),
      phone: text("phone"),
      vehicleId: integer("vehicle_id"),
      message: text("message"),
      createdAt: text("created_at").notNull()
    });
    insertVehicleSchema = createInsertSchema(vehicles).omit({
      id: true,
      createdAt: true
    });
    insertInquirySchema = createInsertSchema(inquiries).omit({
      id: true,
      createdAt: true
    });
    customerApplications = pgTable("customer_applications", {
      id: serial("id").primaryKey(),
      // Application status and metadata
      status: text("status").notNull().default("pending"),
      // 'pending', 'approved', 'denied', 'reviewing'
      submittedAt: timestamp("submitted_at").defaultNow(),
      reviewedAt: timestamp("reviewed_at"),
      reviewedBy: text("reviewed_by"),
      // admin user who reviewed
      adminNotes: text("admin_notes"),
      // Primary Borrower Information
      borrowerFirstName: text("borrower_first_name").notNull(),
      borrowerLastName: text("borrower_last_name").notNull(),
      borrowerEmail: text("borrower_email").notNull(),
      borrowerPhone: text("borrower_phone").notNull(),
      borrowerDob: date("borrower_dob"),
      borrowerSsn: text("borrower_ssn"),
      // encrypted in production
      // Address Information
      streetAddress: text("street_address"),
      city: text("city"),
      state: text("state"),
      country: text("country").default("United States"),
      postalCode: text("postal_code"),
      priorAddress: text("prior_address"),
      // Living Situation
      livingSituation: text("living_situation"),
      // 'own', 'rent', 'lend'
      residenceDuration: text("residence_duration"),
      monthlyPayment: integer("monthly_payment"),
      // rent/mortgage payment in cents
      // Employment Information
      employer: text("employer"),
      yearsEmployed: text("years_employed"),
      employerPhone: text("employer_phone"),
      monthlyGrossIncome: integer("monthly_gross_income"),
      // in cents
      // Banking Information
      bankName: text("bank_name"),
      accountType: text("account_type"),
      // 'checking', 'savings', 'both'
      // Co-Borrower Information (optional)
      coBorrowerFirstName: text("co_borrower_first_name"),
      coBorrowerLastName: text("co_borrower_last_name"),
      coBorrowerEmail: text("co_borrower_email"),
      coBorrowerPhone: text("co_borrower_phone"),
      coBorrowerDob: date("co_borrower_dob"),
      coBorrowerSsn: text("co_borrower_ssn"),
      // Additional Information
      notes: text("notes"),
      consentToSms: boolean("consent_to_sms").default(false),
      // Digital Signatures
      borrowerSignature: text("borrower_signature"),
      // base64 signature data
      coBorrowerSignature: text("co_borrower_signature"),
      // Source tracking
      referralSource: text("referral_source"),
      interestedVehicle: integer("interested_vehicle_id").references(() => vehicles.id)
    });
    insertCustomerApplicationSchema = createInsertSchema(customerApplications).omit({
      id: true,
      submittedAt: true
    });
  }
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
var pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    neonConfig.webSocketConstructor = ws;
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?"
      );
    }
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool, schema: schema_exports });
  }
});

// server/banner-manager.ts
var banner_manager_exports = {};
__export(banner_manager_exports, {
  bannerManager: () => bannerManager
});
import { eq as eq2, and as and2, lt } from "drizzle-orm";
import cron from "node-cron";
var BannerManager, bannerManager;
var init_banner_manager = __esm({
  "server/banner-manager.ts"() {
    "use strict";
    init_db();
    init_schema();
    BannerManager = class {
      constructor() {
        this.startScheduledCleanup();
      }
      /**
       * Remove NEW banners from vehicles older than 5 days
       */
      async removeExpiredNewBanners() {
        const fiveDaysAgo = /* @__PURE__ */ new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        try {
          const expiredVehicles = await db.update(vehicles).set({ bannerNew: false }).where(
            and2(
              eq2(vehicles.bannerNew, true),
              lt(vehicles.createdAt, fiveDaysAgo.toISOString())
            )
          ).returning({ id: vehicles.id, title: vehicles.title });
          if (expiredVehicles.length > 0) {
            console.log(
              `Removed NEW banners from ${expiredVehicles.length} vehicles:`,
              expiredVehicles.map((v) => v.title)
            );
          }
          return expiredVehicles.length;
        } catch (error) {
          console.error("Error removing expired NEW banners:", error);
          return 0;
        }
      }
      /**
       * Start scheduled cleanup that runs daily at 2 AM
       */
      startScheduledCleanup() {
        cron.schedule("0 2 * * *", async () => {
          console.log("Running scheduled NEW banner cleanup...");
          await this.removeExpiredNewBanners();
        });
        console.log("Banner manager started - NEW banners will be removed after 5 days");
      }
      /**
       * Manual cleanup for immediate execution
       */
      async manualCleanup() {
        console.log("Running manual NEW banner cleanup...");
        return await this.removeExpiredNewBanners();
      }
      /**
       * Get statistics about current banners
       */
      async getBannerStats() {
        try {
          const oneDayFromExpiry = /* @__PURE__ */ new Date();
          oneDayFromExpiry.setDate(oneDayFromExpiry.getDate() - 4);
          const [stats] = await db.select({
            totalNew: vehicles.bannerNew,
            totalReduced: vehicles.bannerReduced,
            totalGreatDeal: vehicles.bannerGreatDeal,
            totalSold: vehicles.bannerSold
          }).from(vehicles);
          const newBannerVehicles = await db.select({ id: vehicles.id, createdAt: vehicles.createdAt }).from(vehicles).where(eq2(vehicles.bannerNew, true));
          const totalNew = newBannerVehicles.length;
          const expiringSoon = newBannerVehicles.filter(
            (v) => v.createdAt && new Date(v.createdAt) <= oneDayFromExpiry
          ).length;
          const reducedCount = await db.select({ count: vehicles.id }).from(vehicles).where(eq2(vehicles.bannerReduced, true));
          const greatDealCount = await db.select({ count: vehicles.id }).from(vehicles).where(eq2(vehicles.bannerGreatDeal, true));
          const soldCount = await db.select({ count: vehicles.id }).from(vehicles).where(eq2(vehicles.bannerSold, true));
          return {
            totalNew,
            expiringSoon,
            totalReduced: reducedCount.length,
            totalGreatDeal: greatDealCount.length,
            totalSold: soldCount.length
          };
        } catch (error) {
          console.error("Error getting banner stats:", error);
          return {
            totalNew: 0,
            expiringSoon: 0,
            totalReduced: 0,
            totalGreatDeal: 0,
            totalSold: 0
          };
        }
      }
    };
    bannerManager = new BannerManager();
  }
});

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
init_schema();
init_db();
import { eq, desc } from "drizzle-orm";
var DatabaseStorage = class {
  async getAllVehicles() {
    return await db.select().from(vehicles).orderBy(
      desc(vehicles.bannerNew),
      // NEW banners first (true before false)
      desc(vehicles.createdAt)
      // Then by creation date (newest first)
    );
  }
  async getVehicleBySlug(slug) {
    const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.slug, slug));
    return vehicle || void 0;
  }
  async getVehicleById(id) {
    const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id));
    return vehicle || void 0;
  }
  async searchVehicles(filters) {
    let query = db.select().from(vehicles);
    const conditions = [];
    if (filters.make && filters.make !== "Any Make") {
      conditions.push(eq(vehicles.make, filters.make));
    }
    if (filters.model && filters.model !== "Any Model") {
      conditions.push(eq(vehicles.model, filters.model));
    }
    if (filters.year && filters.year !== "Any Year") {
      if (filters.year === "2020+") {
        const { gte: gte2 } = await import("drizzle-orm");
        conditions.push(gte2(vehicles.year, "2020"));
      } else if (filters.year === "2015-2019") {
        const { gte: gte2, lte: lte2, and: and3 } = await import("drizzle-orm");
        conditions.push(and3(gte2(vehicles.year, "2015"), lte2(vehicles.year, "2019")));
      } else if (filters.year === "2010-2014") {
        const { gte: gte2, lte: lte2, and: and3 } = await import("drizzle-orm");
        conditions.push(and3(gte2(vehicles.year, "2010"), lte2(vehicles.year, "2014")));
      }
    }
    if (filters.maxPrice) {
      const { lte: lte2 } = await import("drizzle-orm");
      conditions.push(lte2(vehicles.price, filters.maxPrice));
    }
    if (filters.status) {
      conditions.push(eq(vehicles.status, filters.status));
    }
    if (conditions.length > 0) {
      const { and: and3 } = await import("drizzle-orm");
      query = query.where(and3(...conditions));
    }
    return await query;
  }
  async createVehicle(insertVehicle) {
    const [vehicle] = await db.insert(vehicles).values({
      ...insertVehicle,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    }).returning();
    return vehicle;
  }
  async updateVehicle(id, updates) {
    const [vehicle] = await db.update(vehicles).set(updates).where(eq(vehicles.id, id)).returning();
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }
    return vehicle;
  }
  async updateVehicleCarfax(id, carfaxEmbedCode) {
    const [vehicle] = await db.update(vehicles).set({ carfaxEmbedCode }).where(eq(vehicles.id, id)).returning();
    return vehicle;
  }
  async deleteVehicle(id) {
    await db.delete(vehicles).where(eq(vehicles.id, id));
  }
  async createInquiry(insertInquiry) {
    const [inquiry] = await db.insert(inquiries).values({
      ...insertInquiry,
      phone: insertInquiry.phone || null,
      message: insertInquiry.message || null,
      vehicleId: insertInquiry.vehicleId || null,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    }).returning();
    return inquiry;
  }
  async getAllInquiries() {
    return await db.select().from(inquiries);
  }
  // Customer Application operations
  async createCustomerApplication(application) {
    const [newApplication] = await db.insert(customerApplications).values(application).returning();
    return newApplication;
  }
  async getCustomerApplication(id) {
    const [application] = await db.select().from(customerApplications).where(eq(customerApplications.id, id));
    return application || void 0;
  }
  async getAllCustomerApplications() {
    return await db.select().from(customerApplications).orderBy(desc(customerApplications.submittedAt));
  }
  async updateCustomerApplication(id, updates) {
    const [updatedApplication] = await db.update(customerApplications).set(updates).where(eq(customerApplications.id, id)).returning();
    return updatedApplication;
  }
  async deleteCustomerApplication(id) {
    await db.delete(customerApplications).where(eq(customerApplications.id, id));
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
init_schema();
import { z } from "zod";

// server/admin-routes.ts
import { google } from "googleapis";
import { writeFileSync } from "fs";
import multer from "multer";
init_db();
init_schema();

// server/inventory-updater.ts
init_db();
init_schema();
function convertGoogleDriveUrl(url) {
  if (!url || url.trim() === "") return "";
  if (url.includes("drive.google.com/file/d/")) {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      return `https://lh3.googleusercontent.com/d/${match[1]}=w800`;
    }
  }
  if (url.includes("drive.google.com/uc?export=view&id=")) {
    const match = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (match) {
      return `https://lh3.googleusercontent.com/d/${match[1]}=w800`;
    }
  }
  if (url.includes("drive.google.com/uc?id=")) {
    const match = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (match) {
      return `https://lh3.googleusercontent.com/d/${match[1]}=w800`;
    }
  }
  return url;
}
function createSlug(year, make, model, stockNumber) {
  const title = `${year} ${make} ${model}`;
  const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
  return `${slug}-${stockNumber}`;
}
async function updateInventoryFromSheet(sheetData) {
  console.log("Starting inventory update from sheet data...");
  const lines = sheetData.split("\n");
  const headers = lines[0].split("	");
  const dataLines = lines.slice(1).filter((line) => line.trim() && !line.startsWith("---"));
  console.log(`Processing ${dataLines.length} vehicle records...`);
  await db.delete(vehicles);
  console.log("Cleared existing inventory");
  const processedVehicles = [];
  for (const line of dataLines) {
    const columns = line.split("	");
    if (columns.length < 11 || !columns[1] || !columns[3] || !columns[4] || !columns[5]) {
      continue;
    }
    const vehicleData = {
      status: columns[0] || "",
      stockNumber: columns[1] || "",
      vin: columns[2] || "",
      year: columns[3] || "",
      make: columns[4] || "",
      model: columns[5] || "",
      miles: columns[6] || "",
      price: columns[7] || "",
      exteriorColor: columns[8] || "",
      interiorColor: columns[9] || "",
      description: columns[10] || "",
      notes: columns[11] || "",
      featuredImage: columns[13] || "",
      image2: columns[14] || "",
      image3: columns[15] || "",
      image4: columns[16] || "",
      image5: columns[17] || "",
      image6: columns[18] || "",
      image7: columns[19] || ""
    };
    if (vehicleData.status.toLowerCase() === "sold" || vehicleData.status.toLowerCase() === "needs removed" || !vehicleData.year || !vehicleData.make || !vehicleData.model) {
      continue;
    }
    const priceStr = vehicleData.price.replace(/[$,]/g, "");
    const price = parseInt(priceStr) || 0;
    if (!price || price <= 0) {
      continue;
    }
    const imageUrls = [
      vehicleData.featuredImage,
      vehicleData.image2,
      vehicleData.image3,
      vehicleData.image4,
      vehicleData.image5,
      vehicleData.image6,
      vehicleData.image7
    ].filter((url) => url && url.trim() !== "").map(convertGoogleDriveUrl);
    const title = `${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`;
    const slug = createSlug(vehicleData.year, vehicleData.make, vehicleData.model, vehicleData.stockNumber);
    const mileage = vehicleData.miles.replace(/[^0-9]/g, "");
    const mileageFormatted = mileage ? `${parseInt(mileage).toLocaleString()} miles` : "Contact for mileage";
    const newVehicle = {
      slug,
      title,
      description: vehicleData.description || `${title} in excellent condition. ${vehicleData.notes}`.trim(),
      price,
      status: vehicleData.status.toLowerCase() === "for sale" ? "for-sale" : "pending",
      mileage: mileageFormatted,
      year: vehicleData.year,
      make: vehicleData.make,
      model: vehicleData.model,
      vin: vehicleData.vin || null,
      stockNumber: vehicleData.stockNumber || null,
      exteriorColor: vehicleData.exteriorColor || null,
      interiorColor: vehicleData.interiorColor || null,
      engine: null,
      transmission: null,
      driveType: null,
      images: imageUrls,
      keyFeatures: [],
      metaTitle: `${title} - T-Rex Motors Richmond, IN`,
      metaDescription: `${title} for sale at T-Rex Motors. ${vehicleData.description.substring(0, 100)}... Contact us at 765-238-2887.`,
      bannerNew: false,
      bannerReduced: false,
      bannerGreatDeal: false,
      bannerSold: false
    };
    try {
      const [insertedVehicle] = await db.insert(vehicles).values([newVehicle]).returning();
      processedVehicles.push(insertedVehicle);
      console.log(`Added vehicle: ${title} (${vehicleData.stockNumber})`);
    } catch (error) {
      console.error(`Error adding vehicle ${title}:`, error);
    }
  }
  console.log(`Successfully processed ${processedVehicles.length} vehicles`);
  return {
    processed: processedVehicles.length,
    vehicles: processedVehicles
  };
}

// server/admin-routes.ts
var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
    // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});
var SPREADSHEET_ID = "1NNCJE7KV_rZ6VBkc1-mcPUrQGDdsXMUTHAprK3UvKNA";
var DRIVE_FOLDER_ID = "1BpN_8xOkZcQzKzGzZnVZcWcQcKzHzKzK";
var vehicleDrafts = {
  data: [],
  add(draft) {
    this.data.push({ id: Date.now(), ...draft, status: "pending", createdAt: /* @__PURE__ */ new Date() });
  },
  getAll() {
    return this.data;
  },
  approve(id) {
    const draft = this.data.find((d) => d.id === id);
    if (draft) {
      draft.status = "approved";
      draft.approvedAt = /* @__PURE__ */ new Date();
    }
    return draft;
  }
};
var AdminService = class {
  auth;
  sheets;
  drive;
  constructor() {
    this.initializeAuth();
  }
  async initializeAuth() {
    try {
      let serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
      if (!serviceAccountKey) {
        console.log("Google service account key not provided - admin will use manual vehicle creation only");
        return;
      }
      if (serviceAccountKey === "c540361219c10165e6eb4025ecb547f8aab5f7bf") {
        console.error("GOOGLE_SERVICE_ACCOUNT_KEY contains an invalid placeholder value.");
        console.error("Please provide a valid Google service account JSON key through Replit secrets.");
        throw new Error("Invalid Google service account key - please check your GOOGLE_SERVICE_ACCOUNT_KEY secret");
      }
      let credentials;
      try {
        const cleanKey = serviceAccountKey.trim();
        credentials = JSON.parse(cleanKey);
      } catch (parseError) {
        console.error("Failed to parse service account key. First 100 chars:", serviceAccountKey.substring(0, 100));
        console.error("Parse error:", parseError instanceof Error ? parseError.message : parseError);
        throw new Error("Service account key is not valid JSON format");
      }
      if (!credentials.private_key || !credentials.client_email) {
        throw new Error("Service account key missing required fields (private_key, client_email)");
      }
      try {
        const tempCredentialsPath = "/tmp/google_service_account.json";
        writeFileSync(tempCredentialsPath, JSON.stringify(credentials, null, 2));
        this.auth = new google.auth.GoogleAuth({
          keyFile: tempCredentialsPath,
          scopes: [
            "https://www.googleapis.com/auth/spreadsheets",
            "https://www.googleapis.com/auth/drive"
          ]
        });
        this.sheets = google.sheets({ version: "v4", auth: this.auth });
        this.drive = google.drive({ version: "v3", auth: this.auth });
        const authClient = await this.auth.getClient();
        await this.sheets.spreadsheets.get({
          spreadsheetId: SPREADSHEET_ID,
          fields: "properties.title"
        });
        console.log("Google API authenticated successfully");
        try {
          __require("fs").unlinkSync(tempCredentialsPath);
        } catch (cleanupError) {
        }
      } catch (authError) {
        const errorMessage = authError instanceof Error ? authError.message : String(authError);
        if (errorMessage.includes("DECODER routines::unsupported")) {
          console.error("Google API authentication failed due to OpenSSL compatibility issue.");
          console.error("The service account key format may be incompatible with this Node.js environment.");
          console.error("This is a known issue with Node.js v20+ and certain private key formats.");
        } else if (errorMessage.includes("invalid_grant")) {
          console.error("Google API authentication failed: Service account key may be expired or invalid.");
        } else if (errorMessage.includes("access_denied")) {
          console.error("Google API authentication failed: Service account lacks required permissions.");
        } else {
          console.error("Google API authentication failed:", errorMessage);
        }
        throw authError;
      }
    } catch (error) {
      console.error("Google API authentication failed:", error instanceof Error ? error.message : error);
      console.log("Admin dashboard will function with manual vehicle creation only");
      this.auth = null;
      this.sheets = null;
      this.drive = null;
    }
  }
  async getSheetData() {
    try {
      if (!this.sheets) {
        await this.initializeAuth();
      }
      if (this.sheets) {
        const response = await this.sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: "A:S"
        });
        const rows = response.data.values;
        if (!rows || rows.length <= 1) {
          console.log("No data found in spreadsheet");
          return [];
        }
        const vehicles2 = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          const vehicle = {
            status: row[0] || "for-sale",
            stockNumber: row[1] || "",
            vin: row[2] || "",
            year: parseInt(row[3]) || 0,
            make: row[4] || "",
            model: row[5] || "",
            miles: parseInt(row[6]) || 0,
            price: parseFloat(row[7]) || 0,
            exteriorColor: row[8] || "",
            interiorColor: row[9] || "",
            description: row[10] || "",
            notes: row[11] || "",
            images: this.parseImageUrls(row[12] || ""),
            code: row[18] || ""
          };
          const driveFolder = await this.findVehicleFolder(vehicle);
          if (driveFolder) {
            vehicle.driveFolder = driveFolder;
          }
          vehicles2.push(vehicle);
        }
        return vehicles2;
      }
      console.log("Google Sheets integration pending - use manual vehicle creation");
      return [];
    } catch (error) {
      console.error("Error fetching sheet data:", error);
      return [];
    }
  }
  async getSheetRow(rowNumber) {
    try {
      if (rowNumber === 2) {
        const demoVehicle = {
          status: "for-sale",
          stockNumber: "T001",
          vin: "1HGBH41JXMN109186",
          year: 2020,
          make: "Honda",
          model: "Civic",
          miles: 35e3,
          price: 22500,
          exteriorColor: "Blue",
          interiorColor: "Black",
          description: "Excellent condition, well maintained",
          notes: "Clean title, single owner",
          images: [],
          code: "HC001"
        };
        console.log("Returning demo vehicle for row 2:", demoVehicle);
        return demoVehicle;
      }
      if (rowNumber === 3) {
        const demoVehicle = {
          status: "for-sale",
          stockNumber: "T002",
          vin: "2HGFC2F50DH123456",
          year: 2019,
          make: "Toyota",
          model: "Camry",
          miles: 42e3,
          price: 24e3,
          exteriorColor: "White",
          interiorColor: "Tan",
          description: "Reliable and fuel efficient",
          notes: "Recent maintenance, new tires",
          images: [],
          code: "TC001"
        };
        console.log("Returning demo vehicle for row 3:", demoVehicle);
        return demoVehicle;
      }
      console.log(`No demo data available for row ${rowNumber}`);
      return null;
    } catch (error) {
      console.error("Error fetching sheet row:", error);
      return null;
    }
  }
  parseImageUrls(imageString) {
    if (!imageString) return [];
    return imageString.split(",").map((url) => url.trim()).filter((url) => url.length > 0);
  }
  async findVehicleFolder(vehicle) {
    return null;
  }
  async browseFolders(parentId = "root") {
    try {
      if (!this.drive) {
        await this.initializeAuth();
      }
      if (!this.drive) {
        console.log("Google Drive API not available - authentication failed");
        return [];
      }
      console.log(`Browsing Google Drive folders with parent: ${parentId}`);
      const response = await this.drive.files.list({
        q: `'${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: "files(id,name,parents,createdTime,modifiedTime)",
        pageSize: 100,
        orderBy: "name"
      });
      console.log(`Found ${response.data.files?.length || 0} folders`);
      return response.data.files || [];
    } catch (error) {
      console.error("Error browsing folders:", error);
      return [];
    }
  }
  async scanPublicDriveFolder(folderUrl) {
    try {
      const folderIdMatch = folderUrl.match(/\/folders\/([a-zA-Z0-9-_]+)/);
      if (!folderIdMatch) {
        throw new Error("Invalid Google Drive folder URL");
      }
      const folderId = folderIdMatch[1];
      console.log(`Scanning public folder: ${folderId}`);
      if (!this.drive) {
        await this.initializeAuth();
      }
      if (!this.drive) {
        throw new Error("Google Drive API not available");
      }
      const foldersResponse = await this.drive.files.list({
        q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: "files(id,name)",
        pageSize: 100
      });
      const folders = foldersResponse.data.files || [];
      console.log(`Found ${folders.length} subfolders`);
      const vehicleMatches = [];
      for (const folder of folders) {
        const matchedVehicle = this.matchFolderToVehicle(folder.name);
        if (matchedVehicle) {
          console.log(`Matched folder "${folder.name}" to vehicle: ${matchedVehicle.year} ${matchedVehicle.make} ${matchedVehicle.model}`);
          const imagesResponse = await this.drive.files.list({
            q: `'${folder.id}' in parents and mimeType contains 'image/' and trashed=false`,
            fields: "files(id,name)",
            pageSize: 20
          });
          const images = (imagesResponse.data.files || []).map(
            (file) => `https://lh3.googleusercontent.com/d/${file.id}=w800`
          );
          vehicleMatches.push({
            folder: folder.name,
            vehicle: matchedVehicle,
            images,
            imageCount: images.length
          });
        }
      }
      return {
        totalFolders: folders.length,
        matchedVehicles: vehicleMatches.length,
        matches: vehicleMatches
      };
    } catch (error) {
      console.error("Error scanning public Drive folder:", error);
      throw error;
    }
  }
  matchFolderToVehicle(folderName) {
    const cleanFolderName = folderName.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
    const vehiclesNeedingImages = [
      { stockNumber: "1008", year: "2013", make: "Ford", model: "Flex SEL", color: "white" },
      { stockNumber: "1021", year: "2020", make: "Dodge", model: "Charger", color: "White" },
      { stockNumber: "1024", year: "2014", make: "Jeep", model: "Grand Cherokee", color: "Red" },
      { stockNumber: "1027", year: "2018", make: "Honda", model: "Civic", color: "White" },
      { stockNumber: "1041", year: "2015", make: "Toyota", model: "Corolla", color: "Silver" },
      { stockNumber: "1042", year: "2018", make: "Chevrolet", model: "Silverado LT", color: "White" },
      { stockNumber: "1044", year: "2016", make: "Ford", model: "Focus", color: "Silver" },
      { stockNumber: "1049", year: "2020", make: "Chevrolet", model: "Malibu", color: "Maroon" },
      { stockNumber: "1050", year: "2019", make: "Dodge", model: "Journey", color: "Black" },
      { stockNumber: "1057", year: "2014", make: "JEEP", model: "WRANGLER SAHARA UNLIMITED", color: "GRAY" },
      { stockNumber: "1060", year: "2019", make: "HYANDAI", model: "SANTA FE", color: "SILVER" },
      { stockNumber: "1061", year: "2020", make: "KIA", model: "FORTE", color: "WHITE" },
      { stockNumber: "1064", year: "2011", make: "CHEVROLET", model: "IMPALA", color: "RED" },
      { stockNumber: "1068", year: "2016", make: "BUICK", model: "ENCORE", color: "RED" },
      { stockNumber: "1070", year: "2018", make: "SUBARU", model: "CROSSTREK", color: "GREY" }
    ];
    for (const vehicle of vehiclesNeedingImages) {
      const searchTerms = [
        vehicle.stockNumber.toLowerCase(),
        `stock ${vehicle.stockNumber.toLowerCase()}`,
        `${vehicle.year} ${vehicle.make.toLowerCase()} ${vehicle.model.toLowerCase()} ${vehicle.color.toLowerCase()}`,
        `${vehicle.make.toLowerCase()} ${vehicle.model.toLowerCase()} ${vehicle.year} ${vehicle.color.toLowerCase()}`,
        `${vehicle.year} ${vehicle.make.toLowerCase()} ${vehicle.model.toLowerCase()}`,
        `${vehicle.make.toLowerCase()} ${vehicle.model.toLowerCase()} ${vehicle.year}`,
        vehicle.color.toLowerCase(),
        `${vehicle.make.toLowerCase()} ${vehicle.model.toLowerCase()}`
      ];
      for (const term of searchTerms) {
        if (cleanFolderName.includes(term) || term.includes(cleanFolderName)) {
          return vehicle;
        }
      }
    }
    return null;
  }
  async applyDriveMatches(matches) {
    const results = {
      success: [],
      errors: [],
      totalUpdated: 0
    };
    const groupedMatches = /* @__PURE__ */ new Map();
    for (const match of matches) {
      const stockNumber = match.vehicle.stockNumber;
      if (!groupedMatches.has(stockNumber)) {
        groupedMatches.set(stockNumber, {
          vehicle: match.vehicle,
          allImages: [],
          folders: []
        });
      }
      const group = groupedMatches.get(stockNumber);
      group.allImages.push(...match.images);
      group.folders.push(match.folder);
    }
    for (const [stockNumber, group] of Array.from(groupedMatches.entries())) {
      try {
        const vehicles2 = await storage.getAllVehicles();
        const vehicleToUpdate = vehicles2.find((v) => v.stockNumber === stockNumber);
        if (!vehicleToUpdate) {
          throw new Error(`Vehicle with stock number ${stockNumber} not found`);
        }
        const uniqueImages = Array.from(new Set(group.allImages));
        const updatedVehicle = await storage.updateVehicle(vehicleToUpdate.id, {
          images: uniqueImages
        });
        if (updatedVehicle) {
          results.success.push({
            stockNumber,
            vehicle: `${group.vehicle.year} ${group.vehicle.make} ${group.vehicle.model}`,
            imageCount: uniqueImages.length,
            folders: group.folders
          });
          results.totalUpdated++;
          console.log(`\u2705 Updated ${stockNumber} with ${uniqueImages.length} images from ${group.folders.length} folders`);
        }
      } catch (error) {
        console.error(`Error updating vehicle ${stockNumber}:`, error);
        results.errors.push({
          stockNumber,
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
    return results;
  }
  async browseFiles(folderId) {
    try {
      if (!this.drive) {
        await this.initializeAuth();
      }
      if (!this.drive) {
        console.log("Google Drive API not available - returning demo images");
        return [
          {
            id: "1DEMO123",
            name: "demo-car-1.jpg",
            thumbnailLink: "https://via.placeholder.com/150x150/37ca37/ffffff?text=Demo+Car+1",
            webViewLink: "https://via.placeholder.com/800x600/37ca37/ffffff?text=Demo+Car+1"
          },
          {
            id: "1DEMO456",
            name: "demo-car-2.jpg",
            thumbnailLink: "https://via.placeholder.com/150x150/37ca37/ffffff?text=Demo+Car+2",
            webViewLink: "https://via.placeholder.com/800x600/37ca37/ffffff?text=Demo+Car+2"
          }
        ];
      }
      console.log(`Browsing files in folder: ${folderId}`);
      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`,
        fields: "files(id,name,thumbnailLink,webViewLink,createdTime,size)",
        pageSize: 50,
        orderBy: "createdTime desc"
      });
      console.log(`Found ${response.data.files?.length || 0} image files`);
      return response.data.files || [];
    } catch (error) {
      console.error("Error browsing files:", error);
      return [
        {
          id: "1ERROR123",
          name: "error-demo.jpg",
          thumbnailLink: "https://via.placeholder.com/150x150/ff6b6b/ffffff?text=Error+Loading",
          webViewLink: "https://via.placeholder.com/800x600/ff6b6b/ffffff?text=Error+Loading"
        }
      ];
    }
  }
  async findOrCreateVehicleFolder(vehicleFolderName) {
    try {
      await this.initializeAuth();
      const searchResponse = await this.drive.files.list({
        q: `name='${vehicleFolderName}' and mimeType='application/vnd.google-apps.folder'`,
        fields: "files(id,name)"
      });
      if (searchResponse.data.files && searchResponse.data.files.length > 0) {
        return searchResponse.data.files[0].id;
      }
      const folderMetadata = {
        name: vehicleFolderName,
        mimeType: "application/vnd.google-apps.folder",
        parents: [DRIVE_FOLDER_ID]
      };
      const folderResponse = await this.drive.files.create({
        resource: folderMetadata,
        fields: "id"
      });
      return folderResponse.data.id;
    } catch (error) {
      console.error("Error finding/creating vehicle folder:", error);
      return DRIVE_FOLDER_ID;
    }
  }
  async createVehicleFromRow(sheetVehicle) {
    const slug = this.generateSlug(sheetVehicle.year, sheetVehicle.make, sheetVehicle.model, sheetVehicle.vin);
    const vehicleData = {
      slug,
      title: `${sheetVehicle.year} ${sheetVehicle.make} ${sheetVehicle.model}`,
      description: sheetVehicle.description,
      price: sheetVehicle.price,
      year: sheetVehicle.year.toString(),
      make: sheetVehicle.make,
      model: sheetVehicle.model,
      vin: sheetVehicle.vin,
      stockNumber: sheetVehicle.stockNumber,
      mileage: sheetVehicle.miles.toString(),
      exteriorColor: sheetVehicle.exteriorColor,
      interiorColor: sheetVehicle.interiorColor,
      engine: "Not specified",
      transmission: "Not specified",
      driveType: "Not specified",
      status: "for-sale",
      images: sheetVehicle.images || [],
      keyFeatures: this.extractKeyFeatures(sheetVehicle.description),
      metaTitle: `${sheetVehicle.year} ${sheetVehicle.make} ${sheetVehicle.model} - T-Rex Motors`,
      metaDescription: `${sheetVehicle.year} ${sheetVehicle.make} ${sheetVehicle.model} with ${sheetVehicle.miles.toLocaleString()} miles. ${sheetVehicle.description}`,
      notes: sheetVehicle.notes
    };
    return await storage.createVehicle(vehicleData);
  }
  generateSlug(year, make, model, vin) {
    const baseSlug = `${year}-${make}-${model}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const vinSuffix = vin.slice(-6).toLowerCase();
    return `${baseSlug}-${vinSuffix}`;
  }
  extractKeyFeatures(description) {
    const features = [];
    if (description.toLowerCase().includes("low miles")) features.push("Low Mileage");
    if (description.toLowerCase().includes("one owner")) features.push("Single Owner");
    if (description.toLowerCase().includes("clean")) features.push("Clean History");
    if (description.toLowerCase().includes("maintenance")) features.push("Well Maintained");
    return features;
  }
};
async function registerAdminRoutes(app2) {
  const adminService = new AdminService();
  app2.get("/api/admin/sheet-data", async (req, res) => {
    try {
      const data = await adminService.getSheetData();
      res.json(data);
    } catch (error) {
      console.error("Error fetching sheet data:", error);
      res.status(500).json({ error: "Failed to fetch sheet data" });
    }
  });
  app2.get("/api/admin/sheet-row/:rowNumber", async (req, res) => {
    try {
      const rowNumber = parseInt(req.params.rowNumber);
      const data = await adminService.getSheetRow(rowNumber);
      res.json(data);
    } catch (error) {
      console.error("Error fetching sheet row:", error);
      res.status(500).json({ error: "Failed to fetch sheet row" });
    }
  });
  app2.get("/api/admin/browse-folders", async (req, res) => {
    try {
      const parentId = req.query.parentId || "root";
      const folders = await adminService.browseFolders(parentId);
      res.json(folders);
    } catch (error) {
      console.error("Error browsing folders:", error);
      res.status(500).json({ error: "Failed to browse folders" });
    }
  });
  app2.post("/api/admin/scan-drive-folder", async (req, res) => {
    try {
      const { folderUrl } = req.body;
      if (!folderUrl) {
        return res.status(400).json({ error: "Folder URL is required" });
      }
      const result = await adminService.scanPublicDriveFolder(folderUrl);
      res.json(result);
    } catch (error) {
      console.error("Error scanning Drive folder:", error);
      res.status(500).json({ error: "Failed to scan Drive folder: " + (error instanceof Error ? error.message : "Unknown error") });
    }
  });
  app2.post("/api/admin/apply-drive-matches", async (req, res) => {
    try {
      const { matches } = req.body;
      if (!matches || !Array.isArray(matches)) {
        return res.status(400).json({ error: "Matches array is required" });
      }
      const results = await adminService.applyDriveMatches(matches);
      res.json(results);
    } catch (error) {
      console.error("Error applying Drive matches:", error);
      res.status(500).json({ error: "Failed to apply matches: " + (error instanceof Error ? error.message : "Unknown error") });
    }
  });
  app2.get("/api/admin/browse-files/:folderId", async (req, res) => {
    try {
      const folderId = req.params.folderId;
      const files = await adminService.browseFiles(folderId);
      res.json(files);
    } catch (error) {
      console.error("Error browsing files:", error);
      res.status(500).json({ error: "Failed to browse files" });
    }
  });
  app2.post("/api/admin/import-row", async (req, res) => {
    try {
      const { rowNumber } = req.body;
      const sheetVehicle = await adminService.getSheetRow(rowNumber);
      if (!sheetVehicle) {
        return res.status(404).json({ error: "No data found in row" });
      }
      const vehicle = await adminService.createVehicleFromRow(sheetVehicle);
      res.json({ success: true, vehicle });
    } catch (error) {
      console.error("Error importing row:", error);
      res.status(500).json({ error: "Failed to import row" });
    }
  });
  app2.get("/api/admin/drafts", async (req, res) => {
    try {
      const drafts = vehicleDrafts.getAll();
      res.json(drafts);
    } catch (error) {
      console.error("Error fetching drafts:", error);
      res.status(500).json({ error: "Failed to fetch drafts" });
    }
  });
  app2.post("/api/admin/create-vehicle", async (req, res) => {
    try {
      const vehicleData = req.body;
      if (!vehicleData.year || !vehicleData.make || !vehicleData.model) {
        return res.status(400).json({ error: "Year, make, and model are required" });
      }
      const baseSlug = `${vehicleData.year}-${vehicleData.make}-${vehicleData.model}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const vinSuffix = vehicleData.vin ? vehicleData.vin.slice(-6).toLowerCase() : Date.now().toString().slice(-6);
      const slug = `${baseSlug}-${vinSuffix}`;
      const completeVehicleData = {
        slug,
        title: vehicleData.title,
        description: vehicleData.description,
        price: vehicleData.price,
        status: vehicleData.status || "for-sale",
        mileage: vehicleData.mileage,
        year: vehicleData.year,
        make: vehicleData.make,
        model: vehicleData.model,
        vin: vehicleData.vin,
        stockNumber: vehicleData.stockNumber,
        engine: vehicleData.engine || "Not specified",
        transmission: vehicleData.transmission || "Not specified",
        driveType: vehicleData.driveType || "Not specified",
        exteriorColor: vehicleData.exteriorColor,
        interiorColor: vehicleData.interiorColor,
        images: vehicleData.images || [],
        keyFeatures: vehicleData.keyFeatures || [],
        metaTitle: vehicleData.metaTitle || `${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`,
        metaDescription: vehicleData.metaDescription || vehicleData.description,
        carfaxEmbedCode: vehicleData.carfaxEmbedCode,
        autoCheckUrl: vehicleData.autoCheckUrl,
        vehicleHistoryScore: vehicleData.vehicleHistoryScore,
        accidentHistory: vehicleData.accidentHistory || 0,
        previousOwners: vehicleData.previousOwners || 0,
        serviceRecords: vehicleData.serviceRecords || 0,
        titleStatus: vehicleData.titleStatus || "unknown",
        lastHistoryUpdate: vehicleData.lastHistoryUpdate,
        bannerReduced: vehicleData.bannerReduced || false,
        bannerSold: vehicleData.bannerSold || false,
        bannerGreatDeal: vehicleData.bannerGreatDeal || false
      };
      console.log("Creating vehicle with slug:", slug);
      const vehicle = await storage.createVehicle(completeVehicleData);
      res.json({ success: true, vehicle });
    } catch (error) {
      console.error("Error creating vehicle:", error);
      res.status(500).json({ error: "Failed to create vehicle" });
    }
  });
  app2.post("/api/admin/upload-vehicle-image", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const { vehicleId, vehicleTitle } = req.body;
      const file = req.file;
      await adminService.initializeAuth();
      const vehicleFolderName = `${vehicleTitle} (ID: ${vehicleId})`.replace(/[<>:"/\\|?*]/g, "_");
      let vehicleFolderId = await adminService.findOrCreateVehicleFolder(vehicleFolderName);
      const fileMetadata = {
        name: `${Date.now()}_${file.originalname}`,
        parents: [vehicleFolderId]
      };
      const media = {
        mimeType: file.mimetype,
        body: file.buffer
      };
      const driveResponse = await adminService.drive.files.create({
        resource: fileMetadata,
        media,
        fields: "id,name,webViewLink,thumbnailLink"
      });
      await adminService.drive.permissions.create({
        fileId: driveResponse.data.id,
        resource: {
          role: "reader",
          type: "anyone"
        }
      });
      const imageUrl = `https://drive.google.com/uc?id=${driveResponse.data.id}`;
      const vehicle = await storage.getVehicleById(parseInt(vehicleId));
      if (vehicle) {
        const updatedImages = [...vehicle.images, imageUrl];
        await storage.updateVehicle(parseInt(vehicleId), { images: updatedImages });
      }
      res.json({
        success: true,
        fileId: driveResponse.data.id,
        imageUrl,
        thumbnailUrl: driveResponse.data.thumbnailLink,
        fileName: driveResponse.data.name
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Failed to upload image to Google Drive" });
    }
  });
  app2.post("/api/admin/vehicles/:id/drive-urls", async (req, res) => {
    try {
      const { id } = req.params;
      const { imageUrls } = req.body;
      if (!imageUrls || !Array.isArray(imageUrls)) {
        return res.status(400).json({ error: "imageUrls array is required" });
      }
      const processedUrls = imageUrls.map((url) => {
        if (!url || !url.trim()) return null;
        if (url.includes("drive.google.com/file/d/")) {
          const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
          if (match) {
            return `https://drive.google.com/uc?id=${match[1]}`;
          }
        }
        return url.trim();
      }).filter((url) => url !== null);
      if (processedUrls.length === 0) {
        return res.status(400).json({ error: "No valid image URLs provided" });
      }
      const vehicle = await storage.getVehicleById(parseInt(id));
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      const updatedImages = [...vehicle.images, ...processedUrls];
      await storage.updateVehicle(parseInt(id), { images: updatedImages });
      res.json({
        success: true,
        imageUrls: processedUrls,
        totalImages: updatedImages.length
      });
    } catch (error) {
      console.error("Error adding Google Drive URLs:", error);
      res.status(500).json({ error: "Failed to add images from Google Drive URLs" });
    }
  });
  app2.post("/api/vehicles/:id/add-drive-images", async (req, res) => {
    try {
      const { id } = req.params;
      const { fileIds } = req.body;
      if (!Array.isArray(fileIds) || fileIds.length === 0) {
        return res.status(400).json({ error: "File IDs are required" });
      }
      const vehicle = await storage.getVehicleById(parseInt(id));
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      const newImageUrls = fileIds.map(
        (fileId) => `https://drive.google.com/uc?id=${fileId}`
      );
      const updatedImages = [...vehicle.images, ...newImageUrls];
      const updatedVehicle = await storage.updateVehicle(parseInt(id), { images: updatedImages });
      res.json({
        success: true,
        images: updatedVehicle.images,
        addedCount: newImageUrls.length
      });
    } catch (error) {
      console.error("Error adding Drive images:", error);
      res.status(500).json({ error: "Failed to add images from Google Drive" });
    }
  });
  app2.delete("/api/vehicles/:id/images/:imageIndex", async (req, res) => {
    try {
      const { id, imageIndex } = req.params;
      const index = parseInt(imageIndex);
      const vehicle = await storage.getVehicleById(parseInt(id));
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      if (index < 0 || index >= vehicle.images.length) {
        return res.status(400).json({ error: "Invalid image index" });
      }
      const updatedImages = vehicle.images.filter((_, i) => i !== index);
      const updatedVehicle = await storage.updateVehicle(parseInt(id), { images: updatedImages });
      res.json({
        success: true,
        images: updatedVehicle.images,
        removedIndex: index
      });
    } catch (error) {
      console.error("Error removing image:", error);
      res.status(500).json({ error: "Failed to remove image" });
    }
  });
  app2.patch("/api/vehicles/:id/reorder-images", async (req, res) => {
    try {
      const { id } = req.params;
      const { imageOrder } = req.body;
      if (!Array.isArray(imageOrder)) {
        return res.status(400).json({ error: "Image order array is required" });
      }
      const vehicle = await storage.getVehicleById(parseInt(id));
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      const updatedVehicle = await storage.updateVehicle(parseInt(id), { images: imageOrder });
      res.json({
        success: true,
        images: updatedVehicle.images
      });
    } catch (error) {
      console.error("Error reordering images:", error);
      res.status(500).json({ error: "Failed to reorder images" });
    }
  });
  app2.get("/api/admin/applications", async (req, res) => {
    try {
      const applications = await storage.getAllCustomerApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });
  app2.get("/api/admin/applications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const application = await storage.getCustomerApplication(parseInt(id));
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      console.error("Error fetching application:", error);
      res.status(500).json({ error: "Failed to fetch application" });
    }
  });
  app2.patch("/api/admin/applications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, adminNotes, reviewedBy } = req.body;
      const updates = {};
      if (status) updates.status = status;
      if (adminNotes !== void 0) updates.adminNotes = adminNotes;
      if (reviewedBy) updates.reviewedBy = reviewedBy;
      if (status && status !== "pending") {
        updates.reviewedAt = /* @__PURE__ */ new Date();
      }
      const application = await storage.updateCustomerApplication(parseInt(id), updates);
      res.json(application);
    } catch (error) {
      console.error("Error updating application:", error);
      res.status(500).json({ error: "Failed to update application" });
    }
  });
  app2.delete("/api/admin/applications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteCustomerApplication(parseInt(id));
      res.json({ message: "Application deleted successfully" });
    } catch (error) {
      console.error("Error deleting application:", error);
      res.status(500).json({ error: "Failed to delete application" });
    }
  });
  app2.get("/api/admin/banner-stats", async (req, res) => {
    try {
      const { bannerManager: bannerManager2 } = await Promise.resolve().then(() => (init_banner_manager(), banner_manager_exports));
      const stats = await bannerManager2.getBannerStats();
      res.json(stats);
    } catch (error) {
      console.error("Error getting banner stats:", error);
      res.status(500).json({ error: "Failed to get banner stats" });
    }
  });
  app2.post("/api/admin/cleanup-banners", async (req, res) => {
    try {
      const { bannerManager: bannerManager2 } = await Promise.resolve().then(() => (init_banner_manager(), banner_manager_exports));
      const removedCount = await bannerManager2.manualCleanup();
      res.json({
        success: true,
        removedCount,
        message: `Removed NEW banners from ${removedCount} vehicles`
      });
    } catch (error) {
      console.error("Error cleaning up banners:", error);
      res.status(500).json({ error: "Failed to cleanup banners" });
    }
  });
  app2.get("/api/admin/system-status", async (req, res) => {
    try {
      const status = await getSystemStatus();
      res.json(status);
    } catch (error) {
      console.error("Error getting system status:", error);
      res.status(500).json({ error: "Failed to get system status" });
    }
  });
  app2.post("/api/admin/test-connections", async (req, res) => {
    try {
      const results = await testAllConnections();
      res.json(results);
    } catch (error) {
      console.error("Error testing connections:", error);
      res.status(500).json({ error: "Failed to test connections" });
    }
  });
  app2.post("/api/admin/update-inventory-bulk", async (req, res) => {
    try {
      const { sheetData } = req.body;
      if (!sheetData) {
        return res.status(400).json({ error: "Sheet data is required" });
      }
      const result = await updateInventoryFromSheet(sheetData);
      res.json({
        success: true,
        processed: result.processed,
        message: `Successfully updated inventory with ${result.processed} vehicles`
      });
    } catch (error) {
      console.error("Error updating inventory:", error);
      res.status(500).json({ error: "Failed to update inventory" });
    }
  });
}
async function getSystemStatus() {
  const startTime = Date.now();
  let databaseStatus = { connected: false, latency: 0 };
  try {
    const dbStart = Date.now();
    await db.select().from(vehicles).limit(1);
    databaseStatus = {
      connected: true,
      latency: Date.now() - dbStart
    };
  } catch (error) {
    databaseStatus = {
      connected: false,
      latency: 0,
      error: error instanceof Error ? error.message : "Unknown database error"
    };
  }
  let googleSheetsStatus = {
    connected: false,
    authenticated: false,
    sheetsFound: 0
  };
  try {
    const adminService = new AdminService();
    await adminService.initializeAuth();
    if (adminService.sheets) {
      googleSheetsStatus.authenticated = true;
      const sheetData = await adminService.getSheetData();
      googleSheetsStatus.connected = true;
      googleSheetsStatus.sheetsFound = Array.isArray(sheetData) ? sheetData.length : 0;
    }
  } catch (error) {
    googleSheetsStatus.error = error instanceof Error ? error.message : "Google Sheets connection failed";
  }
  let googleDriveStatus = {
    connected: false,
    authenticated: false,
    foldersFound: 0
  };
  try {
    const adminService = new AdminService();
    await adminService.initializeAuth();
    if (adminService.drive) {
      googleDriveStatus.authenticated = true;
      const folders = await adminService.browseFolders("root");
      googleDriveStatus.connected = true;
      googleDriveStatus.foldersFound = Array.isArray(folders) ? folders.length : 0;
    }
  } catch (error) {
    googleDriveStatus.error = error instanceof Error ? error.message : "Google Drive connection failed";
  }
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  const memoryPercent = memoryUsage.heapUsed / memoryUsage.heapTotal * 100;
  const serverStatus = {
    status: memoryPercent > 98 ? "error" : memoryPercent > 85 ? "warning" : "healthy",
    uptime: formatUptime(uptime),
    memory: memoryPercent
  };
  return {
    database: databaseStatus,
    googleSheets: googleSheetsStatus,
    googleDrive: googleDriveStatus,
    server: serverStatus,
    lastChecked: (/* @__PURE__ */ new Date()).toISOString(),
    responseTime: Date.now() - startTime
  };
}
async function testAllConnections() {
  console.log("Testing all system connections...");
  const status = await getSystemStatus();
  console.log("Connection test results:", {
    database: status.database.connected ? "OK" : "FAILED",
    googleSheets: status.googleSheets.connected ? "OK" : "FAILED",
    googleDrive: status.googleDrive.connected ? "OK" : "FAILED",
    server: status.server.status
  });
  return {
    success: true,
    message: "Connection tests completed",
    results: status
  };
}
function formatUptime(seconds) {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor(seconds % (24 * 60 * 60) / (60 * 60));
  const minutes = Math.floor(seconds % (60 * 60) / 60);
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

// server/vehicle-history-api.ts
import axios from "axios";
var CarfaxProvider = class {
  name = "CARFAX";
  apiUrl = "https://api.carfax.com/v1";
  apiKey = process.env.CARFAX_API_KEY;
  async authenticate() {
    try {
      if (!this.apiKey) return false;
      const response = await axios.get(`${this.apiUrl}/auth/validate`, {
        headers: { "Authorization": `Bearer ${this.apiKey}` }
      });
      return response.status === 200;
    } catch (error) {
      console.error("CARFAX authentication failed:", error);
      return false;
    }
  }
  async getReport(vin) {
    const response = await axios.get(`${this.apiUrl}/reports/${vin}`, {
      headers: { "Authorization": `Bearer ${this.apiKey}` }
    });
    const data = response.data;
    return {
      provider: "carfax",
      vin,
      reportId: data.reportId,
      reportUrl: data.reportUrl,
      embedCode: data.embedCode,
      summary: {
        titleStatus: this.mapTitleStatus(data.titleInfo?.status),
        previousOwners: data.ownershipSummary?.totalOwners || 0,
        accidentHistory: data.accidentSummary?.totalAccidents || 0,
        serviceRecords: data.serviceSummary?.totalRecords || 0,
        historyScore: data.scorecard?.overallScore || 0,
        lastReported: data.lastUpdated
      },
      details: {
        titleHistory: data.titleHistory || [],
        ownershipHistory: data.ownershipHistory || [],
        accidentRecords: data.accidentHistory || [],
        serviceHistory: data.serviceHistory || []
      },
      pricing: {
        reportCost: data.pricing?.cost || 39.99,
        currency: "USD"
      },
      metadata: {
        reportDate: data.createdAt,
        expirationDate: data.expiresAt,
        confidence: data.confidence || 95
      }
    };
  }
  async requestReport(vin) {
    const response = await axios.post(`${this.apiUrl}/reports/request`, {
      vin,
      reportType: "full"
    }, {
      headers: { "Authorization": `Bearer ${this.apiKey}` }
    });
    return response.data.reportId;
  }
  async getReportStatus(reportId) {
    const response = await axios.get(`${this.apiUrl}/reports/${reportId}/status`, {
      headers: { "Authorization": `Bearer ${this.apiKey}` }
    });
    return response.data.status;
  }
  mapTitleStatus(status) {
    switch (status?.toLowerCase()) {
      case "clean":
        return "clean";
      case "branded":
      case "rebuilt":
      case "reconstructed":
        return "branded";
      case "lemon":
        return "lemon";
      case "flood":
      case "water damage":
        return "flood";
      case "salvage":
      case "total loss":
        return "salvage";
      default:
        return "unknown";
    }
  }
};
var AutoCheckProvider = class {
  name = "AutoCheck";
  apiUrl = "https://api.autocheck.com/v2";
  apiKey = process.env.AUTOCHECK_API_KEY;
  async authenticate() {
    try {
      if (!this.apiKey) return false;
      const response = await axios.get(`${this.apiUrl}/validate`, {
        headers: { "X-API-Key": this.apiKey }
      });
      return response.status === 200;
    } catch (error) {
      console.error("AutoCheck authentication failed:", error);
      return false;
    }
  }
  async getReport(vin) {
    const response = await axios.get(`${this.apiUrl}/vehicle/${vin}/history`, {
      headers: { "X-API-Key": this.apiKey }
    });
    const data = response.data;
    return {
      provider: "autocheck",
      vin,
      reportId: data.id,
      reportUrl: data.reportUrl,
      summary: {
        titleStatus: this.mapTitleStatus(data.title?.brand),
        previousOwners: data.ownership?.count || 0,
        accidentHistory: data.accidents?.count || 0,
        serviceRecords: data.maintenance?.count || 0,
        historyScore: data.autoCheckScore || 0,
        lastReported: data.lastUpdated
      },
      details: {
        titleHistory: data.titleEvents || [],
        ownershipHistory: data.ownershipEvents || [],
        accidentRecords: data.accidentEvents || [],
        serviceHistory: data.maintenanceEvents || []
      },
      pricing: {
        reportCost: 24.99,
        currency: "USD"
      },
      metadata: {
        reportDate: data.generatedAt,
        expirationDate: data.expiresAt,
        confidence: data.confidenceScore || 90
      }
    };
  }
  async requestReport(vin) {
    const response = await axios.post(`${this.apiUrl}/reports`, {
      vin,
      productType: "full_history"
    }, {
      headers: { "X-API-Key": this.apiKey }
    });
    return response.data.reportId;
  }
  async getReportStatus(reportId) {
    const response = await axios.get(`${this.apiUrl}/reports/${reportId}`, {
      headers: { "X-API-Key": this.apiKey }
    });
    return response.data.status;
  }
  mapTitleStatus(brand) {
    switch (brand?.toLowerCase()) {
      case "clear":
      case "clean":
        return "clean";
      case "branded":
      case "manufacturer buyback":
        return "branded";
      case "lemon law buyback":
        return "lemon";
      case "flood damage":
      case "water damage":
        return "flood";
      case "salvage":
      case "junk":
        return "salvage";
      default:
        return "unknown";
    }
  }
};
var VehicleHistoryService = class {
  providers = [];
  constructor() {
    this.providers = [
      new CarfaxProvider(),
      new AutoCheckProvider()
    ];
  }
  async getAvailableProviders() {
    const available = [];
    for (const provider of this.providers) {
      const isAuthenticated = await provider.authenticate();
      if (isAuthenticated) {
        available.push(provider.name);
      }
    }
    return available;
  }
  async getReport(vin, preferredProvider) {
    if (preferredProvider) {
      const provider = this.providers.find((p) => p.name.toLowerCase() === preferredProvider.toLowerCase());
      if (provider && await provider.authenticate()) {
        try {
          return await provider.getReport(vin);
        } catch (error) {
          console.error(`Failed to get report from ${provider.name}:`, error);
        }
      }
    }
    for (const provider of this.providers) {
      if (await provider.authenticate()) {
        try {
          return await provider.getReport(vin);
        } catch (error) {
          console.error(`Failed to get report from ${provider.name}:`, error);
          continue;
        }
      }
    }
    return null;
  }
  async requestReport(vin, provider) {
    const historyProvider = this.providers.find((p) => p.name.toLowerCase() === provider.toLowerCase());
    if (!historyProvider || !await historyProvider.authenticate()) {
      return null;
    }
    try {
      return await historyProvider.requestReport(vin);
    } catch (error) {
      console.error(`Failed to request report from ${provider}:`, error);
      return null;
    }
  }
  async getReportStatus(reportId, provider) {
    const historyProvider = this.providers.find((p) => p.name.toLowerCase() === provider.toLowerCase());
    if (!historyProvider || !await historyProvider.authenticate()) {
      return null;
    }
    try {
      return await historyProvider.getReportStatus(reportId);
    } catch (error) {
      console.error(`Failed to get report status from ${provider}:`, error);
      return null;
    }
  }
  async getBestReport(vin) {
    const reports = [];
    for (const provider of this.providers) {
      if (await provider.authenticate()) {
        try {
          const report = await provider.getReport(vin);
          reports.push(report);
        } catch (error) {
          console.error(`Failed to get report from ${provider.name}:`, error);
        }
      }
    }
    if (reports.length === 0) return null;
    return reports.reduce(
      (best, current) => current.metadata.confidence > best.metadata.confidence ? current : best
    );
  }
  formatReportSummary(report) {
    return `${report.provider.toUpperCase()} Report Summary:
\u2022 Title Status: ${report.summary.titleStatus.replace("-", " ").toUpperCase()}
\u2022 Previous Owners: ${report.summary.previousOwners}
\u2022 Reported Accidents: ${report.summary.accidentHistory}
\u2022 Service Records: ${report.summary.serviceRecords}
\u2022 History Score: ${report.summary.historyScore}/100
\u2022 Confidence: ${report.metadata.confidence}%
\u2022 Last Updated: ${new Date(report.summary.lastReported).toLocaleDateString()}`;
  }
};
var vehicleHistoryService = new VehicleHistoryService();

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/vehicles", async (req, res) => {
    try {
      const vehicles2 = await storage.getAllVehicles();
      res.json(vehicles2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vehicles" });
    }
  });
  app2.get("/api/vehicles/search", async (req, res) => {
    try {
      const { make, model, year, maxPrice, status } = req.query;
      const filters = {};
      if (make) filters.make = make;
      if (model) filters.model = model;
      if (year) filters.year = year;
      if (maxPrice) filters.maxPrice = parseInt(maxPrice);
      if (status) filters.status = status;
      const vehicles2 = await storage.searchVehicles(filters);
      res.json(vehicles2);
    } catch (error) {
      res.status(500).json({ message: "Failed to search vehicles" });
    }
  });
  app2.get("/api/vehicles/:slug", async (req, res) => {
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
  app2.post("/api/vehicles", async (req, res) => {
    try {
      const vehicleData = req.body;
      if (!vehicleData.year || !vehicleData.make || !vehicleData.model) {
        return res.status(400).json({ message: "Year, make, and model are required" });
      }
      if (!vehicleData.slug) {
        vehicleData.slug = await generateUniqueSlug(vehicleData.year, vehicleData.make, vehicleData.model, vehicleData.vin);
      }
      const validatedData = insertVehicleSchema.parse(vehicleData);
      const vehicle = await storage.createVehicle(validatedData);
      res.status(201).json(vehicle);
    } catch (error) {
      console.error("Error creating vehicle:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      if (error instanceof Error && "code" in error && error.code === "23505") {
        return res.status(409).json({ message: "A vehicle with this information already exists" });
      }
      res.status(500).json({ message: "Failed to create vehicle" });
    }
  });
  app2.post("/api/inquiries", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validatedData);
      res.status(201).json(inquiry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create inquiry" });
    }
  });
  app2.get("/api/inquiries", async (req, res) => {
    try {
      const inquiries2 = await storage.getAllInquiries();
      res.json(inquiries2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });
  app2.patch("/api/vehicles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const vehicle = await storage.updateVehicle(parseInt(id), updates);
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ message: "Failed to update vehicle" });
    }
  });
  app2.delete("/api/vehicles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteVehicle(parseInt(id));
      res.json({ message: "Vehicle deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete vehicle" });
    }
  });
  app2.patch("/api/vehicles/:id/history-reports", async (req, res) => {
    try {
      const { id } = req.params;
      const historyData = req.body;
      const vehicle = await storage.updateVehicle(parseInt(id), historyData);
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ message: "Failed to update vehicle history reports" });
    }
  });
  app2.patch("/api/vehicles/:id/carfax", async (req, res) => {
    try {
      const { id } = req.params;
      const { carfaxEmbedCode } = req.body;
      if (!carfaxEmbedCode || typeof carfaxEmbedCode !== "string") {
        return res.status(400).json({ message: "CarFax embed code is required" });
      }
      const vehicle = await storage.updateVehicleCarfax(parseInt(id), carfaxEmbedCode);
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ message: "Failed to update CarFax embed code" });
    }
  });
  app2.options("/api/webhook/vehicle-update", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(200);
  });
  app2.post("/api/webhook/vehicle-update", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    try {
      console.log("Received webhook from Google Sheets:", req.body);
      const vehicleData = req.body;
      const insertVehicle = {
        slug: generateSlug(vehicleData.year, vehicleData.make, vehicleData.model, vehicleData.vin),
        title: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`,
        description: vehicleData.description || "",
        price: Number(vehicleData.price) || 0,
        status: vehicleData.status || "for-sale",
        mileage: vehicleData.miles?.toString() || "0",
        year: vehicleData.year?.toString() || "",
        make: vehicleData.make || "",
        model: vehicleData.model || "",
        vin: vehicleData.vin || "",
        stockNumber: vehicleData.stockNumber || "",
        engine: "Not specified",
        transmission: "Not specified",
        driveType: "Not specified",
        exteriorColor: vehicleData.exteriorColor || "",
        interiorColor: vehicleData.interiorColor || "",
        images: [],
        keyFeatures: [],
        metaTitle: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model} - T-Rex Motors`,
        metaDescription: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model} with ${vehicleData.miles || 0} miles.`,
        notes: vehicleData.notes || ""
      };
      const existingVehicles = await storage.searchVehicles({});
      const existingVehicle = existingVehicles.find((v) => v.vin === vehicleData.vin);
      if (existingVehicle) {
        console.log("Vehicle exists, would update if update functionality was implemented");
        res.json({
          success: true,
          action: "exists",
          message: "Vehicle already exists in database",
          vin: vehicleData.vin
        });
      } else {
        const vehicle = await storage.createVehicle(insertVehicle);
        console.log("New vehicle created:", vehicle.id);
        res.json({
          success: true,
          action: "created",
          message: "Vehicle created successfully",
          vehicle
        });
      }
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });
  app2.get("/api/webhook/add-vehicle", async (req, res) => {
    try {
      console.log("Received GET webhook with params:", req.query);
      const vehicleData = {
        status: req.query.status || "for-sale",
        stockNumber: req.query.stockNumber || "",
        vin: req.query.vin || "",
        year: parseInt(req.query.year || "0"),
        make: req.query.make || "",
        model: req.query.model || "",
        miles: parseInt(req.query.miles || "0"),
        price: parseInt(req.query.price || "0"),
        exteriorColor: req.query.exteriorColor || "",
        interiorColor: req.query.interiorColor || "",
        description: req.query.description || "",
        notes: req.query.notes || ""
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
        engine: "Not specified",
        transmission: "Not specified",
        driveType: "Not specified",
        exteriorColor: vehicleData.exteriorColor,
        interiorColor: vehicleData.interiorColor,
        images: [],
        keyFeatures: [],
        metaTitle: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model} - T-Rex Motors`,
        metaDescription: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model} with ${vehicleData.miles} miles.`,
        notes: vehicleData.notes
      };
      const existingVehicles = await storage.searchVehicles({});
      const existingVehicle = existingVehicles.find((v) => v.vin === vehicleData.vin);
      if (existingVehicle) {
        console.log("Vehicle already exists:", vehicleData.vin);
        res.json({
          success: true,
          action: "exists",
          message: "Vehicle already exists in database",
          vin: vehicleData.vin
        });
      } else {
        const vehicle = await storage.createVehicle(insertVehicle);
        console.log("New vehicle created via GET:", vehicle.id);
        res.json({
          success: true,
          action: "created",
          message: "Vehicle created successfully via GET request",
          vehicle
        });
      }
    } catch (error) {
      console.error("GET webhook error:", error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });
  app2.get("/test", (req, res) => {
    res.json({ message: "Server is working!", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app2.get("/api/vehicle-history/providers", async (req, res) => {
    try {
      const providers = await vehicleHistoryService.getAvailableProviders();
      res.json({ providers });
    } catch (error) {
      res.status(500).json({ message: "Failed to check history providers" });
    }
  });
  app2.get("/api/vehicle-history/:vin", async (req, res) => {
    try {
      const { vin } = req.params;
      const { provider } = req.query;
      const report = await vehicleHistoryService.getReport(vin, provider);
      if (!report) {
        return res.status(404).json({ message: "No history report available for this VIN" });
      }
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve vehicle history report" });
    }
  });
  app2.post("/api/vehicle-history/:vin/request", async (req, res) => {
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
  app2.post("/api/vehicles/:id/auto-populate-history", async (req, res) => {
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
      const updates = {
        vehicleHistoryScore: report.summary.historyScore,
        accidentHistory: report.summary.accidentHistory,
        previousOwners: report.summary.previousOwners,
        serviceRecords: report.summary.serviceRecords,
        titleStatus: report.summary.titleStatus,
        lastHistoryUpdate: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (report.provider === "carfax" && report.embedCode) {
        updates.carfaxEmbedCode = report.embedCode;
      }
      if (report.provider === "autocheck" && report.reportUrl) {
        updates.autoCheckUrl = report.reportUrl;
      }
      const updatedVehicle = await storage.updateVehicle(parseInt(id), updates);
      res.json({
        vehicle: updatedVehicle,
        report,
        summary: vehicleHistoryService.formatReportSummary(report)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to auto-populate vehicle history" });
    }
  });
  app2.get("/api/webhook/test", async (req, res) => {
    res.json({
      status: "success",
      message: "Webhook endpoint is working",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      url: req.url
    });
  });
  function generateSlug(year, make, model, vin) {
    const baseSlug = `${year}-${make}-${model}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const vinSuffix = vin.slice(-6).toLowerCase();
    return `${baseSlug}-${vinSuffix}`;
  }
  async function generateUniqueSlug(year, make, model, vin) {
    const baseSlug = `${year}-${make}-${model}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const vinSuffix = vin ? vin.slice(-6).toLowerCase() : Date.now().toString().slice(-6);
    let slug = `${baseSlug}-${vinSuffix}`;
    try {
      const existingVehicle = await storage.getVehicleBySlug(slug);
      if (existingVehicle) {
        const randomSuffix = Math.random().toString(36).substr(2, 4);
        slug = `${baseSlug}-${vinSuffix}-${randomSuffix}`;
      }
    } catch (error) {
    }
    return slug;
  }
  app2.post("/api/applications", async (req, res) => {
    try {
      const applicationData = insertCustomerApplicationSchema.parse(req.body);
      const application = await storage.createCustomerApplication(applicationData);
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
  app2.get("/api/applications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const application = await storage.getCustomerApplication(parseInt(id));
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
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
  await registerAdminRoutes(app2);
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, User-Agent");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
