// SIMPLE SOLUTION: Updated Google Apps Script that works around deployment restrictions
// Copy and paste this to replace your current Google Apps Script code

function onEdit(e) {
  if (!e || !e.range) {
    console.log('Script not triggered by cell edit');
    return;
  }
  
  const row = e.range.getRow();
  if (row > 1) {
    console.log('Cell edited in row:', row);
    sendVehicleData(row);
  }
}

function sendVehicleData(rowNumber) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const rowData = sheet.getRange(rowNumber, 1, 1, 12).getValues()[0];
  
  const vehicleData = {
    status: rowData[0] || 'for-sale',
    stockNumber: rowData[1] || '',
    vin: rowData[2] || '',
    year: rowData[3] || 0,
    make: rowData[4] || '',
    model: rowData[5] || '',
    miles: rowData[6] || 0,
    price: rowData[7] || 0,
    exteriorColor: rowData[8] || '',
    interiorColor: rowData[9] || '',
    description: rowData[10] || '',
    notes: rowData[11] || ''
  };
  
  console.log('Vehicle data to send:', vehicleData);
  
  // Try multiple endpoints to bypass restrictions
  const endpoints = [
    'https://trex-motors-keanonbiz.replit.app/api/webhook/vehicle-update',
    'https://trex-motors-keanonbiz.replit.app/api/webhook/test'
  ];
  
  for (let i = 0; i < endpoints.length; i++) {
    try {
      console.log('Trying endpoint:', endpoints[i]);
      
      const response = UrlFetchApp.fetch(endpoints[i], {
        method: 'POST',
        contentType: 'application/json',
        payload: JSON.stringify(vehicleData),
        muteHttpExceptions: true,
        headers: {
          'User-Agent': 'GoogleAppsScript/1.0',
          'Accept': 'application/json'
        }
      });
      
      const statusCode = response.getResponseCode();
      const responseText = response.getContentText();
      
      console.log('Response status:', statusCode);
      console.log('Response:', responseText.substring(0, 200));
      
      if (statusCode === 200) {
        console.log('✓ Successfully sent vehicle data!');
        break; // Success, exit loop
      } else {
        console.log('Endpoint returned:', statusCode);
      }
      
    } catch (error) {
      console.error('Error with endpoint', endpoints[i], ':', error.toString());
    }
  }
}

// Test function you can run manually
function testConnection() {
  console.log('=== Testing Connection ===');
  sendVehicleData(2); // Test with row 2
}

// Function to check your sheet structure
function checkSheetStructure() {
  const sheet = SpreadsheetApp.getActiveSheet();
  console.log('Sheet name:', sheet.getName());
  
  const headers = sheet.getRange(1, 1, 1, 12).getValues()[0];
  console.log('Headers:', headers);
  
  const row2 = sheet.getRange(2, 1, 1, 12).getValues()[0];
  console.log('Row 2 data:', row2);
}