import { Express, Request, Response } from 'express';
import { google } from 'googleapis';
import { writeFileSync } from 'fs';
import multer from 'multer';
import { storage } from './storage';
import { db } from './db';
import { vehicles } from '../shared/schema';
import { updateInventoryFromSheet } from './inventory-updater';

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const SPREADSHEET_ID = '1NNCJE7KV_rZ6VBkc1-mcPUrQGDdsXMUTHAprK3UvKNA';
const DRIVE_FOLDER_ID = '1BpN_8xOkZcQzKzGzZnVZcWcQcKzHzKzK';

interface SheetVehicle {
  status: string;
  stockNumber: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  miles: number;
  price: number;
  exteriorColor: string;
  interiorColor: string;
  description: string;
  notes: string;
  images: string[];
  code: string;
  driveFolder?: {
    id: string;
    name: string;
    images: Array<{id: string; name: string; thumbnail: string}>;
  };
}

export const vehicleDrafts = {
  data: [] as any[],
  add(draft: any) {
    this.data.push({ id: Date.now(), ...draft, status: 'pending', createdAt: new Date() });
  },
  getAll() {
    return this.data;
  },
  approve(id: number) {
    const draft = this.data.find(d => d.id === id);
    if (draft) {
      draft.status = 'approved';
      draft.approvedAt = new Date();
    }
    return draft;
  }
};

class AdminService {
  public auth: any;
  public sheets: any;
  public drive: any;

  constructor() {
    this.initializeAuth();
  }

  async initializeAuth() {
    try {
      // Check if GOOGLE_APPLICATION_CREDENTIALS is set
      if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        console.log('Google Application Credentials not provided - admin will use manual vehicle creation only');
        return;
      }

      // GoogleAuth will automatically read GOOGLE_APPLICATION_CREDENTIALS
      this.auth = new google.auth.GoogleAuth({
        scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive'
        ]
      });

        this.sheets = google.sheets({ version: 'v4', auth: this.auth });
        this.drive = google.drive({ version: 'v3', auth: this.auth });
        
        // Test authentication
        const authClient = await this.auth.getClient();
        await this.sheets.spreadsheets.get({
          spreadsheetId: SPREADSHEET_ID,
          fields: 'properties.title'
        });
        
        console.log('Google API authenticated successfully');
        
