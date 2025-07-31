// Vehicle Image Matching Tool
// This will help match folders named "make model year color" to vehicles in our inventory

import fs from 'fs';

// Current vehicles that need images (15 vehicles missing images)
const vehiclesNeedingImages = [
  { make: "Ford", model: "Flex SEL", year: "2013", color: "white", stockNumber: "1008" },
  { make: "Dodge", model: "Charger", year: "2020", color: "White", stockNumber: "1021" },
  { make: "Jeep", model: "Grand Cherokee", year: "2014", color: "Red", stockNumber: "1024" },
  { make: "Honda", model: "Civic", year: "2018", color: "White", stockNumber: "1027" },
  { make: "Toyota", model: "Corolla", year: "2015", color: "Silver", stockNumber: "1041" },
  { make: "Chevrolet", model: "Silverado LT", year: "2018", color: "White", stockNumber: "1042" },
  { make: "Ford", model: "Focus", year: "2016", color: "Silver", stockNumber: "1044" },
  { make: "Chevrolet", model: "Malibu", year: "2020", color: "Maroon", stockNumber: "1049" },
  { make: "Dodge", model: "Journey", year: "2019", color: "Black", stockNumber: "1050" },
  { make: "JEEP", model: "WRANGLER SAHARA UNLIMITED", year: "2014", color: "GRAY", stockNumber: "1057" },
  { make: "HYANDAI", model: "SANTA FE", year: "2019", color: "SILVER", stockNumber: "1060" },
  { make: "KIA", model: "FORTE", year: "2020", color: "WHITE", stockNumber: "1061" },
  { make: "CHEVROLET", model: "IMPALA", year: "2011", color: "RED", stockNumber: "1064" },
  { make: "BUICK", model: "ENCORE", year: "2016", color: "RED", stockNumber: "1068" },
  { make: "SUBARU", model: "CROSSTREK", year: "2018", color: "GREY", stockNumber: "1070" }
];

console.log("=== T-REX MOTORS VEHICLE IMAGE MATCHING ===\n");
console.log("Vehicles that need images matched:\n");

vehiclesNeedingImages.forEach((vehicle, index) => {
  const possibleFolderNames = [
    `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.color}`,
    `${vehicle.make} ${vehicle.model} ${vehicle.year} ${vehicle.color}`,
    `${vehicle.year} ${vehicle.make.toLowerCase()} ${vehicle.model.toLowerCase()} ${vehicle.color.toLowerCase()}`,
    `${vehicle.make.toLowerCase()} ${vehicle.model.toLowerCase()} ${vehicle.year} ${vehicle.color.toLowerCase()}`,
    `${vehicle.stockNumber} ${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    `${vehicle.year}-${vehicle.make}-${vehicle.model}-${vehicle.color}`,
    // Stock number variations
    `${vehicle.stockNumber}`,
    `Stock ${vehicle.stockNumber}`,
    `T${vehicle.stockNumber.replace('T', '')}`,
    // Color variations  
    vehicle.color.toLowerCase(),
    vehicle.color.toUpperCase()
  ];

  console.log(`${index + 1}. ${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.color})`);
  console.log(`   Stock: ${vehicle.stockNumber}`);
  console.log(`   Possible folder names to look for:`);
  possibleFolderNames.forEach(name => {
    console.log(`     - "${name}"`);
  });
  console.log("");
});

console.log("\n=== INSTRUCTIONS ===");
console.log("1. Go to your Google Drive folder containing vehicle photos");
console.log("2. Look for folders that match the names above");
console.log("3. Share the folder with this email (give Viewer access):");
console.log("   t-rex-motors@trex-motors-448004.iam.gserviceaccount.com");
console.log("4. Or provide the Google Drive folder URL");
console.log("\nOnce you give access, I can automatically scan and match all folders!");