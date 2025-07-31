#!/usr/bin/env node
/**
 * Debug production API to understand why vehicles aren't showing
 */

console.log('🔍 Debugging Production API Response');
console.log('=====================================');

async function debugProductionAPI() {
  try {
    console.log('📡 Testing production API...');
    
    const response = await fetch('https://trex-motors-keanonbiz.replit.app/api/vehicles');
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Content-Type: ${response.headers.get('content-type')}`);
    
    const text = await response.text();
    console.log(`Response length: ${text.length} characters`);
    console.log(`First 200 chars: ${text.substring(0, 200)}`);
    
    // Try to parse as JSON
    try {
      const data = JSON.parse(text);
      if (Array.isArray(data)) {
        console.log(`✅ Valid JSON array with ${data.length} vehicles`);
        if (data.length > 0) {
          console.log('First vehicle:', data[0].title || 'No title');
        }
      } else {
        console.log('❌ Response is not an array:', typeof data);
      }
    } catch (parseError) {
      console.log('❌ Response is not valid JSON');
      console.log('Raw response:', text.substring(0, 500));
    }
    
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

debugProductionAPI();