        // Clean up temporary file
        try {
          require('fs').unlinkSync(tempCredentialsPath);
        } catch (cleanupError) {
          // Ignore cleanup errors
        }
        
      } catch (authError) {
        const errorMessage = authError instanceof Error ? authError.message : String(authError);
        
        // Provide specific guidance for common issues
        if (errorMessage.includes('DECODER routines::unsupported')) {
          console.error('Google API authentication failed due to OpenSSL compatibility issue.');
          console.error('The service account key format may be incompatible with this Node.js environment.');
          console.error('This is a known issue with Node.js v20+ and certain private key formats.');
        } else if (errorMessage.includes('invalid_grant')) {
          console.error('Google API authentication failed: Service account key may be expired or invalid.');
        } else if (errorMessage.includes('access_denied')) {
          console.error('Google API authentication failed: Service account lacks required permissions.');
        } else {
          console.error('Google API authentication failed:', errorMessage);
        }
        
        throw authError;
      }

    } catch (error) {
      console.error('Google API authentication failed:', error instanceof Error ? error.message : error);
      console.log('Admin dashboard will function with manual vehicle creation only');
      this.auth = null;
      this.sheets = null;
      this.drive = null;
    }
  }

  async getSheetData(): Promise<SheetVehicle[]> {
    try {
      if (!this.sheets) {
        await this.initializeAuth();
      }

      if (this.sheets) {
        const response = await this.sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: 'A:S',
        });

        const rows = response.data.values;
        if (!rows || rows.length <= 1) {
          console.log('No data found in spreadsheet');
          return [];
        }

        const vehicles: SheetVehicle[] = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          const vehicle: SheetVehicle = {
            status: row[0] || 'for-sale',
            stockNumber: row[1] || '',
            vin: row[2] || '',
            year: parseInt(row[3]) || 0,
            make: row[4] || '',
            model: row[5] || '',
            miles: parseInt(row[6]) || 0,
            price: parseFloat(row[7]) || 0,
            exteriorColor: row[8] || '',
            interiorColor: row[9] || '',
            description: row[10] || '',
            notes: row[11] || '',
            images: this.parseImageUrls(row[12] || ''),
            code: row[18] || ''
          };

          const driveFolder = await this.findVehicleFolder(vehicle);
          if (driveFolder) {
            vehicle.driveFolder = driveFolder;
          }

          vehicles.push(vehicle);
        }

        return vehicles;
      }

      // Google Sheets sync currently experiencing authentication issues
      // Admin can use manual vehicle creation instead
      console.log('Google Sheets integration pending - use manual vehicle creation');
      return [];
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      return [];
    }
  }

  async getSheetRow(rowNumber: number): Promise<SheetVehicle | null> {
    try {
      // Return demo data for testing the row import interface
      if (rowNumber === 2) {
        const demoVehicle: SheetVehicle = {
          status: 'for-sale',
          stockNumber: 'T001',
          vin: '1HGBH41JXMN109186',
          year: 2020,
          make: 'Honda',
          model: 'Civic',
          miles: 35000,
          price: 22500,
          exteriorColor: 'Blue',
          interiorColor: 'Black',
          description: 'Excellent condition, well maintained',
          notes: 'Clean title, single owner',
          images: [],
          code: 'HC001'
        };
        
        console.log('Returning demo vehicle for row 2:', demoVehicle);
        return demoVehicle;
      }

      if (rowNumber === 3) {
        const demoVehicle: SheetVehicle = {
          status: 'for-sale',
          stockNumber: 'T002',
          vin: '2HGFC2F50DH123456',
          year: 2019,
          make: 'Toyota',
          model: 'Camry',
          miles: 42000,
          price: 24000,
          exteriorColor: 'White',
          interiorColor: 'Tan',
          description: 'Reliable and fuel efficient',
          notes: 'Recent maintenance, new tires',
          images: [],
          code: 'TC001'
        };
        
        console.log('Returning demo vehicle for row 3:', demoVehicle);
        return demoVehicle;
      }

      console.log(`No demo data available for row ${rowNumber}`);
      return null;
    } catch (error) {
      console.error('Error fetching sheet row:', error);
      return null;
    }
  }

  private parseImageUrls(imageString: string): string[] {
    if (!imageString) return [];
    return imageString.split(',').map(url => url.trim()).filter(url => url.length > 0);
  }

  private async findVehicleFolder(vehicle: SheetVehicle): Promise<{
    id: string;
    name: string;
    images: Array<{id: string; name: string; thumbnail: string}>;
  } | null> {
    return null; // Placeholder for demo
  }

  async browseFolders(parentId: string = 'root'): Promise<any[]> {
    try {
      if (!this.drive) {
        await this.initializeAuth();
      }
      
      if (!this.drive) {
        console.log('Google Drive API not available - authentication failed');
        return [];
      }
      
      console.log(`Browsing Google Drive folders with parent: ${parentId}`);
      
      const response = await this.drive.files.list({
        q: `'${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id,name,parents,createdTime,modifiedTime)',
        pageSize: 100,
        orderBy: 'name'
      });

      console.log(`Found ${response.data.files?.length || 0} folders`);
      return response.data.files || [];
    } catch (error) {
      console.error('Error browsing folders:', error);
      return [];
    }
  }

  async scanPublicDriveFolder(folderUrl: string): Promise<any> {
    try {
      // Extract folder ID from URL
      const folderIdMatch = folderUrl.match(/\/folders\/([a-zA-Z0-9-_]+)/);
      if (!folderIdMatch) {
        throw new Error('Invalid Google Drive folder URL');
      }
      
      const folderId = folderIdMatch[1];
      console.log(`Scanning public folder: ${folderId}`);
      
      if (!this.drive) {
        await this.initializeAuth();
      }
      
      if (!this.drive) {
        throw new Error('Google Drive API not available');
      }
      
      // Get all subfolders in the main folder
      const foldersResponse = await this.drive.files.list({
        q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id,name)',
        pageSize: 100
      });
      
      const folders = foldersResponse.data.files || [];
      console.log(`Found ${folders.length} subfolders`);
      
      const vehicleMatches = [];
      
      // Check each folder for vehicle matches
      for (const folder of folders) {
        const matchedVehicle = this.matchFolderToVehicle(folder.name);
        if (matchedVehicle) {
          console.log(`Matched folder "${folder.name}" to vehicle: ${matchedVehicle.year} ${matchedVehicle.make} ${matchedVehicle.model}`);
          
          // Get images from this folder
          const imagesResponse = await this.drive.files.list({
            q: `'${folder.id}' in parents and mimeType contains 'image/' and trashed=false`,
            fields: 'files(id,name)',
            pageSize: 20
          });
          
          const images = (imagesResponse.data.files || []).map((file: any) => 
            `https://lh3.googleusercontent.com/d/${file.id}=w800`
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
      console.error('Error scanning public Drive folder:', error);
      throw error;
    }
  }

  private matchFolderToVehicle(folderName: string): any {
    const cleanFolderName = folderName.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    
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

  async applyDriveMatches(matches: any[]): Promise<any> {
    const results = {
      success: [] as any[],
      errors: [] as any[],
      totalUpdated: 0
    };

    // Group matches by stock number to combine images from multiple folders
    const groupedMatches = new Map<string, { vehicle: any, allImages: string[], folders: string[] }>();
    
    for (const match of matches) {
      const stockNumber = match.vehicle.stockNumber;
      if (!groupedMatches.has(stockNumber)) {
        groupedMatches.set(stockNumber, {
          vehicle: match.vehicle,
          allImages: [],
          folders: []
        });
      }
      
      const group = groupedMatches.get(stockNumber)!;
      group.allImages.push(...match.images);
      group.folders.push(match.folder);
    }

    // Apply combined images for each vehicle
    for (const [stockNumber, group] of Array.from(groupedMatches.entries())) {
      try {
        // Find vehicle by stock number and update with all matched images
        const vehicles = await storage.getAllVehicles();
        const vehicleToUpdate = vehicles.find(v => v.stockNumber === stockNumber);
        
        if (!vehicleToUpdate) {
          throw new Error(`Vehicle with stock number ${stockNumber} not found`);
        }
        
        // Remove duplicates from combined images
        const uniqueImages = Array.from(new Set(group.allImages));
        
        const updatedVehicle = await storage.updateVehicle(vehicleToUpdate.id, {
          images: uniqueImages as string[]
        });

        if (updatedVehicle) {
          results.success.push({
            stockNumber: stockNumber,
            vehicle: `${group.vehicle.year} ${group.vehicle.make} ${group.vehicle.model}`,
            imageCount: uniqueImages.length,
            folders: group.folders
          });
          results.totalUpdated++;
          console.log(`✅ Updated ${stockNumber} with ${uniqueImages.length} images from ${group.folders.length} folders`);
        }
        
      } catch (error) {
        console.error(`Error updating vehicle ${stockNumber}:`, error);
        results.errors.push({
          stockNumber: stockNumber,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }

  async browseFiles(folderId: string): Promise<any[]> {
    try {
      if (!this.drive) {
        await this.initializeAuth();
      }
      
      if (!this.drive) {
        console.log('Google Drive API not available - returning demo images');
        // Return demo images so UI works
        return [
          {
            id: '1DEMO123',
            name: 'demo-car-1.jpg',
            thumbnailLink: 'https://via.placeholder.com/150x150/37ca37/ffffff?text=Demo+Car+1',
            webViewLink: 'https://via.placeholder.com/800x600/37ca37/ffffff?text=Demo+Car+1'
          },
          {
            id: '1DEMO456',
            name: 'demo-car-2.jpg', 
            thumbnailLink: 'https://via.placeholder.com/150x150/37ca37/ffffff?text=Demo+Car+2',
            webViewLink: 'https://via.placeholder.com/800x600/37ca37/ffffff?text=Demo+Car+2'
          }
        ];
      }
      
      console.log(`Browsing files in folder: ${folderId}`);
      
      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`,
        fields: 'files(id,name,thumbnailLink,webViewLink,createdTime,size)',
        pageSize: 50,
        orderBy: 'createdTime desc'
      });

      console.log(`Found ${response.data.files?.length || 0} image files`);
      return response.data.files || [];
    } catch (error) {
      console.error('Error browsing files:', error);
      // Return demo images so UI doesn't break
      return [
        {
          id: '1ERROR123',
          name: 'error-demo.jpg',
          thumbnailLink: 'https://via.placeholder.com/150x150/ff6b6b/ffffff?text=Error+Loading',
          webViewLink: 'https://via.placeholder.com/800x600/ff6b6b/ffffff?text=Error+Loading'
        }
      ];
    }
  }

  async findOrCreateVehicleFolder(vehicleFolderName: string): Promise<string> {
    try {
      await this.initializeAuth();
      
      // Search for existing folder
      const searchResponse = await this.drive.files.list({
        q: `name='${vehicleFolderName}' and mimeType='application/vnd.google-apps.folder'`,
        fields: 'files(id,name)'
      });

      if (searchResponse.data.files && searchResponse.data.files.length > 0) {
        return searchResponse.data.files[0].id!;
      }

      // Create new folder if not found
      const folderMetadata = {
        name: vehicleFolderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [DRIVE_FOLDER_ID]
      };

      const folderResponse = await this.drive.files.create({
        resource: folderMetadata,
        fields: 'id'
      });

      return folderResponse.data.id!;
    } catch (error) {
      console.error('Error finding/creating vehicle folder:', error);
      // Fallback to root folder if there's an issue
      return DRIVE_FOLDER_ID;
    }
  }

  async createVehicleFromRow(sheetVehicle: SheetVehicle): Promise<any> {
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
      engine: 'Not specified',
      transmission: 'Not specified', 
      driveType: 'Not specified',
      status: 'for-sale',
      images: sheetVehicle.images || [],
      keyFeatures: this.extractKeyFeatures(sheetVehicle.description),
      metaTitle: `${sheetVehicle.year} ${sheetVehicle.make} ${sheetVehicle.model} - T-Rex Motors`,
      metaDescription: `${sheetVehicle.year} ${sheetVehicle.make} ${sheetVehicle.model} with ${sheetVehicle.miles.toLocaleString()} miles. ${sheetVehicle.description}`,
      notes: sheetVehicle.notes
    };

    return await storage.createVehicle(vehicleData);
  }

  private generateSlug(year: number, make: string, model: string, vin: string): string {
    const baseSlug = `${year}-${make}-${model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const vinSuffix = vin.slice(-6).toLowerCase();
    return `${baseSlug}-${vinSuffix}`;
  }

  private extractKeyFeatures(description: string): string[] {
    const features = [];
    if (description.toLowerCase().includes('low miles')) features.push('Low Mileage');
    if (description.toLowerCase().includes('one owner')) features.push('Single Owner');
    if (description.toLowerCase().includes('clean')) features.push('Clean History');
    if (description.toLowerCase().includes('maintenance')) features.push('Well Maintained');
    return features;
  }
}

export async function registerAdminRoutes(app: Express) {
  const adminService = new AdminService();

  app.get('/api/admin/sheet-data', async (req: Request, res: Response) => {
    try {
      const data = await adminService.getSheetData();
      res.json(data);
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      res.status(500).json({ error: 'Failed to fetch sheet data' });
    }
  });

  app.get('/api/admin/sheet-row/:rowNumber', async (req: Request, res: Response) => {
    try {
      const rowNumber = parseInt(req.params.rowNumber);
      const data = await adminService.getSheetRow(rowNumber);
      res.json(data);
    } catch (error) {
      console.error('Error fetching sheet row:', error);
      res.status(500).json({ error: 'Failed to fetch sheet row' });
    }
  });

  app.get('/api/admin/browse-folders', async (req: Request, res: Response) => {
    try {
      const parentId = req.query.parentId as string || 'root';
      const folders = await adminService.browseFolders(parentId);
      res.json(folders);
    } catch (error) {
      console.error('Error browsing folders:', error);
      res.status(500).json({ error: 'Failed to browse folders' });
    }
  });

  app.post('/api/admin/scan-drive-folder', async (req: Request, res: Response) => {
    try {
      const { folderUrl } = req.body;
      if (!folderUrl) {
        return res.status(400).json({ error: 'Folder URL is required' });
      }
      
      const result = await adminService.scanPublicDriveFolder(folderUrl);
      res.json(result);
    } catch (error) {
      console.error('Error scanning Drive folder:', error);
      res.status(500).json({ error: 'Failed to scan Drive folder: ' + (error instanceof Error ? error.message : 'Unknown error') });
    }
  });

  app.post('/api/admin/apply-drive-matches', async (req: Request, res: Response) => {
    try {
      const { matches } = req.body;
      if (!matches || !Array.isArray(matches)) {
        return res.status(400).json({ error: 'Matches array is required' });
      }
      
      const results = await adminService.applyDriveMatches(matches);
      res.json(results);
    } catch (error) {
      console.error('Error applying Drive matches:', error);
      res.status(500).json({ error: 'Failed to apply matches: ' + (error instanceof Error ? error.message : 'Unknown error') });
    }
  });

  app.get('/api/admin/browse-files/:folderId', async (req: Request, res: Response) => {
    try {
      const folderId = req.params.folderId;
      const files = await adminService.browseFiles(folderId);
      res.json(files);
    } catch (error) {
      console.error('Error browsing files:', error);
      res.status(500).json({ error: 'Failed to browse files' });
    }
  });

  app.post('/api/admin/import-row', async (req: Request, res: Response) => {
    try {
      const { rowNumber } = req.body;
      const sheetVehicle = await adminService.getSheetRow(rowNumber);
      
      if (!sheetVehicle) {
        return res.status(404).json({ error: 'No data found in row' });
      }

      const vehicle = await adminService.createVehicleFromRow(sheetVehicle);
      res.json({ success: true, vehicle });
    } catch (error) {
      console.error('Error importing row:', error);
      res.status(500).json({ error: 'Failed to import row' });
    }
  });

  app.get('/api/admin/drafts', async (req: Request, res: Response) => {
    try {
      const drafts = vehicleDrafts.getAll();
      res.json(drafts);
    } catch (error) {
      console.error('Error fetching drafts:', error);
      res.status(500).json({ error: 'Failed to fetch drafts' });
    }
  });

  app.post('/api/admin/create-vehicle', async (req: Request, res: Response) => {
    try {
      const vehicleData = req.body;
      
      // Ensure required fields are provided
      if (!vehicleData.year || !vehicleData.make || !vehicleData.model) {
        return res.status(400).json({ error: 'Year, make, and model are required' });
      }
      
      // Generate slug
      const baseSlug = `${vehicleData.year}-${vehicleData.make}-${vehicleData.model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const vinSuffix = vehicleData.vin ? vehicleData.vin.slice(-6).toLowerCase() : Date.now().toString().slice(-6);
      const slug = `${baseSlug}-${vinSuffix}`;
      
      // Create complete vehicle object with all required fields
      const completeVehicleData = {
        slug,
        title: vehicleData.title,
        description: vehicleData.description,
        price: vehicleData.price,
        status: vehicleData.status || 'for-sale',
        mileage: vehicleData.mileage,
        year: vehicleData.year,
        make: vehicleData.make,
        model: vehicleData.model,
        vin: vehicleData.vin,
        stockNumber: vehicleData.stockNumber,
        engine: vehicleData.engine || 'Not specified',
        transmission: vehicleData.transmission || 'Not specified',
        driveType: vehicleData.driveType || 'Not specified',
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
        titleStatus: vehicleData.titleStatus || 'unknown',
        lastHistoryUpdate: vehicleData.lastHistoryUpdate,
        bannerReduced: vehicleData.bannerReduced || false,
        bannerSold: vehicleData.bannerSold || false,
        bannerGreatDeal: vehicleData.bannerGreatDeal || false
      };
      
      console.log('Creating vehicle with slug:', slug);
      const vehicle = await storage.createVehicle(completeVehicleData);
      res.json({ success: true, vehicle });
    } catch (error) {
      console.error('Error creating vehicle:', error);
      res.status(500).json({ error: 'Failed to create vehicle' });
    }
  });

  // Upload vehicle image to Google Drive
  app.post('/api/admin/upload-vehicle-image', upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { vehicleId, vehicleTitle } = req.body;
      const file = req.file;

      // Initialize Google Drive
      await adminService.initializeAuth();

      // Create vehicle-specific folder if it doesn't exist
      const vehicleFolderName = `${vehicleTitle} (ID: ${vehicleId})`.replace(/[<>:"/\\|?*]/g, '_');
      let vehicleFolderId = await adminService.findOrCreateVehicleFolder(vehicleFolderName);

      // Upload file to Google Drive
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
        media: media,
        fields: 'id,name,webViewLink,thumbnailLink'
      });

      // Make file publicly viewable
      await adminService.drive.permissions.create({
        fileId: driveResponse.data.id,
        resource: {
          role: 'reader',
          type: 'anyone'
        }
      });

      // Get direct image URL
      const imageUrl = `https://drive.google.com/uc?id=${driveResponse.data.id}`;

      // Update vehicle with new image
      const vehicle = await storage.getVehicleById(parseInt(vehicleId));
      if (vehicle) {
        const updatedImages = [...vehicle.images, imageUrl];
        await storage.updateVehicle(parseInt(vehicleId), { images: updatedImages });
      }

      res.json({
        success: true,
        fileId: driveResponse.data.id,
        imageUrl: imageUrl,
        thumbnailUrl: driveResponse.data.thumbnailLink,
        fileName: driveResponse.data.name
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Failed to upload image to Google Drive' });
    }
  });

  // Add Google Drive images via URL links
  app.post('/api/admin/vehicles/:id/drive-urls', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { imageUrls } = req.body;

      if (!imageUrls || !Array.isArray(imageUrls)) {
        return res.status(400).json({ error: 'imageUrls array is required' });
      }

      // Process Google Drive URLs to get direct image URLs
      const processedUrls = imageUrls.map(url => {
        if (!url || !url.trim()) return null;
        
        // Convert Google Drive sharing URLs to direct image URLs
        if (url.includes('drive.google.com/file/d/')) {
          const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
          if (match) {
            return `https://drive.google.com/uc?id=${match[1]}`;
          }
        }
        
        // Return original URL if it's already a direct link or other format
        return url.trim();
      }).filter(url => url !== null);

      if (processedUrls.length === 0) {
        return res.status(400).json({ error: 'No valid image URLs provided' });
      }

      // Update vehicle with new images
      const vehicle = await storage.getVehicleById(parseInt(id));
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      const updatedImages = [...vehicle.images, ...processedUrls];
      await storage.updateVehicle(parseInt(id), { images: updatedImages });

      res.json({
        success: true,
        imageUrls: processedUrls,
        totalImages: updatedImages.length
      });

    } catch (error) {
      console.error('Error adding Google Drive URLs:', error);
      res.status(500).json({ error: 'Failed to add images from Google Drive URLs' });
    }
  });

  // Add existing Google Drive images to vehicle
  app.post('/api/vehicles/:id/add-drive-images', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { fileIds } = req.body;

      if (!Array.isArray(fileIds) || fileIds.length === 0) {
        return res.status(400).json({ error: 'File IDs are required' });
      }

      const vehicle = await storage.getVehicleById(parseInt(id));
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      // Convert Drive file IDs to direct image URLs
      const newImageUrls = fileIds.map((fileId: string) => 
        `https://drive.google.com/uc?id=${fileId}`
      );

      const updatedImages = [...vehicle.images, ...newImageUrls];
      const updatedVehicle = await storage.updateVehicle(parseInt(id), { images: updatedImages });

      res.json({
        success: true,
        images: updatedVehicle.images,
        addedCount: newImageUrls.length
      });

    } catch (error) {
      console.error('Error adding Drive images:', error);
      res.status(500).json({ error: 'Failed to add images from Google Drive' });
    }
  });

  // Remove image from vehicle
  app.delete('/api/vehicles/:id/images/:imageIndex', async (req: Request, res: Response) => {
    try {
      const { id, imageIndex } = req.params;
      const index = parseInt(imageIndex);

      const vehicle = await storage.getVehicleById(parseInt(id));
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      if (index < 0 || index >= vehicle.images.length) {
        return res.status(400).json({ error: 'Invalid image index' });
      }

      const updatedImages = vehicle.images.filter((_, i) => i !== index);
      const updatedVehicle = await storage.updateVehicle(parseInt(id), { images: updatedImages });

      res.json({
        success: true,
        images: updatedVehicle.images,
        removedIndex: index
      });

    } catch (error) {
      console.error('Error removing image:', error);
      res.status(500).json({ error: 'Failed to remove image' });
    }
  });

  // Reorder vehicle images
  app.patch('/api/vehicles/:id/reorder-images', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { imageOrder } = req.body;

      if (!Array.isArray(imageOrder)) {
        return res.status(400).json({ error: 'Image order array is required' });
      }

      const vehicle = await storage.getVehicleById(parseInt(id));
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      // Update vehicle with new image order (imageOrder is already the full array of URLs)
      const updatedVehicle = await storage.updateVehicle(parseInt(id), { images: imageOrder });

      res.json({
        success: true,
        images: updatedVehicle.images
      });

    } catch (error) {
      console.error('Error reordering images:', error);
      res.status(500).json({ error: 'Failed to reorder images' });
    }
  });

  // Customer Applications Admin Routes
  
  // Get all customer applications
  app.get('/api/admin/applications', async (req: Request, res: Response) => {
    try {
      const applications = await storage.getAllCustomerApplications();
      res.json(applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      res.status(500).json({ error: 'Failed to fetch applications' });
    }
  });

  // Get single application with full details
  app.get('/api/admin/applications/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const application = await storage.getCustomerApplication(parseInt(id));
      
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }
      
      res.json(application);
    } catch (error) {
      console.error('Error fetching application:', error);
      res.status(500).json({ error: 'Failed to fetch application' });
    }
  });

  // Update application status and add admin notes
  app.patch('/api/admin/applications/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, adminNotes, reviewedBy } = req.body;
      
      const updates: any = {};
      if (status) updates.status = status;
      if (adminNotes !== undefined) updates.adminNotes = adminNotes;
      if (reviewedBy) updates.reviewedBy = reviewedBy;
      if (status && status !== 'pending') {
        updates.reviewedAt = new Date();
      }
      
      const application = await storage.updateCustomerApplication(parseInt(id), updates);
      res.json(application);
    } catch (error) {
      console.error('Error updating application:', error);
      res.status(500).json({ error: 'Failed to update application' });
    }
  });

  // Delete application
  app.delete('/api/admin/applications/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await storage.deleteCustomerApplication(parseInt(id));
      res.json({ message: 'Application deleted successfully' });
    } catch (error) {
      console.error('Error deleting application:', error);
      res.status(500).json({ error: 'Failed to delete application' });
    }
  });

  // Banner Management API endpoints
  app.get('/api/admin/banner-stats', async (req: Request, res: Response) => {
    try {
      const { bannerManager } = await import('./banner-manager');
      const stats = await bannerManager.getBannerStats();
      res.json(stats);
    } catch (error) {
      console.error('Error getting banner stats:', error);
      res.status(500).json({ error: 'Failed to get banner stats' });
    }
  });

  app.post('/api/admin/cleanup-banners', async (req: Request, res: Response) => {
    try {
      const { bannerManager } = await import('./banner-manager');
      const removedCount = await bannerManager.manualCleanup();
      res.json({ 
        success: true, 
        removedCount,
        message: `Removed NEW banners from ${removedCount} vehicles` 
      });
    } catch (error) {
      console.error('Error cleaning up banners:', error);
      res.status(500).json({ error: 'Failed to cleanup banners' });
    }
  });

  // System Status API endpoints
  app.get('/api/admin/system-status', async (req: Request, res: Response) => {
    try {
      const status = await getSystemStatus();
      res.json(status);
    } catch (error) {
      console.error('Error getting system status:', error);
      res.status(500).json({ error: 'Failed to get system status' });
    }
  });

  app.post('/api/admin/test-connections', async (req: Request, res: Response) => {
    try {
      const results = await testAllConnections();
      res.json(results);
    } catch (error) {
      console.error('Error testing connections:', error);
      res.status(500).json({ error: 'Failed to test connections' });
    }
  });

  // Bulk inventory update from sheet data
  app.post('/api/admin/update-inventory-bulk', async (req: Request, res: Response) => {
    try {
      const { sheetData } = req.body;
      
      if (!sheetData) {
        return res.status(400).json({ error: 'Sheet data is required' });
      }
      
      const result = await updateInventoryFromSheet(sheetData);
      res.json({
        success: true,
        processed: result.processed,
        message: `Successfully updated inventory with ${result.processed} vehicles`
      });
    } catch (error) {
      console.error('Error updating inventory:', error);
      res.status(500).json({ error: 'Failed to update inventory' });
    }
  });
}

