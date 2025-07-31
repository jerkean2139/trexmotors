#!/usr/bin/env node
/**
 * Export all vehicle data from database to static JSON file
 * This creates a fallback for when production API fails
 */

import { db } from './server/db.js';
import { vehicles } from './shared/schema.js';
import fs from 'fs';

async function exportVehicleData() {
    console.log('🔄 Exporting vehicle data from database...');
    
    try {
        const allVehicles = await db.select().from(vehicles);
        console.log(`📊 Found ${allVehicles.length} vehicles in database`);
        
        // Write to public directory as static file
        const outputPath = 'public/api/vehicles.json';
        fs.writeFileSync(outputPath, JSON.stringify(allVehicles, null, 2));
        
        console.log(`✅ Exported ${allVehicles.length} vehicles to ${outputPath}`);
        console.log(`📋 Sample vehicles:${allVehicles.slice(0, 3).map(v => `\n  - ${v.year} ${v.make} ${v.model} ($${v.price})`).join('')}`);
        
        return allVehicles;
        
    } catch (error) {
        console.error('❌ Export failed:', error.message);
        throw error;
    }
}

exportVehicleData();