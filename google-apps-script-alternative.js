// ALTERNATIVE: Use Google Apps Script to CREATE a web app that RECEIVES data
// Then use a simple trigger to send data to that web app
// This avoids the 403 error from your Replit deployment

function doPost(e) {
  // This function receives data when your Google Sheet changes
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Log the received data
    console.log('Received vehicle data:', data);
    
    // Here you could process the data or forward it to your T-Rex Motors site
    // For now, we'll just confirm receipt
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Vehicle data received',
        received: data
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing data:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function onEdit(e) {
  if (!e || !e.range) {
    console.log('Script not triggered by cell edit');
    return;
  }
  
  const row = e.range.getRow();
  if (row > 1) {
    // Send data to your own Google Apps Script web app first
    sendToGoogleWebApp(row);
  }
}

function sendToGoogleWebApp(rowNumber) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const rowData = sheet.getRange(rowNumber, 1, 1, 12).getValues()[0];
  
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
  
  // Send to your own deployed Google Apps Script first
  // Replace with your actual Google Apps Script web app URL
  const googleWebAppUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
  
  try {
    const response = UrlFetchApp.fetch(googleWebAppUrl, {
      method: 'POST',
      contentType: 'application/json',
      payload: JSON.stringify(vehicleData)
    });
    
    console.log('Sent to Google web app:', response.getContentText());
    
  } catch (error) {
    console.error('Error sending to Google web app:', error);
  }
}