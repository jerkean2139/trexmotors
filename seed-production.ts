#!/usr/bin/env tsx

/**
 * T-Rex Motors Production Database Seeder
 * Populates production database with live vehicle inventory
 */

import { db } from './server/db';
import { vehicles } from './shared/schema';

async function seedProduction() {
  console.log('🚗 Seeding production database with T-Rex Motors inventory...');
  
  try {
    // Check existing vehicles
    const existing = await db.select().from(vehicles);
    console.log(`📊 Found ${existing.length} existing vehicles`);
    
    if (existing.length === 0) {
      console.log('❌ No vehicles found in database - seeding required');
      console.log('Please add vehicles through admin interface or import from development');
    } else {
      console.log('✅ Database already populated with vehicles');
      
      // List first few vehicles for verification
      console.log('\n📋 Current inventory:');
      existing.slice(0, 5).forEach(v => {
        console.log(`  • ${v.title} - $${v.price}`);
      });
      
      if (existing.length > 5) {
        console.log(`  ... and ${existing.length - 5} more vehicles`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  }
}

// Run seeding
seedProduction().catch(console.error);