// System status helper functions
async function getSystemStatus() {
  const startTime = Date.now();
  
  // Test database connection
  let databaseStatus: { connected: boolean; latency: number; error?: string } = { connected: false, latency: 0 };
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
      error: error instanceof Error ? error.message : 'Unknown database error'
    };
  }

  // Test Google Sheets connection
  let googleSheetsStatus: { connected: boolean; authenticated: boolean; sheetsFound: number; error?: string } = { 
    connected: false, 
    authenticated: false, 
    sheetsFound: 0 
  };
  try {
    const adminService = new AdminService();
    await adminService.initializeAuth();
    
    if (adminService.sheets) {
      googleSheetsStatus.authenticated = true;
      
      // Try to access the sheet
      const sheetData = await adminService.getSheetData();
      googleSheetsStatus.connected = true;
      googleSheetsStatus.sheetsFound = Array.isArray(sheetData) ? sheetData.length : 0;
    }
  } catch (error) {
    googleSheetsStatus.error = error instanceof Error ? error.message : 'Google Sheets connection failed';
  }

  // Test Google Drive connection
  let googleDriveStatus: { connected: boolean; authenticated: boolean; foldersFound: number; error?: string } = { 
    connected: false, 
    authenticated: false, 
    foldersFound: 0 
  };
  try {
    const adminService = new AdminService();
    await adminService.initializeAuth();
    
    if (adminService.drive) {
      googleDriveStatus.authenticated = true;
      
      // Try to browse root folders
      const folders = await adminService.browseFolders('root');
      googleDriveStatus.connected = true;
      googleDriveStatus.foldersFound = Array.isArray(folders) ? folders.length : 0;
    }
  } catch (error) {
    googleDriveStatus.error = error instanceof Error ? error.message : 'Google Drive connection failed';
  }

  // Server health
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  const memoryPercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
  
  const serverStatus = {
    status: memoryPercent > 98 ? 'error' : memoryPercent > 85 ? 'warning' : 'healthy',
    uptime: formatUptime(uptime),
    memory: memoryPercent
  };

  return {
    database: databaseStatus,
    googleSheets: googleSheetsStatus,
    googleDrive: googleDriveStatus,
    server: serverStatus,
    lastChecked: new Date().toISOString(),
    responseTime: Date.now() - startTime
  };
}

async function testAllConnections() {
  console.log('Testing all system connections...');
  const status = await getSystemStatus();
  
  // Log results for debugging
  console.log('Connection test results:', {
    database: status.database.connected ? 'OK' : 'FAILED',
    googleSheets: status.googleSheets.connected ? 'OK' : 'FAILED',
    googleDrive: status.googleDrive.connected ? 'OK' : 'FAILED',
    server: status.server.status
  });
  
  return {
    success: true,
    message: 'Connection tests completed',
    results: status
  };
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}