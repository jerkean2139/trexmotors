# T-Rex Motors Production Migration Guide

## Current Situation
Your development database has **18 vehicles** that need to be transferred to production. Replit deployments create separate production databases that start empty.

## Solution: Manual Production Migration

### Step 1: Deploy Your Application
1. Click **"Deploy"** in Replit
2. Choose **"Reserved VM"** 
3. Your production site will be live with an empty database

### Step 2: Add Vehicles to Production
Once deployed, you have two options:

#### Option A: Use Production Admin Panel (Recommended)
1. Go to your production URL `/admin`
2. Login with password: `admin`
3. Use "Add Vehicle" to manually add your 18 vehicles
4. Copy the vehicle details from the migration script

#### Option B: Run Migration Script
1. Upload the `migrate-to-production.js` script to your deployment
2. Run it once in production to populate the database

### Step 3: Verify Production Data
1. Check that all 18 vehicles appear on your production homepage
2. Verify admin panel displays all vehicles correctly
3. Test customer vehicle browsing functionality

## Your 18 Vehicles Ready for Migration:
- 2014 Chevrolet Cruze - $9,999
- 2015 BUICK ENCLAVE - $14,999  
- 2019 CHEVROLET TRAVERSE - $19,999
- 2013 Ford Flex SEL - $8,481
- 2020 Dodge Charger - $17,999
- 2014 Jeep Grand Cherokee - $12,999
- 2018 Honda Civic - $17,999
- 2015 Toyota Corolla - $13,999
- 2018 Chevrolet Silverado LT - $19,999
- 2016 Ford Focus - $8,999
- 2020 Chevrolet Malibu - $19,999
- 2019 Dodge Journey - $13,499
- 2014 JEEP WRANGLER SAHARA UNLIMITED - $16,999
- 2019 HYUNDAI SANTA FE - $13,999
- 2020 KIA FORTE - $17,999
- 2011 CHEVROLET IMPALA - $4,999
- 2016 BUICK ENCORE - $10,999
- 2018 SUBARU CROSSTREK - $18,999

**Total Inventory Value: $264,481**

## Post-Deployment Checklist
- [ ] Production site loads correctly
- [ ] Admin login works with password "admin"
- [ ] All 18 vehicles added to production database
- [ ] Vehicle images display properly  
- [ ] Customer vehicle browsing functions
- [ ] Contact forms working
- [ ] Mobile responsiveness confirmed