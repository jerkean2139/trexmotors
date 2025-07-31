// SIMPLE SOLUTION: Direct URL opening for Google Apps Script
// This works with your development server at localhost:5000

function onEdit(e) {
  if (!e || !e.range) {
    console.log('Script not triggered by cell edit');
    return;
  }
  
  const row = e.range.getRow();
  if (row > 1) {
    console.log('Cell edited in row:', row);
    sendVehicleViaURL(row);
  }
}

function sendVehicleViaURL(rowNumber) {
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
  
  console.log('Vehicle data:', vehicleData);
  
  // Direct URL to your development server
  const webhookUrl = 'http://localhost:5000/api/webhook/add-vehicle?' + 
    Object.entries(vehicleData)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
  
  console.log('Generated URL:');
  console.log(webhookUrl);
  console.log('');
  console.log('Copy this URL and paste it into your browser to add the vehicle:');
  console.log(webhookUrl);
  
  // Try to open URL directly
  try {
    const htmlOutput = HtmlService
      .createHtmlOutput(`
        <p>Vehicle Ready to Import:</p>
        <p><strong>${vehicleData.year} ${vehicleData.make} ${vehicleData.model}</strong></p>
        <p>VIN: ${vehicleData.vin}</p>
        <p>Stock #: ${vehicleData.stockNumber}</p>
        <p>Price: $${vehicleData.price}</p>
        <br>
        <p>Copy this URL and open it in your browser:</p>
        <textarea style="width:100%; height:100px; font-size:10px;">${webhookUrl}</textarea>
        <br><br>
        <button onclick="window.open('${webhookUrl}', '_blank')">Open Webhook URL</button>
        <script>
          google.script.host.close();
        </script>
      `)
      .setWidth(500)
      .setHeight(400);
    
    SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'T-Rex Motors Vehicle Import');
  } catch (error) {
    console.log('Could not open popup. URL generated successfully:');
    console.log(webhookUrl);
  }
}

function testGETConnection() {
  console.log('=== Testing GET Connection ===');
  sendVehicleViaURL(2);
}