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
      // Check if GOOGLE_SERVICE_ACCOUNT_KEY is set with JSON content
      if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
        console.log('Google service account key not provided - admin will use manual vehicle creation only');
        return;
      }

      // Parse JSON credentials from environment variable
      let credentials;
      try {
        credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
      } catch (parseError) {
        console.error('Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY as JSON:', parseError);
        console.log('Google API will be disabled - admin will use manual vehicle creation only');
        this.auth = null;
        this.sheets = null;
        this.drive = null;
        return;
      }

      // Use credentials directly (no file needed)
      this.auth = new google.auth.GoogleAuth({
        credentials: credentials,
        scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive'
        ]
      });

      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      this.drive = google.drive({ version: 'v3', auth: this.auth });
      
      // Test authentication
      await this.sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID,
        fields: 'properties.title'
      });
      
      console.log('Google API authenticated successfully');
      
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
            images: [row[12], row[13], row[14], row[15], row[16], row[17], row[18]].filter(Boolean),
            code: row[19] || ''
          };
          vehicles.push(vehicle);
        }

        return vehicles;
      } else {
        console.log('Google Sheets integration pending - use manual vehicle creation');
        return [];
      }
    } catch (error) {
      console.error('Error fetching sheet data:', error instanceof Error ? error.message : error);
      return [];
    }
  }
}

const adminService = new AdminService();

export function registerAdminRoutes(app: Express) {
  // Get sheet data
  app.get('/api/admin/sheet-data', async (req: Request, res: Response) => {
    try {
      const data = await adminService.getSheetData();
      res.json(data);
    } catch (error) {
      console.error('Error in /api/admin/sheet-data:', error);
      res.status(500).json({ error: 'Failed to fetch sheet data' });
    }
  });

  // Browse folders
  app.get('/api/admin/browse-folders', async (req: Request, res: Response) => {
    try {
      res.json([]);
    } catch (error) {
      console.error('Error in /api/admin/browse-folders:', error);
      res.status(500).json({ error: 'Failed to browse folders' });
    }
  });

  // Vehicle applications (drafts)
  app.get('/api/admin/applications', (req: Request, res: Response) => {
    res.json(vehicleDrafts.getAll());
  });

  app.post('/api/admin/applications/:id/approve', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const draft = vehicleDrafts.approve(id);
    if (draft) {
      res.json({ success: true, draft });
    } else {
      res.status(404).json({ error: 'Draft not found' });
    }
  });

  // Manual vehicle creation
  app.post('/api/admin/vehicles', async (req: Request, res: Response) => {
    try {
      const vehicleData = req.body;
      const newVehicle = await storage.createVehicle(vehicleData);
      res.json(newVehicle);
    } catch (error) {
      console.error('Error creating vehicle:', error);
      res.status(500).json({ error: 'Failed to create vehicle' });
    }
  });
}