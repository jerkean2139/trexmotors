// IMPROVED Google Apps Script with better debugging and error handling
// Copy this code to replace your current Google Apps Script

function onEdit(e) {
  // Check if the event object exists and has the required properties
  if (!e || !e.range) {
    console.log('Script not triggered by cell edit - this is normal when running manually');
    return;
  }
  
  console.log('Cell edited at row:', e.range.getRow(), 'column:', e.range.getColumn());
  
  // This runs every time you change a cell
  const row = e.range.getRow();
  if (row > 1) { // Skip the header row
    console.log('Sending vehicle data for row:', row);
    sendVehicleToWebsite(row);
  } else {
    console.log('Header row edited, skipping');
  }
}

function sendVehicleToWebsite(rowNumber) {
  console.log('Starting sendVehicleToWebsite for row:', rowNumber);
  
  const sheet = SpreadsheetApp.getActiveSheet();
  const rowData = sheet.getRange(rowNumber, 1, 1, 12).getValues()[0];
  
  console.log('Raw row data:', rowData);
  
  const vehicleData = {
    status: rowData[0],
    stockNumber: rowData[1], 
    vin: rowData[2],
    year: rowData[3],
    make: rowData[4],
    model: rowData[5],
    miles: rowData[6],
    price: rowData[7],
    exteriorColor: rowData[8],
    interiorColor: rowData[9],
    description: rowData[10],
    notes: rowData[11]
  };
  
  console.log('Formatted vehicle data:', vehicleData);
  
  try {
    console.log('Sending request to:', 'https://trex-motors-keanonbiz.replit.app/api/webhook/vehicle-update');
    
    // Send to your T-Rex Motors website
    const response = UrlFetchApp.fetch('https://trex-motors-keanonbiz.replit.app/api/webhook/vehicle-update', {
      method: 'POST',
      contentType: 'application/json',
      payload: JSON.stringify(vehicleData),
      muteHttpExceptions: true // This prevents errors from stopping execution
    });
    
    console.log('Response status:', response.getResponseCode());
    console.log('Response content:', response.getContentText());
    
    if (response.getResponseCode() === 200) {
      console.log('✓ Vehicle sent to website successfully!');
    } else {
      console.error('✗ Website returned error:', response.getResponseCode());
    }
    
  } catch (error) {
    console.error('✗ Error sending vehicle:', error.toString());
    console.error('Error details:', error);
  }
}

// Enhanced test function with more debugging
function testWebhookDetailed() {
  console.log('=== TESTING WEBHOOK CONNECTION ===');
  
  // Test with sample data first
  console.log('Testing with sample data...');
  const testData = {
    status: "for-sale",
    stockNumber: "TEST123",
    vin: "TESTVIN123456",
    year: 2023,
    make: "Test",
    model: "Vehicle",
    miles: 5000,
    price: 15000,
    exteriorColor: "Blue",
    interiorColor: "Black",
    description: "Test vehicle from Google Apps Script",
    notes: "This is a test"
  };
  
  try {
    const response = UrlFetchApp.fetch('https://trex-motors-keanonbiz.replit.app/api/webhook/vehicle-update', {
      method: 'POST',
      contentType: 'application/json',
      payload: JSON.stringify(testData),
      muteHttpExceptions: true
    });
    
    console.log('Test response status:', response.getResponseCode());
    console.log('Test response:', response.getContentText());
    
  } catch (error) {
    console.error('Test failed:', error);
  }
  
  console.log('Now testing with row 2 data...');
  sendVehicleToWebsite(2);
}

// Function to check what's in your sheet
function debugSheetData() {
  console.log('=== DEBUGGING SHEET DATA ===');
  const sheet = SpreadsheetApp.getActiveSheet();
  
  // Check sheet name
  console.log('Sheet name:', sheet.getName());
  
  // Check row 1 (headers)
  const headers = sheet.getRange(1, 1, 1, 12).getValues()[0];
  console.log('Column headers:', headers);
  
  // Check row 2 (first data row)
  const row2 = sheet.getRange(2, 1, 1, 12).getValues()[0];
  console.log('Row 2 data:', row2);
  
  // Check if there are any empty cells
  for (let i = 0; i < row2.length; i++) {
    if (!row2[i] || row2[i] === '') {
      console.log(`⚠️ Column ${i + 1} (${headers[i]}) is empty in row 2`);
    }
  }
}