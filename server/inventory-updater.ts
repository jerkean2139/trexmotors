import { db } from "./db";
import { vehicles } from "@shared/schema";
import { eq } from "drizzle-orm";

interface VehicleData {
  status: string;
  stockNumber: string;
  vin: string;
  year: string;
  make: string;
  model: string;
  miles: string;
  price: string;
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
}

// Function to convert Google Drive links to working URLs
function convertGoogleDriveUrl(url: string): string {
  if (!url || url.trim() === '') return '';
  
  // Handle standard Google Drive share links
  if (url.includes('drive.google.com/file/d/')) {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      return `https://lh3.googleusercontent.com/d/${match[1]}=w800`;
    }
  }
  
  // Handle uc export view links
  if (url.includes('drive.google.com/uc?export=view&id=')) {
    const match = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (match) {
      return `https://lh3.googleusercontent.com/d/${match[1]}=w800`;
    }
  }
  
  // Handle direct uc links
  if (url.includes('drive.google.com/uc?id=')) {
    const match = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (match) {
      return `https://lh3.googleusercontent.com/d/${match[1]}=w800`;
    }
  }
  
  // Return as is for other formats (storage.googleapis.com, etc.)
  return url;
}

// Function to create slug from title
function createSlug(year: string, make: string, model: string, stockNumber: string): string {
  const title = `${year} ${make} ${model}`;
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  return `${slug}-${stockNumber}`;
}

// Parse the inventory data from the sheet format
export async function updateInventoryFromSheet(sheetData: string) {
  console.log('Starting inventory update from sheet data...');
  
  const lines = sheetData.split('\n');
  const headers = lines[0].split('\t');
  const dataLines = lines.slice(1).filter(line => line.trim() && !line.startsWith('---'));
  
  console.log(`Processing ${dataLines.length} vehicle records...`);
  
  // Clear existing inventory first
  await db.delete(vehicles);
  console.log('Cleared existing inventory');
  
  const processedVehicles = [];
  
  for (const line of dataLines) {
    const columns = line.split('\t');
    
    // Skip empty or invalid rows
    if (columns.length < 11 || !columns[1] || !columns[3] || !columns[4] || !columns[5]) {
      continue;
    }
    
    const vehicleData: VehicleData = {
      status: columns[0] || '',
      stockNumber: columns[1] || '',
      vin: columns[2] || '',
      year: columns[3] || '',
      make: columns[4] || '',
      model: columns[5] || '',
      miles: columns[6] || '',
      price: columns[7] || '',
      exteriorColor: columns[8] || '',
      interiorColor: columns[9] || '',
      description: columns[10] || '',
      notes: columns[11] || '',
      featuredImage: columns[13] || '',
      image2: columns[14] || '',
      image3: columns[15] || '',
      image4: columns[16] || '',
      image5: columns[17] || '',
      image6: columns[18] || '',
      image7: columns[19] || '',
    };
    
    // Skip vehicles marked as "Sold", "Needs Removed", or without essential data
    if (vehicleData.status.toLowerCase() === 'sold' || 
        vehicleData.status.toLowerCase() === 'needs removed' ||
        !vehicleData.year || !vehicleData.make || !vehicleData.model) {
      continue;
    }
    
    // Parse price
    const priceStr = vehicleData.price.replace(/[$,]/g, '');
    const price = parseInt(priceStr) || 0;
    
    // Skip vehicles without valid price
    if (!price || price <= 0) {
      continue;
    }
    
    // Collect images
    const imageUrls = [
      vehicleData.featuredImage,
      vehicleData.image2,
      vehicleData.image3,
      vehicleData.image4,
      vehicleData.image5,
      vehicleData.image6,
      vehicleData.image7
    ].filter(url => url && url.trim() !== '').map(convertGoogleDriveUrl);
    
    // Create vehicle title and slug
    const title = `${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`;
    const slug = createSlug(vehicleData.year, vehicleData.make, vehicleData.model, vehicleData.stockNumber);
    
    // Parse mileage
    const mileage = vehicleData.miles.replace(/[^0-9]/g, '');
    const mileageFormatted = mileage ? `${parseInt(mileage).toLocaleString()} miles` : 'Contact for mileage';
    
    const newVehicle = {
      slug,
      title,
      description: vehicleData.description || `${title} in excellent condition. ${vehicleData.notes}`.trim(),
      price,
      status: vehicleData.status.toLowerCase() === 'for sale' ? 'for-sale' : 'pending',
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