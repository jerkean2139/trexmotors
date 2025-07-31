#!/usr/bin/env node

/**
 * T-Rex Motors Production Data Migration Script
 * Migrates vehicle data from development to production database
 */

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { vehicles } from './shared/schema.js';

// Development vehicles data (exported from current database)
const developmentVehicles = [
  {
    title: "2014 Chevrolet Cruze",
    slug: "2014-chevrolet-cruze-1052",
    description: "one touch windows, folding side/driver mirror, cruise, 12v power outlet",
    price: 9999,
    mileage: "103,903 miles",
    year: 2014,
    make: "Chevrolet",
    model: "Cruze",
    status: "for-sale",
    images: ["https://lh3.googleusercontent.com/d/14nKcHrwgfPzk34H7WReO20nNZgbPDXoO=w800","https://lh3.googleusercontent.com/d/1V1YvrqpskSHa7Fb19gGfWoLjPf9mpn_4=w800","https://lh3.googleusercontent.com/d/1taYD4NiJHehVqH2yOvDncfxhXyWPUtMM=w800","https://lh3.googleusercontent.com/d/13nj6gsMpG8Q0gUJcEOinJnlc67qPljkd=w800","https://lh3.googleusercontent.com/d/1wlWne8TCQQABPkySaDIKNMv6Jc6PXZxG=w800","https://lh3.googleusercontent.com/d/1ZViAX4rgbt3nbLH_OmyGM2Zg6cKcHCfU=w800"]
  },
  {
    title: "2015 BUICK ENCLAVE",
    slug: "2015-buick-enclave-1053",
    description: "Back up camera, heated/cooled seats, power everything",
    price: 14999,
    mileage: "113,800 miles",
    year: 2015,
    make: "BUICK",
    model: "ENCLAVE",
    status: "for-sale",
    images: ["https://storage.googleapis.com/msgsndr/QjiQRR74D1pxPF7I8fcC/media/8917743c-1709-41eb-ab41-244dea63cd32.jpeg","https://storage.googleapis.com/msgsndr/QjiQRR74D1pxPF7I8fcC/media/cfd3936e-20cc-4858-bb65-9f257ffcdd3c.jpeg","https://storage.googleapis.com/msgsndr/QjiQRR74D1pxPF7I8fcC/media/0b08d17a-8440-4951-953b-c121a0d584ed.jpeg"]
  },
  {
    title: "2019 CHEVROLET TRAVERSE",
    slug: "2019-chevrolet-traverse-1055",
    description: "Backup Camera; Cloth Seats; Heated Passenger Seat; Heated Driver",
    price: 19999,
    mileage: "94,186 miles",
    year: 2019,
    make: "CHEVROLET",
    model: "TRAVERSE",
    status: "for-sale",
    images: ["https://lh3.googleusercontent.com/d/1y-UBx90V15x2P0vIqTUOk85s9ZF9Z5TC=w800","https://lh3.googleusercontent.com/d/1p-Wc7qGPZCl6AChaSKehcQu4-_nw75BT=w800","https://lh3.googleusercontent.com/d/1dy8K-aqnXB6qvhcVszmtKqDtm3DtnrDR=w800","https://lh3.googleusercontent.com/d/123CwYsiUU-2Okd8un0AvAzJxaxqeoCsI=w800","https://lh3.googleusercontent.com/d/1dTmTEFiFiTynh6fuxBQfcg49RYkmvEji=w800"]
  },
  {
    title: "2013 Ford Flex SEL",
    slug: "2013-ford-flex-sel-1008",
    description: "Ford Flex SEL in excellent condition",
    price: 8481,
    mileage: "155,359 miles",
    year: 2013,
    make: "Ford",
    model: "Flex SEL",
    status: "for-sale",
    images: ["https://lh3.googleusercontent.com/d/1ahTVcnbbMsVT3A4sXLXWeErnAp9my3or=w800","https://lh3.googleusercontent.com/d/1kyBMnWQn0fRnp2BZPbszLUQae4CUA7MD=w800","https://lh3.googleusercontent.com/d/1KT-AtYYWXNFbxJIzxVCWR0W7cDGhZqWa=w800","https://lh3.googleusercontent.com/d/1vJTUkQykIFjsc8ekelEkqN96U0F0d1QD=w800"]
  },
  {
    title: "2020 Dodge Charger",
    slug: "2020-dodge-charger-1021",
    description: "Backup Camera; Cloth Seats; Remote Start; Dual A/C Zones;",
    price: 17999,
    mileage: "96,627 miles",
    year: 2020,
    make: "Dodge",
    model: "Charger",
    status: "for-sale",
    images: []
  },
  {
    title: "2014 Jeep Grand Cherokee",
    slug: "2014-jeep-grand-cherokee-1024",
    description: "Cloth Seats; Dual A/C Zones; Automatic Climate Control; Front Fog",
    price: 12999,
    mileage: "120,955 miles",
    year: 2014,
    make: "Jeep",
    model: "Grand Cherokee",
    status: "for-sale",
    images: ["https://lh3.googleusercontent.com/d/1Ddld_oatcmFQmYECMk6AI3t3TRrXZ5Uz=w800","https://lh3.googleusercontent.com/d/1iw204UrvQhd96zpBcsNwfrZCuUhvdYwD=w800","https://lh3.googleusercontent.com/d/1vDLT2p0Ci2noR3-yOIPSqYXE9x6A8Nfq=w800"]
  },
  {
    title: "2018 Honda Civic",
    slug: "2018-honda-civic-1027",
    description: "Backup Camera; Cloth Seats; Automatic Climate Control; Moonroof/Sunroof;",
    price: 17999,
    mileage: "98,964 miles",
    year: 2018,
    make: "Honda",
    model: "Civic",
    status: "for-sale",
    images: ["https://lh3.googleusercontent.com/d/1gp6RvBgWGdvCBInInrYC0GH-6BhBvukQ=w800","https://lh3.googleusercontent.com/d/10DM0LVYuM7BO-BCyVS4ZSEYkAepscoHI=w800","https://lh3.googleusercontent.com/d/1DGTNh9eMV2i5qqFJBxpswNGctlI2cZ98=w800"]
  },
  {
    title: "2015 Toyota Corolla",
    slug: "2015-toyota-corolla-1041",
    description: "back up camera, power windows, power locks, cruise control, cd player, cloth seats",
    price: 13999,
    mileage: "74,684 miles",
    year: 2015,
    make: "Toyota",
    model: "Corolla",
    status: "for-sale",
    images: []
  },
  {
    title: "2018 Chevrolet Silverado LT",
    slug: "2018-chevrolet-silverado-lt-1042",
    description: "Backup Camera; Cloth Seats; Daytime Running Lights; SiriusXM Equipped;",
    price: 19999,
    mileage: "125,698 miles",
    year: 2018,
    make: "Chevrolet",
    model: "Silverado LT",
    status: "for-sale",
    images: []
  },
  {
    title: "2016 Ford Focus",
    slug: "2016-ford-focus-1044",
    description: "Ford Focus in excellent condition",
    price: 8999,
    mileage: "154,627 miles",
    year: 2016,
    make: "Ford",
    model: "Focus",
    status: "for-sale",
    images: []
  },
  {
    title: "2020 Chevrolet Malibu",
    slug: "2020-chevrolet-malibu-1049",
    description: "Backup Camera; Cloth Seats; Heated Passenger Seat; Heated Driver Seat, Remote Start",
    price: 19999,
    mileage: "53,747 miles",
    year: 2020,
    make: "Chevrolet",
    model: "Malibu",
    status: "for-sale",
    images: []
  },
  {
    title: "2019 Dodge Journey",
    slug: "2019-dodge-journey-1050",
    description: "Backup Camera; Cloth Seats; Dual A/C Zones; Front Fog Lights; Daytime",
    price: 13499,
    mileage: "80,889 miles",
    year: 2019,
    make: "Dodge",
    model: "Journey",
    status: "for-sale",
    images: ["https://lh3.googleusercontent.com/d/1V4nhuQbD7DI63tvpYnKd-7jmeKcy3GUf=w800","https://lh3.googleusercontent.com/d/1FgKgW8i1131giPWyIfGmzVs8gCQClhub=w800","https://lh3.googleusercontent.com/d/1lVcvkONpWBzKz31dzrrU2addN2Il6LCx=w800","https://lh3.googleusercontent.com/d/14-16b90_I8SFEveNejqz0tG6nI8hYn1x=w800"]
  },
  {
    title: "2014 JEEP WRANGLER SAHARA UNLIMITED",
    slug: "2014-jeep-wrangler-sahara-unlimited-1057",
    description: "Cloth Seats; Soft Top; Front Fog Lights; Daytime Running Lights; SiriusXM Equipped; CD Player; Cargo Floor Mat; Cruise Control; Remote Keyless Entry",
    price: 16999,
    mileage: "176,130 miles",
    year: 2014,
    make: "JEEP",
    model: "WRANGLER SAHARA UNLIMITED",
    status: "for-sale",
    images: []
  },
  {
    title: "2019 HYUNDAI SANTA FE",
    slug: "2019-hyundai-santa-fe-1060",
    description: "Backup Camera; Cloth Seats; Daytime Running Lights; Touch Screen",
    price: 13999,
    mileage: "122,171 miles",
    year: 2019,
    make: "HYUNDAI",
    model: "SANTA FE",
    status: "for-sale",
    images: []
  },
  {
    title: "2020 KIA FORTE",
    slug: "2020-kia-forte-1061",
    description: "Backup Camera; Cloth Seats; Daytime Running Lights; Touch Screen",
    price: 17999,
    mileage: "52,972 miles",
    year: 2020,
    make: "KIA",
    model: "FORTE",
    status: "for-sale",
    images: ["https://lh3.googleusercontent.com/d/1F1T1SWydciTX-ZyCBmlGfaHFwTHkCiVj=w800","https://lh3.googleusercontent.com/d/1CUz0uNFVbSvTyQ2YM-cnLG42a5sIZpqq=w800","https://lh3.googleusercontent.com/d/1RyzOC_RC_N_XvhMINM06CaLe-WFMPaRk=w800"]
  },
  {
    title: "2011 CHEVROLET IMPALA",
    slug: "2011-chevrolet-impala-1064",
    description: "Chevrolet Impala in excellent condition",
    price: 4999,
    mileage: "197,000 miles",
    year: 2011,
    make: "CHEVROLET",
    model: "IMPALA",
    status: "for-sale",
    images: ["https://lh3.googleusercontent.com/d/1dnnmkQKjHHlBvzgxRYyPB08m5i4xWJ8A=w800","https://lh3.googleusercontent.com/d/1q0Ir-3k5-vVm3jhYfrF3X5E_2Nd0ZFH7=w800","https://lh3.googleusercontent.com/d/1k6IPhcZi3kZ8rOGTOnv4Zbn0uC0qDxcS=w800"]
  },
  {
    title: "2016 BUICK ENCORE",
    slug: "2016-buick-encore-1068",
    description: "Buick Encore in excellent condition",
    price: 10999,
    mileage: "124,242 miles",
    year: 2016,
    make: "BUICK",
    model: "ENCORE",
    status: "for-sale",
    images: ["https://drive.google.com/uc?id=10G8jCydAIduxztWLeVOIL1QY0uAfXWNw","https://drive.google.com/uc?id=1apbCnv9WgL0b8P--cRaljYIlAJw9G_3G","https://drive.google.com/uc?id=1H2o6TI_4Ntj2CUatUKcsdECGtwdM2HuJ"]
  },
  {
    title: "2018 SUBARU CROSSTREK",
    slug: "2018-subaru-crosstrek-1070",
    description: "Subaru Crosstrek in excellent condition",
    price: 18999,
    mileage: "110,428 miles",
    year: 2018,
    make: "SUBARU",
    model: "CROSSTREK",
    status: "for-sale",
    images: []
  }
];

async function migrateToProduction() {
  console.log('🚗 Starting T-Rex Motors data migration...');
  
  // Connect to production database
  const productionDbUrl = process.env.DATABASE_URL;
  if (!productionDbUrl) {
    console.error('❌ Production DATABASE_URL not found');
    process.exit(1);
  }
  
  const sql = neon(productionDbUrl);
  const db = drizzle(sql);
  
  try {
    // Check if data already exists
    const existingVehicles = await db.select().from(vehicles);
    
    if (existingVehicles.length > 0) {
      console.log(`⚠️  Production database already has ${existingVehicles.length} vehicles`);
      console.log('Skipping migration to avoid duplicates');
      return;
    }
    
    // Insert development vehicles into production
    console.log(`📦 Migrating ${developmentVehicles.length} vehicles to production...`);
    
    for (const vehicle of developmentVehicles) {
      await db.insert(vehicles).values(vehicle);
      console.log(`✅ Migrated: ${vehicle.title}`);
    }
    
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this script is called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateToProduction();
}

export { migrateToProduction };