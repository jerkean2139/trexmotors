// Apply all matched images from Google Drive to T-Rex Motors vehicles
// This script will update all 10 matched vehicles with their corresponding images

import fetch from 'node-fetch';

const DRIVE_FOLDER_URL = "https://drive.google.com/drive/folders/1-AhZ6wwgNK9qQifm9j5eCoCkA316j7sk?usp=sharing";
const API_BASE = "http://localhost:5000";

async function scanAndApplyAllImages() {
  console.log("=== T-REX MOTORS BULK IMAGE IMPORT ===\n");
  
  try {
    // Step 1: Scan Google Drive folder
    console.log("🔍 Scanning Google Drive folder...");
    const scanResponse = await fetch(`${API_BASE}/api/admin/scan-drive-folder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ folderUrl: DRIVE_FOLDER_URL })
    });
    
    if (!scanResponse.ok) {
      throw new Error(`Scan failed: ${scanResponse.statusText}`);
    }
    
    const scanResults = await scanResponse.json();
    console.log(`✅ Found ${scanResults.totalFolders} folders, matched ${scanResults.matchedVehicles} vehicles\n`);
    
    if (scanResults.matchedVehicles === 0) {
      console.log("❌ No vehicle matches found. Check folder names and try again.");
      return;
    }
    
    // Step 2: Apply all matches
    console.log("📸 Applying images to matched vehicles...");
    const applyResponse = await fetch(`${API_BASE}/api/admin/apply-drive-matches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ matches: scanResults.matches })
    });
    
    if (!applyResponse.ok) {
      throw new Error(`Apply failed: ${applyResponse.statusText}`);
    }
    
    const applyResults = await applyResponse.json();
    console.log(`✅ Successfully updated ${applyResults.totalUpdated} vehicles with images\n`);
    
    // Step 3: Show detailed results
    console.log("📋 DETAILED RESULTS:");
    console.log("=".repeat(50));
    
    applyResults.success.forEach((result, index) => {
      console.log(`${index + 1}. ✅ ${result.vehicle} (Stock #${result.stockNumber})`);
      console.log(`   → Added ${result.imageCount} images`);
      console.log("");
    });
    
    if (applyResults.errors.length > 0) {
      console.log("❌ ERRORS:");
      applyResults.errors.forEach((error, index) => {
        console.log(`${index + 1}. Stock #${error.stockNumber}: ${error.error}`);
      });
    }
    
    console.log("=".repeat(50));
    console.log(`🎉 COMPLETE! ${applyResults.totalUpdated} vehicles now have photos`);
    console.log("🚗 Vehicles with 4+ images will show 360° virtual tours");
    console.log("🌐 Visit your website to see the updated inventory");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Run the script
scanAndApplyAllImages();