import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the sheet data file
const sheetData = fs.readFileSync(path.join(__dirname, 'attached_assets/sheet_data.txt'), 'utf8');

// Convert Google Drive links to working URLs
function convertGoogleDriveUrl(url) {
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

// Parse the sheet data
const lines = sheetData.split('\n');
const dataLines = lines.slice(1).filter(line => line.trim() && !line.startsWith('---'));

const imageUpdates = [];

for (const line of dataLines) {
  const columns = line.split('\t');
  
  // Skip empty or invalid rows
  if (columns.length < 11 || !columns[1] || !columns[3] || !columns[4] || !columns[5]) {
    continue;
  }
  
  const vehicleData = {
    stockNumber: columns[1] || '',
    year: columns[3] || '',
    make: columns[4] || '',
    model: columns[5] || '',
    status: columns[0] || '',
    price: columns[7] || '',
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
  
  // Create slug
  const title = `${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`;
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() + `-${vehicleData.stockNumber}`;
  
  // Collect and convert images
  const imageUrls = [
    vehicleData.featuredImage,
    vehicleData.image2,
    vehicleData.image3,
    vehicleData.image4,
    vehicleData.image5,
    vehicleData.image6,
    vehicleData.image7
  ].filter(url => url && url.trim() !== '').map(convertGoogleDriveUrl);
  
  if (imageUrls.length > 0) {
    // Format as PostgreSQL array
    const formattedImages = '{' + imageUrls.map(url => `"${url}"`).join(',') + '}';
    
    imageUpdates.push({
      slug: slug,
      images: formattedImages,
      count: imageUrls.length,
      title: title
    });
    
    console.log(`${title} (${vehicleData.stockNumber}): ${imageUrls.length} images`);
  }
}

// Generate SQL update statements
console.log('\n--- SQL UPDATE STATEMENTS ---\n');

for (const update of imageUpdates) {
  const sql = `UPDATE vehicles SET images = '${update.images}' WHERE slug = '${update.slug}';`;
  console.log(sql);
}

console.log(`\nTotal vehicles with images: ${imageUpdates.length}`);