import { google } from 'googleapis';
import cron from 'node-cron';
import { db } from './db';
import { vehicles } from '@shared/schema';
import { eq } from 'drizzle-orm';
import sharp from 'sharp';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

// Google Sheets and Drive configuration
const SPREADSHEET_ID = '1NNCJE7KV_rZ6VBkc1-mcPUrQGDdsXMUTHAprK3UvKNA';
const DRIVE_FOLDER_ID = '1-AhZ6wwgNK9qQifm9j5eCoCkA316j7sk';

interface VehicleRow {
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
  featuredImage: string;
  image2: string;
  image3: string;
  image4: string;
  image5: string;
  image6: string;
  image7: string;
  code: string;
}

class GoogleSyncService {
  private auth: any;
  private sheets: any;
  private drive: any;

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      // Check if GOOGLE_SERVICE_ACCOUNT_KEY is set with JSON content
      if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
        console.log('Google service account key not provided - sync service disabled');
        return;
      }

      // Parse JSON credentials from environment variable
      let credentials;
      try {
        credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
      } catch (parseError) {
        console.error('Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY as JSON:', parseError);
        throw new Error('Invalid Google service account key format');
      }

      // Use credentials directly (no file needed)
      this.auth = new google.auth.GoogleAuth({
        credentials: credentials,
        scopes: [
          'https://www.googleapis.com/auth/spreadsheets.readonly',
          'https://www.googleapis.com/auth/drive.readonly'
        ]
      });

      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      this.drive = google.drive({ version: 'v3', auth: this.auth });
      
      console.log('Google API authentication initialized');
    } catch (error) {
      console.error('Failed to initialize Google API auth:', error);
    }
  }

  async syncVehicles() {
    try {
      console.log('Starting vehicle sync at', new Date().toISOString());
      
      // Get data from Google Sheets
      const sheetData = await this.getSheetData();
      if (!sheetData) return;

      // Process each vehicle row
      for (const row of sheetData) {
        await this.processVehicleRow(row);
      }

      console.log('Vehicle sync completed successfully');
    } catch (error) {
      console.error('Vehicle sync failed:', error);
    }
  }

  private async getSheetData(): Promise<VehicleRow[] | null> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Sheet1!A:U', // Adjust range based on your sheet structure
      });

      const rows = response.data.values;
      if (!rows || rows.length < 2) {
        console.log('No data found in spreadsheet');
        return null;
      }

      // Skip header row and map data
      const vehicles = rows.slice(1).map((row: any[]) => ({
        status: row[0] || '',
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
        featuredImage: row[13] || '',
        image2: row[14] || '',
        image3: row[15] || '',
        image4: row[16] || '',
        image5: row[17] || '',
        image6: row[18] || '',
        image7: row[19] || '',
        code: row[20] || ''
      }));

      return vehicles.filter((v: any) => v.vin && v.make && v.model);
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      return null;
    }
  }

  private async processVehicleRow(row: VehicleRow) {
    try {
      // Check if vehicle exists in database
      const existingVehicle = await db
        .select()
        .from(vehicles)
        .where(eq(vehicles.vin, row.vin))
        .limit(1);

      const slug = this.generateSlug(row.year, row.make, row.model, row.vin);
      
      // Download and process images
      const processedImages = await this.processVehicleImages(row);

      const vehicleData = {
        slug,
        title: `${row.year} ${row.make} ${row.model}`,
        description: row.description || '',
        price: row.price,
        year: row.year.toString(),
        make: row.make,
        model: row.model,
        vin: row.vin,
        stockNumber: row.stockNumber,
        mileage: row.miles.toString(),
        exteriorColor: row.exteriorColor || '',
        interiorColor: row.interiorColor || '',
        status: row.status.toLowerCase() || 'for-sale',
        images: processedImages,
        carfaxEmbedCode: row.code || null,
        metaTitle: `${row.year} ${row.make} ${row.model} - T-Rex Motors`,
        metaDescription: `${row.year} ${row.make} ${row.model} with ${row.miles.toLocaleString()} miles. ${row.description || ''}`,
        keyFeatures: this.extractKeyFeatures(row.description || ''),
        engine: 'V6',
        transmission: 'Automatic',
        driveType: 'FWD',
        notes: row.notes || null,
        lastSyncedAt: new Date().toISOString()
      };

      if (existingVehicle.length > 0) {
        // Update existing vehicle
        await db
          .update(vehicles)
          .set(vehicleData)
          .where(eq(vehicles.id, existingVehicle[0].id));
        console.log(`Updated vehicle: ${vehicleData.title}`);
      } else {
        // Insert new vehicle
        await db.insert(vehicles).values(vehicleData);
        console.log(`Added new vehicle: ${vehicleData.title}`);
      }
    } catch (error) {
      console.error(`Error processing vehicle ${row.vin}:`, error);
    }
  }

  private async processVehicleImages(row: VehicleRow): Promise<string[]> {
    const imageUrls: string[] = [];
    const imageFields = [
      row.featuredImage,
      row.image2,
      row.image3,
      row.image4,
      row.image5,
      row.image6,
      row.image7
    ].filter(Boolean);

    // Look for vehicle folder in Google Drive
    const vehicleFolderName = `${row.year} ${row.make} ${row.model}`;
    
    try {
      // Search for the vehicle folder
      const folderResponse = await this.drive.files.list({
        q: `'${DRIVE_FOLDER_ID}' in parents and name contains '${vehicleFolderName}' and mimeType='application/vnd.google-apps.folder'`,
        fields: 'files(id, name)'
      });

      if (folderResponse.data.files && folderResponse.data.files.length > 0) {
        const folderId = folderResponse.data.files[0].id;
        
        // Get images from the folder
        const imagesResponse = await this.drive.files.list({
          q: `'${folderId}' in parents and (mimeType contains 'image/' or name contains '.heic')`,
          fields: 'files(id, name, mimeType)'
        });

        if (imagesResponse.data.files) {
          for (const file of imagesResponse.data.files.slice(0, 7)) {
            try {
              const imageUrl = await this.downloadAndProcessImage(file.id!, file.name!);
              if (imageUrl) {
                imageUrls.push(imageUrl);
              }
            } catch (error) {
              console.error(`Error processing image ${file.name}:`, error);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching images from Drive:', error);
    }

    return imageUrls;
  }

  private async downloadAndProcessImage(fileId: string, fileName: string): Promise<string | null> {
    try {
      // Download image from Google Drive
      const response = await this.drive.files.get({
        fileId,
        alt: 'media'
      }, { responseType: 'arraybuffer' });

      const buffer = Buffer.from(response.data);
      
      // Convert HEIC to JPEG if needed
      let processedBuffer = buffer;
      if (fileName.toLowerCase().includes('.heic')) {
        // Note: sharp doesn't natively support HEIC, you might need a different library
        // For now, we'll assume conversion is handled elsewhere or use a service
        processedBuffer = await sharp(buffer)
          .jpeg({ quality: 85 })
          .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
          .toBuffer();
      } else {
        // Process other image formats
        processedBuffer = await sharp(buffer)
          .jpeg({ quality: 85 })
          .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
          .toBuffer();
      }

      // Save to public directory
      const filename = `vehicle-${fileId}-${Date.now()}.jpg`;
      const filepath = path.join(process.cwd(), 'public', 'vehicles', filename);
      
      // Ensure directory exists
      await fs.mkdir(path.dirname(filepath), { recursive: true });
      await fs.writeFile(filepath, processedBuffer);

      return `/vehicles/${filename}`;
    } catch (error) {
      console.error('Error downloading/processing image:', error);
      return null;
    }
  }

  private generateSlug(year: number, make: string, model: string, vin: string): string {
    const baseSlug = `${year}-${make}-${model}`.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Add last 6 digits of VIN for uniqueness
    const vinSuffix = vin.slice(-6).toLowerCase();
    return `${baseSlug}-${vinSuffix}`;
  }

  private extractKeyFeatures(description: string): string[] {
    // Extract key features from description
    const features: string[] = [];
    const commonFeatures = [
      'leather seats', 'sunroof', 'navigation', 'bluetooth', 'backup camera',
      'heated seats', 'cruise control', 'power windows', 'air conditioning',
      'alloy wheels', 'premium sound', 'keyless entry'
    ];

    const lowerDesc = description.toLowerCase();
    commonFeatures.forEach(feature => {
      if (lowerDesc.includes(feature)) {
        features.push(feature.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '));
      }
    });

    return features.slice(0, 5); // Limit to 5 features
  }

  startScheduledSync() {
    // Schedule to run every day at 6:00 AM
    cron.schedule('0 6 * * *', async () => {
      console.log('Starting scheduled vehicle sync...');
      await this.syncVehicles();
    }, {
      timezone: 'America/New_York' // Adjust timezone as needed
    });

    console.log('Vehicle sync scheduled for 6:00 AM daily');
  }

  // Manual sync method for testing
  async manualSync() {
    await this.syncVehicles();
  }
}

export const googleSyncService = new GoogleSyncService();