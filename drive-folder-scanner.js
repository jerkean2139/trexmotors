// Google Drive Folder Scanner for T-Rex Motors
// Extracts vehicle folders from a Google Drive folder URL

import { google } from 'googleapis';

const SPREADSHEET_ID = '1VNbqt8PO8AjmV2Tc-EjU2pxUcJq94vKu1b8C4Q3IJ3I';

// Vehicles needing images with their exact details from the spreadsheet
const vehiclesNeedingImages = [
  { stockNumber: "1008", year: "2013", make: "Ford", model: "Flex SEL", color: "white", row: 4 },
  { stockNumber: "1021", year: "2020", make: "Dodge", model: "Charger", color: "White", row: 5 },
  { stockNumber: "1024", year: "2014", make: "Jeep", model: "Grand Cherokee", color: "Red", row: 6 },
  { stockNumber: "1027", year: "2018", make: "Honda", model: "Civic", color: "White", row: 7 },
  { stockNumber: "1041", year: "2015", make: "Toyota", model: "Corolla", color: "Silver", row: 8 },
  { stockNumber: "1042", year: "2018", make: "Chevrolet", model: "Silverado LT", color: "White", row: 9 },
  { stockNumber: "1044", year: "2016", make: "Ford", model: "Focus", color: "Silver", row: 10 },
  { stockNumber: "1049", year: "2020", make: "Chevrolet", model: "Malibu", color: "Maroon", row: 11 },
  { stockNumber: "1050", year: "2019", make: "Dodge", model: "Journey", color: "Black", row: 12 },
  { stockNumber: "1057", year: "2014", make: "JEEP", model: "WRANGLER SAHARA UNLIMITED", color: "GRAY", row: 13 },
  { stockNumber: "1060", year: "2019", make: "HYANDAI", model: "SANTA FE", color: "SILVER", row: 14 },
  { stockNumber: "1061", year: "2020", make: "KIA", model: "FORTE", color: "WHITE", row: 15 },
  { stockNumber: "1064", year: "2011", make: "CHEVROLET", model: "IMPALA", color: "RED", row: 16 },
  { stockNumber: "1068", year: "2016", make: "BUICK", model: "ENCORE", color: "RED", row: 17 },
  { stockNumber: "1070", year: "2018", make: "SUBARU", model: "CROSSTREK", color: "GREY", row: 18 }
];

// Function to match folder names to vehicles
function matchFolderToVehicle(folderName) {
  const cleanFolderName = folderName.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  
  for (const vehicle of vehiclesNeedingImages) {
    const searchTerms = [
      // Stock number matches
      vehicle.stockNumber.toLowerCase(),
      `stock ${vehicle.stockNumber.toLowerCase()}`,
      `t${vehicle.stockNumber.replace('T', '').toLowerCase()}`,
      
      // Make model year color combinations
      `${vehicle.year} ${vehicle.make.toLowerCase()} ${vehicle.model.toLowerCase()} ${vehicle.color.toLowerCase()}`,
      `${vehicle.make.toLowerCase()} ${vehicle.model.toLowerCase()} ${vehicle.year} ${vehicle.color.toLowerCase()}`,
      `${vehicle.year} ${vehicle.make.toLowerCase()} ${vehicle.model.toLowerCase()}`,
      `${vehicle.make.toLowerCase()} ${vehicle.model.toLowerCase()} ${vehicle.year}`,
      
      // Color only matches (less specific)
      vehicle.color.toLowerCase(),
      
      // Partial matches
      `${vehicle.make.toLowerCase()} ${vehicle.model.toLowerCase()}`,
      `${vehicle.year} ${vehicle.make.toLowerCase()}`,
      vehicle.make.toLowerCase()
    ];
    
    for (const term of searchTerms) {
      if (cleanFolderName.includes(term) || term.includes(cleanFolderName)) {
        return vehicle;
      }
    }
  }
  
  return null;
}

// Function to extract folder ID from Google Drive URL
function extractFolderIdFromUrl(url) {
  const match = url.match(/\/folders\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

// Function to convert Google Drive file URLs to direct image URLs
function convertToDirectImageUrl(fileId) {
  return `https://lh3.googleusercontent.com/d/${fileId}=w800`;
}

console.log("=== T-REX MOTORS DRIVE FOLDER SCANNER ===\n");
console.log("Ready to scan your Google Drive folder!");
console.log("\nNext steps:");
console.log("1. Make your Google Drive folder publicly viewable (Anyone with the link can view)");
console.log("2. Provide the folder URL");
console.log("3. I'll scan all subfolders and match them to vehicles");
console.log("4. Extract image URLs and update your Google Sheet automatically");

export { matchFolderToVehicle, extractFolderIdFromUrl, convertToDirectImageUrl, vehiclesNeedingImages };