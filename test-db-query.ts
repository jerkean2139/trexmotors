#!/usr/bin/env tsx

/**
 * Test Database Query for Vehicle Loading Issue
 */

import { db } from './server/db';
import { vehicles } from './shared/schema';

async function testVehicleQueries() {
  console.log('🚗 Testing vehicle database queries...');
  
  try {
    // Test getAllVehicles equivalent
    console.log('\n1. Testing getAllVehicles query...');
    const allVehicles = await db.select().from(vehicles);
    console.log(`   Found ${allVehicles.length} vehicles total`);
    
    // Test searchVehicles with no filters (should return all)
    console.log('\n2. Testing searchVehicles with no filters...');
    const searchVehicles = await db.select().from(vehicles);
    console.log(`   Search returned ${searchVehicles.length} vehicles`);
    
    // Show first vehicle for debugging
    if (allVehicles.length > 0) {
      console.log('\n3. Sample vehicle data:');
      const first = allVehicles[0];
      console.log(`   ID: ${first.id}`);
      console.log(`   Title: ${first.title}`);
      console.log(`   Slug: ${first.slug}`);
      console.log(`   Status: ${first.status}`);
      console.log(`   Price: $${first.price}`);
    }
    
    // Test for-sale filter specifically
    console.log('\n4. Testing for-sale vehicles...');
    const forSaleVehicles = await db.select().from(vehicles);
    const forSaleCount = forSaleVehicles.filter(v => v.status === 'for-sale').length;
    console.log(`   ${forSaleCount} vehicles with for-sale status`);
    
  } catch (error) {
    console.error('❌ Database query failed:', error);
  }
}

testVehicleQueries().catch(console.error);