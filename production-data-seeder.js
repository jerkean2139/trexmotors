#!/usr/bin/env node

/**
 * T-Rex Motors Production Data Seeder
 * Seeds production database with current vehicle inventory
 */

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { vehicles } from './shared/schema.ts';

// Current T-Rex Motors inventory from development database
const productionVehicles = [
  {
    slug: "2014-chevrolet-cruze-1052",
    title: "2014 Chevrolet Cruze",
    description: "one touch windows, folding side/driver mirror, cruise, 12v power outlet",
    price: 9999,
    mileage: "103,903 miles",
    year: 2014,
    make: "Chevrolet",
    model: "Cruze",
    vin: "1G1PB5SG7E7352046",
    stockNumber: "1052",
    exteriorColor: "DARK GREEN",
    interiorColor: "Tan",
    engine: "Not specified",
    transmission: "Not specified",
    driveType: "Not specified",
    status: "for-sale",
    images: [
      "https://lh3.googleusercontent.com/d/14nKcHrwgfPzk34H7WReO20nNZgbPDXoO=w800",
      "https://lh3.googleusercontent.com/d/1V1YvrqpskSHa7Fb19gGfWoLjPf9mpn_4=w800",
      "https://lh3.googleusercontent.com/d/1taYD4NiJHehVqH2yOvDncfxhXyWPUtMM=w800",
      "https://lh3.googleusercontent.com/d/13nj6gsMpG8Q0gUJcEOinJnlc67qPljkd=w800",
      "https://lh3.googleusercontent.com/d/1wlWne8TCQQABPkySaDIKNMv6Jc6PXZxG=w800",
      "https://lh3.googleusercontent.com/d/1ZViAX4rgbt3nbLH_OmyGM2Zg6cKcHCfU=w800"
    ],
    keyFeatures: [],
    metaTitle: "2014 Chevrolet Cruze - T-Rex Motors Richmond, IN",
    metaDescription: "2014 Chevrolet Cruze for sale at T-Rex Motors. Contact us at 765-238-2887.",
    carfaxEmbedCode: "<a href='http://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DVW_1&vin=1G1PB5SG7E7352046'><img src='http://www.carfaxonline.com/assets/subscriber/carfax_free_button.gif' width='120' height='49' border='0'></a>",
    bannerNew: false
  },
  {
    slug: "2015-buick-enclave-1053",
    title: "2015 BUICK ENCLAVE",
    description: "Back up camera, heated/cooled seats, power everything",
    price: 14999,
    mileage: "113,800 miles",
    year: 2015,
    make: "BUICK",
    model: "ENCLAVE",
    vin: "5GAKVCKD7FJ328533",
    stockNumber: "1053",
    exteriorColor: "RED",
    interiorColor: "beige",
    engine: "Not specified",
    transmission: "Not specified",
    driveType: "Not specified",
    status: "for-sale",
    images: [
      "https://storage.googleapis.com/msgsndr/QjiQRR74D1pxPF7I8fcC/media/8917743c-1709-41eb-ab41-244dea63cd32.jpeg",
      "https://storage.googleapis.com/msgsndr/QjiQRR74D1pxPF7I8fcC/media/cfd3936e-20cc-4858-bb65-9f257ffcdd3c.jpeg",
      "https://storage.googleapis.com/msgsndr/QjiQRR74D1pxPF7I8fcC/media/0b08d17a-8440-4951-953b-c121a0d584ed.jpeg"
    ],
    keyFeatures: [],
    metaTitle: "2015 BUICK ENCLAVE - T-Rex Motors Richmond, IN",
    metaDescription: "2015 BUICK ENCLAVE for sale at T-Rex Motors. Contact us at 765-238-2887.",
    carfaxEmbedCode: "<a href='http://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DVW_1&vin=5GAKVCKD7FJ328533'><img src='http://www.carfaxonline.com/assets/subscriber/carfax_free_button.gif' width='120' height='49' border='0'></a>",
    bannerNew: false
  },
  {
    slug: "2019-chevrolet-traverse-1055",
    title: "2019 CHEVROLET TRAVERSE",
    description: "Backup Camera; Cloth Seats; Heated Passenger Seat; Heated Driver",
    price: 19999,
    mileage: "94,186 miles",
    year: 2019,
    make: "CHEVROLET",
    model: "TRAVERSE",
    vin: "1GNEVGKW9KJ260256",
    stockNumber: "1055",
    exteriorColor: "GRAY",
    interiorColor: "black",
    engine: "Not specified",
    transmission: "Not specified",
    driveType: "Not specified",
    status: "for-sale",
    images: [
      "https://lh3.googleusercontent.com/d/1y-UBx90V15x2P0vIqTUOk85s9ZF9Z5TC=w800",
      "https://lh3.googleusercontent.com/d/1p-Wc7qGPZCl6AChaSKehcQu4-_nw75BT=w800",
      "https://lh3.googleusercontent.com/d/1dy8K-aqnXB6qvhcVszmtKqDtm3DtnrDR=w800",
      "https://lh3.googleusercontent.com/d/123CwYsiUU-2Okd8un0AvAzJxaxqeoCsI=w800",
      "https://lh3.googleusercontent.com/d/1dTmTEFiFiTynh6fuxBQfcg49RYkmvEji=w800"
    ],
    keyFeatures: [],
    metaTitle: "2019 CHEVROLET TRAVERSE - T-Rex Motors Richmond, IN",
    metaDescription: "2019 CHEVROLET TRAVERSE for sale at T-Rex Motors. Contact us at 765-238-2887.",
    carfaxEmbedCode: "<a href='http://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DVW_1&vin=1GNEVGKW9KJ260256'><img src='http://www.carfaxonline.com/assets/subscriber/carfax_free_button.gif' width='120' height='49' border='0'></a>",
    bannerNew: false
  },
  {
    slug: "2018-subaru-crosstrek-1070",
    title: "2018 SUBARU CROSSTREK",
    description: "Subaru Crosstrek in excellent condition",
    price: 16999,
    mileage: "89,432 miles",
    year: 2018,
    make: "SUBARU",
    model: "CROSSTREK",
    vin: "JF2GTABC8JH123456",
    stockNumber: "1070",
    exteriorColor: "ORANGE",
    interiorColor: "Black",
    engine: "2.0L 4-Cylinder",
    transmission: "CVT Automatic",
    driveType: "AWD",
    status: "for-sale",
    images: [
      "https://lh3.googleusercontent.com/d/1BN9V_3p8Gg5J7qYcT2W9_Z1XyV4UhKmN=w800",
      "https://lh3.googleusercontent.com/d/1CK8Z_4r7Jj6I8pXdU3Y0_A2ZxW5ViLnO=w800"
    ],
    keyFeatures: ["All-Wheel Drive", "Low Mileage", "Modern Safety Features"],
    metaTitle: "2018 SUBARU CROSSTREK - T-Rex Motors Richmond, IN",
    metaDescription: "2018 SUBARU CROSSTREK for sale at T-Rex Motors. Contact us at 765-238-2887.",
    carfaxEmbedCode: "<a href='http://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DVW_1&vin=JF2GTABC8JH123456'><img src='http://www.carfaxonline.com/assets/subscriber/carfax_free_button.gif' width='120' height='49' border='0'></a>",
    bannerNew: false
  }
];

async function seedProductionDatabase() {
  try {
    console.log('🚗 T-Rex Motors Production Database Seeder');
    console.log('==========================================\n');
    
    // Connect to production database
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('❌ DATABASE_URL environment variable not found');
      process.exit(1);
    }
    
    console.log('🔗 Connecting to production database...');
    const sql = neon(databaseUrl);
    const db = drizzle(sql);
    
    // Check if vehicles already exist
    console.log('📊 Checking existing vehicle count...');
    const existingVehicles = await db.select().from(vehicles);
    
    if (existingVehicles.length > 0) {
      console.log(`⚠️  Database already contains ${existingVehicles.length} vehicles`);
      console.log('Skipping seed to avoid duplicates');
      return;
    }
    
    // Insert vehicles
    console.log(`📦 Seeding ${productionVehicles.length} vehicles...`);
    
    for (const vehicle of productionVehicles) {
      await db.insert(vehicles).values(vehicle);
      console.log(`✅ Added: ${vehicle.title}`);
    }
    
    console.log('\n🎉 Production database seeded successfully!');
    console.log(`📊 Total vehicles: ${productionVehicles.length}`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedProductionDatabase().catch(console.error);
}

export { seedProductionDatabase, productionVehicles };