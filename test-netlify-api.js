// Test script to check what Netlify is actually returning
const https = require('https');

// Test your actual Netlify function
const url = 'https://trex-motors.netlify.app/.netlify/functions/vehicles';

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response Headers:', res.headers);
    console.log('Raw Response:', data);
    
    try {
      const vehicles = JSON.parse(data);
      console.log('\n=== PARSED RESPONSE ===');
      console.log('Number of vehicles returned:', vehicles.length);
      console.log('First vehicle:', vehicles[0]);
      if (vehicles.length > 1) {
        console.log('Last vehicle:', vehicles[vehicles.length - 1]);
      }
    } catch (error) {
      console.error('Failed to parse JSON:', error.message);
    }
  });
}).on('error', (error) => {
  console.error('Request failed:', error.message);
});