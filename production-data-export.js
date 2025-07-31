#!/usr/bin/env node
/**
 * Production Data Export for T-Rex Motors
 * Exports all development data to SQL files for production deployment
 */

import { db } from './server/db';
import { vehicles, inquiries, customerApplications } from './shared/schema';
import fs from 'fs';
import path from 'path';

async function exportProductionData() {
  console.log('🚗 Exporting T-Rex Motors data for production deployment...');
  
  try {
    // Export vehicles data
    const vehicleData = await db.select().from(vehicles);
    console.log(`✅ Found ${vehicleData.length} vehicles to export`);
    
    // Export inquiries data  
    const inquiryData = await db.select().from(inquiries);
    console.log(`✅ Found ${inquiryData.length} inquiries to export`);
    
    // Export customer applications data
    const applicationData = await db.select().from(customerApplications);
    console.log(`✅ Found ${applicationData.length} applications to export`);
    
    // Generate SQL INSERT statements
    let sqlContent = `-- T-Rex Motors Production Data Export
-- Generated: ${new Date().toISOString()}
-- This file contains all development data for production deployment

-- Clear existing data (optional - uncomment if needed)
-- DELETE FROM customer_applications;
-- DELETE FROM inquiries;  
-- DELETE FROM vehicles;

-- Reset sequences (optional - uncomment if needed)
-- ALTER SEQUENCE vehicles_id_seq RESTART WITH 1;
-- ALTER SEQUENCE inquiries_id_seq RESTART WITH 1;
-- ALTER SEQUENCE customer_applications_id_seq RESTART WITH 1;

`;

    // Export vehicles
    if (vehicleData.length > 0) {
      sqlContent += '\n-- VEHICLES DATA\n';
      for (const vehicle of vehicleData) {
        const values = [
          vehicle.id,
          `'${vehicle.slug.replace(/'/g, "''")}'`,
          `'${vehicle.title.replace(/'/g, "''")}'`,
          vehicle.description ? `'${vehicle.description.replace(/'/g, "''").replace(/\n/g, '\\n')}'` : 'NULL',
          vehicle.price,
          `'${vehicle.status}'`,
          vehicle.mileage || 'NULL',
          vehicle.year ? `'${vehicle.year}'` : 'NULL',
          vehicle.make ? `'${vehicle.make.replace(/'/g, "''")}'` : 'NULL',
          vehicle.model ? `'${vehicle.model.replace(/'/g, "''")}'` : 'NULL',
          vehicle.engine ? `'${vehicle.engine.replace(/'/g, "''")}'` : 'NULL',
          vehicle.transmission ? `'${vehicle.transmission.replace(/'/g, "''")}'` : 'NULL',
          vehicle.driveType ? `'${vehicle.driveType.replace(/'/g, "''")}'` : 'NULL',
          vehicle.fuelType ? `'${vehicle.fuelType.replace(/'/g, "''")}'` : 'NULL',
          vehicle.exteriorColor ? `'${vehicle.exteriorColor.replace(/'/g, "''")}'` : 'NULL',
          vehicle.interiorColor ? `'${vehicle.interiorColor.replace(/'/g, "''")}'` : 'NULL',
          vehicle.images ? `'${JSON.stringify(vehicle.images).replace(/'/g, "''")}'::jsonb` : 'NULL',
          vehicle.keyFeatures ? `'${JSON.stringify(vehicle.keyFeatures).replace(/'/g, "''")}'::jsonb` : 'NULL',
          vehicle.metaTitle ? `'${vehicle.metaTitle.replace(/'/g, "''")}'` : 'NULL',
          vehicle.metaDescription ? `'${vehicle.metaDescription.replace(/'/g, "''")}'` : 'NULL',
          vehicle.carfaxEmbedCode ? `'${vehicle.carfaxEmbedCode.replace(/'/g, "''")}'` : 'NULL',
          vehicle.bannerNew ? 'true' : 'false',
          vehicle.bannerSale ? 'true' : 'false',
          vehicle.bannerSold ? 'true' : 'false',
          `'${new Date(vehicle.createdAt).toISOString()}'`,
          `'${new Date(vehicle.updatedAt).toISOString()}'`
        ];
        
        sqlContent += `INSERT INTO vehicles (id, slug, title, description, price, status, mileage, year, make, model, engine, transmission, drive_type, fuel_type, exterior_color, interior_color, images, key_features, meta_title, meta_description, carfax_embed_code, banner_new, banner_sale, banner_sold, created_at, updated_at) VALUES (${values.join(', ')});\n`;
      }
    }

    // Export inquiries
    if (inquiryData.length > 0) {
      sqlContent += '\n-- INQUIRIES DATA\n';
      for (const inquiry of inquiryData) {
        const values = [
          inquiry.id,
          `'${inquiry.firstName.replace(/'/g, "''")}'`,
          `'${inquiry.lastName.replace(/'/g, "''")}'`,
          `'${inquiry.email.replace(/'/g, "''")}'`,
          inquiry.phone ? `'${inquiry.phone.replace(/'/g, "''")}'` : 'NULL',
          inquiry.vehicleId || 'NULL',
          `'${inquiry.message.replace(/'/g, "''").replace(/\n/g, '\\n')}'`,
          `'${new Date(inquiry.createdAt).toISOString()}'`
        ];
        
        sqlContent += `INSERT INTO inquiries (id, first_name, last_name, email, phone, vehicle_id, message, created_at) VALUES (${values.join(', ')});\n`;
      }
    }

    // Export customer applications
    if (applicationData.length > 0) {
      sqlContent += '\n-- CUSTOMER APPLICATIONS DATA\n';
      for (const app of applicationData) {
        const values = [
          app.id,
          `'${app.firstName.replace(/'/g, "''")}'`,
          `'${app.lastName.replace(/'/g, "''")}'`,
          `'${app.email.replace(/'/g, "''")}'`,
          app.phone ? `'${app.phone.replace(/'/g, "''")}'` : 'NULL',
          app.dateOfBirth ? `'${app.dateOfBirth}'` : 'NULL',
          app.ssn ? `'${app.ssn.replace(/'/g, "''")}'` : 'NULL',
          app.annualIncome || 'NULL',
          app.employmentStatus ? `'${app.employmentStatus.replace(/'/g, "''")}'` : 'NULL',
          app.employer ? `'${app.employer.replace(/'/g, "''")}'` : 'NULL',
          app.address ? `'${app.address.replace(/'/g, "''")}'` : 'NULL',
          app.city ? `'${app.city.replace(/'/g, "''")}'` : 'NULL',
          app.state ? `'${app.state.replace(/'/g, "''")}'` : 'NULL',
          app.zipCode ? `'${app.zipCode.replace(/'/g, "''")}'` : 'NULL',
          app.vehicleId || 'NULL',
          app.loanAmount || 'NULL',
          app.downPayment || 'NULL',
          `'${app.status}'`,
          `'${new Date(app.createdAt).toISOString()}'`,
          `'${new Date(app.updatedAt).toISOString()}'`
        ];
        
        sqlContent += `INSERT INTO customer_applications (id, first_name, last_name, email, phone, date_of_birth, ssn, annual_income, employment_status, employer, address, city, state, zip_code, vehicle_id, loan_amount, down_payment, status, created_at, updated_at) VALUES (${values.join(', ')});\n`;
      }
    }

    // Update sequences to continue from max ID
    sqlContent += '\n-- UPDATE SEQUENCES\n';
    if (vehicleData.length > 0) {
      const maxVehicleId = Math.max(...vehicleData.map(v => v.id));
      sqlContent += `SELECT setval('vehicles_id_seq', ${maxVehicleId + 1});\n`;
    }
    if (inquiryData.length > 0) {
      const maxInquiryId = Math.max(...inquiryData.map(i => i.id));
      sqlContent += `SELECT setval('inquiries_id_seq', ${maxInquiryId + 1});\n`;
    }
    if (applicationData.length > 0) {
      const maxAppId = Math.max(...applicationData.map(a => a.id));
      sqlContent += `SELECT setval('customer_applications_id_seq', ${maxAppId + 1});\n`;
    }

    // Write to file
    fs.writeFileSync('production-data.sql', sqlContent);
    
    // Also create a JSON backup
    const jsonBackup = {
      exportDate: new Date().toISOString(),
      vehicles: vehicleData,
      inquiries: inquiryData,
      customerApplications: applicationData
    };
    fs.writeFileSync('production-data-backup.json', JSON.stringify(jsonBackup, null, 2));
    
    console.log('\n🎉 Production data export completed!');
    console.log(`📄 SQL file: production-data.sql (${vehicleData.length} vehicles, ${inquiryData.length} inquiries, ${applicationData.length} applications)`);
    console.log(`💾 JSON backup: production-data-backup.json`);
    console.log('\n📋 Next steps:');
    console.log('1. Deploy your application to production');
    console.log('2. Run: npm run db:push (to create tables)');
    console.log('3. Execute the production-data.sql file in your production database');
    console.log('4. Your vehicles and data will appear in production!');
    
  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  }
}

exportProductionData();