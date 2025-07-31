#!/usr/bin/env node

/**
 * Debug frontend vehicle loading
 */

console.log('🔍 Testing frontend API calls...');

const testVehicleAPI = async () => {
  try {
    console.log('\n1. Testing direct fetch to /api/vehicles...');
    const response = await fetch('http://localhost:5000/api/vehicles');
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Vehicle count: ${data.length}`);
    console.log(`   First vehicle: ${data[0]?.title || 'No vehicles'}`);
    
    console.log('\n2. Testing search endpoint...');
    const searchResponse = await fetch('http://localhost:5000/api/vehicles/search');
    const searchData = await searchResponse.json();
    console.log(`   Search status: ${searchResponse.status}`);
    console.log(`   Search count: ${searchData.length}`);
    
    console.log('\n3. Sample vehicle data structure:');
    if (data[0]) {
      console.log(`   ID: ${data[0].id}`);
      console.log(`   Status: ${data[0].status}`);
      console.log(`   Images: ${data[0].images?.length || 0}`);
    }
    
  } catch (error) {
    console.error('❌ API Test failed:', error);
  }
};

testVehicleAPI();