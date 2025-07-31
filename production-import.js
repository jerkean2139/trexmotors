#!/usr/bin/env node
/**
 * Import T-Rex Motors data directly to production database
 * This runs the SQL import using Node.js for Replit deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import { db } from './server/db.js';
import { vehicles } from './shared/schema.js';

async function importToProduction() {
    console.log('🚀 Importing T-Rex Motors data to production...');
    
    // Check if production-data.sql exists
    if (!fs.existsSync('production-data.sql')) {
        console.error('❌ production-data.sql not found');
        process.exit(1);
    }
    
    // Check current vehicle count
    try {
        const currentVehicles = await db.select().from(vehicles);
        console.log(`📊 Current vehicles in database: ${currentVehicles.length}`);
        
        if (currentVehicles.length >= 18) {
            console.log('✅ Database already has vehicles, skipping import');
            return;
        }
    } catch (error) {
        console.log('⚠️  Could not check current vehicles, proceeding with import...');
    }
    
    try {
        // Run database schema setup
        console.log('🔄 Setting up database schema...');
        execSync('npm run db:push', { stdio: 'inherit' });
        
        // Import the SQL data
        console.log('📤 Importing vehicle data...');
        const databaseUrl = process.env.DATABASE_URL;
        
        if (!databaseUrl) {
            throw new Error('DATABASE_URL not found in environment');
        }
        
        // Use psql to import data
        execSync(`psql "${databaseUrl}" < production-data.sql`, { 
            stdio: 'inherit',
            env: { ...process.env }
        });
        
        // Verify import
        const importedVehicles = await db.select().from(vehicles);
        console.log(`🎉 SUCCESS! Imported ${importedVehicles.length} vehicles to production`);
        
        // Show first few vehicles
        console.log('\n📋 Sample vehicles imported:');
        importedVehicles.slice(0, 3).forEach(vehicle => {
            console.log(`  - ${vehicle.year} ${vehicle.make} ${vehicle.model} ($${vehicle.price})`);
        });
        
        console.log('\n✅ Production deployment complete!');
        console.log('🌐 Your website should now display all vehicles');
        
    } catch (error) {
        console.error('❌ Import failed:', error.message);
        
        // Try alternative approach
        console.log('\n🔄 Trying alternative import method...');
        try {
            // Read SQL file and execute manually
            const sqlContent = fs.readFileSync('production-data.sql', 'utf8');
            const statements = sqlContent
                .split(';')
                .map(s => s.trim())
                .filter(s => s && !s.startsWith('--') && s.toLowerCase().includes('insert'));
            
            console.log(`Found ${statements.length} INSERT statements`);
            
            for (const statement of statements.slice(0, 5)) { // Test with first 5
                if (statement.toLowerCase().includes('insert into')) {
                    console.log('Executing:', statement.substring(0, 50) + '...');
                    // Would need direct SQL execution here
                }
            }
            
        } catch (altError) {
            console.error('❌ Alternative method also failed:', altError.message);
            console.log('\n📞 Manual import required:');
            console.log('1. Access your Replit deployment console');
            console.log('2. Run: npm run db:push');
            console.log('3. Run: cat production-data.sql | psql $DATABASE_URL');
        }
        
        process.exit(1);
    }
}

importToProduction();