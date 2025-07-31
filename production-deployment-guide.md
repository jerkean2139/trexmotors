# T-Rex Motors Production Deployment Guide

## Database Deployment Strategy

### Step 1: Automatic Database Migration
Replit automatically handles database deployment when you click "Deploy". Your development database schema and data will be transferred to production.

**What happens automatically:**
- ✅ Database schema (tables, columns, relationships) is copied
- ✅ Environment variables (DATABASE_URL, PGHOST, etc.) are set
- ✅ Connection pooling is configured for production traffic

### Step 2: Data Seeding (If Needed)
If you need to manually seed data or if automatic migration doesn't transfer your vehicles:

```bash
# Run the production seeder
node production-data-seeder.js
```

This will safely add your 18 vehicles to the production database without duplicates.

### Step 3: Verify Deployment
After deployment, test these endpoints:
- `https://your-app.replit.app/api/vehicles` - Should return all vehicles
- `https://your-app.replit.app/admin` - Should show admin dashboard
- `https://your-app.replit.app/` - Should display customer homepage

### Step 4: Manual Upload Portal Access
Your admin portal will be available at:
`https://your-app.replit.app/admin`

**Features Available in Production:**
- ✅ Manual vehicle creation (desktop & mobile)
- ✅ Google Drive image integration  
- ✅ Vehicle editing and status management
- ✅ Image management with drag-and-drop reordering
- ✅ Mobile camera integration for auctions

## Environment Variables (Automatic)
Replit automatically provides these in production:
- `DATABASE_URL` - Complete connection string
- `PGHOST` - Database hostname  
- `PGUSER` - Database username
- `PGPASSWORD` - Database password
- `PGDATABASE` - Database name
- `PGPORT` - Database port

## Production Database Features
- **PostgreSQL 16** on Neon hosting
- **Automatic scaling** based on traffic
- **Connection pooling** for high performance
- **Backup and recovery** handled by Replit
- **SSL encryption** for secure connections

## Deployment Checklist
1. ✅ Click "Deploy" button in Replit
2. ✅ Wait for build to complete (uses build.sh)
3. ✅ Verify vehicle data appears on live site
4. ✅ Test admin portal functionality
5. ✅ Confirm mobile upload works
6. ✅ Check all API endpoints respond correctly

## Troubleshooting
If vehicles don't appear after deployment:
1. Check deployment logs for errors
2. Verify DATABASE_URL is set correctly
3. Run production seeder if needed
4. Contact Replit support if database didn't migrate

## Manual Data Transfer (Emergency Backup)
If automatic migration fails, you have:
- `production-data-seeder.js` - Adds 18 current vehicles
- `vehicle_backup.sql` - SQL backup of vehicle data
- Admin portal for manual re-entry

Your T-Rex Motors website is production-ready with full database and admin functionality!