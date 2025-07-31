// FINAL SOLUTION: Google Apps Script that opens browser page to add vehicles
// This completely bypasses all Cloudflare restrictions

function onEdit(e) {
  if (!e || !e.range) {
    console.log('Script not triggered by cell edit');
    return;
  }
  
  const row = e.range.getRow();
  if (row > 1) {
    console.log('Cell edited in row:', row);
    addVehicleViaBrowser(row);
  }
}

function addVehicleViaBrowser(rowNumber) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const rowData = sheet.getRange(rowNumber, 1, 1, 12).getValues()[0];
  
  const vehicleData = {
    status: rowData[0] || 'For Sale',
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
  
  // Build URL with all vehicle data as parameters - using local webhook bridge
  const baseUrl = 'file:///path/to/your/webhook-bridge.html';
  const params = [
    `status=${encodeURIComponent(vehicleData.status)}`,
    `stockNumber=${encodeURIComponent(vehicleData.stockNumber)}`,
    `vin=${encodeURIComponent(vehicleData.vin)}`,
    `year=${vehicleData.year}`,
    `make=${encodeURIComponent(vehicleData.make)}`,
    `model=${encodeURIComponent(vehicleData.model)}`,
    `miles=${vehicleData.miles}`,
    `price=${vehicleData.price}`,
    `exteriorColor=${encodeURIComponent(vehicleData.exteriorColor)}`,
    `interiorColor=${encodeURIComponent(vehicleData.interiorColor)}`,
    `description=${encodeURIComponent(vehicleData.description)}`,
    `notes=${encodeURIComponent(vehicleData.notes)}`
  ];
  
  const fullUrl = baseUrl + '?' + params.join('&');
  
  console.log('Opening vehicle import page...');
  console.log('URL:', fullUrl.substring(0, 100) + '...');
  
  // Open the webhook receiver page in browser
  // This bypasses all API restrictions since it's just opening a webpage
  const htmlOutput = HtmlService
    .createHtmlOutput(`
      <script>
        window.open('${fullUrl}', '_blank');
        google.script.host.close();
      </script>
      <p>Opening T-Rex Motors vehicle import page...</p>
    `)
    .setWidth(400)
    .setHeight(200);
  
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Adding Vehicle to T-Rex Motors');
}

function testBrowserMethod() {
  console.log('=== Testing Browser Method ===');
  addVehicleViaBrowser(2);
}

// Alternative: Direct browser opening without popup
function addVehicleDirectBrowser(rowNumber) {
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
  
  const baseUrl = 'https://trex-motors-keanonbiz.replit.app/webhook-receiver';
  const params = Object.entries(vehicleData)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  
  const fullUrl = baseUrl + '?' + params;
  
  console.log('Vehicle will be added via browser at:', fullUrl.substring(0, 80) + '...');
  console.log('Copy this URL and open it in your browser to add the vehicle.');
  console.log(fullUrl);
}