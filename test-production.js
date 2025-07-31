#!/usr/bin/env node
/**
 * Test production API after deployment fix
 */

async function testProduction() {
  console.log('Testing production API...');
  
  try {
    const response = await fetch('https://trex-motors-keanonbiz.replit.app/api/vehicles', {
      method: 'GET',
      headers: {
        'User-Agent': 'T-Rex-Motors-Test/1.0',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log(`Status: ${response.status}`);
    console.log(`Content-Type: ${response.headers.get('content-type')}`);
    
    const text = await response.text();
    
    if (text.includes('Temporary Redirect') || text.includes('Sign Up')) {
      console.log('❌ Still redirecting to login');
      return false;
    }
    
    try {
      const data = JSON.parse(text);
      if (Array.isArray(data)) {
        console.log(`✅ SUCCESS! Got ${data.length} vehicles`);
        return true;
      }
    } catch (e) {
      console.log('❌ Invalid JSON response');
    }
    
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
  
  return false;
}

testProduction();