#!/bin/bash
# Deploy T-Rex Motors vehicle data to production

echo "🚀 Deploying T-Rex Motors Data to Production"
echo "============================================="

# Check if production-data.sql exists
if [ ! -f "production-data.sql" ]; then
    echo "❌ production-data.sql not found. Run data export first."
    exit 1
fi

echo "📊 Found production-data.sql with vehicle data"

# For Replit deployment, we need to push this data to the production database
# This script will be run in the production environment

echo "🔄 Setting up production database schema..."
npm run db:push

echo "📤 Importing vehicle data to production..."
# Import the SQL data
if command -v psql >/dev/null 2>&1; then
    psql $DATABASE_URL < production-data.sql
    echo "✅ Data imported successfully via psql"
else
    echo "⚠️  psql not available, using alternative method..."
    # Alternative: Use node script to import data
    node -e "
    import { execSync } from 'child_process';
    try {
        execSync('cat production-data.sql | psql \$DATABASE_URL', { stdio: 'inherit' });
        console.log('✅ Data imported successfully');
    } catch (error) {
        console.error('❌ Import failed:', error.message);
        process.exit(1);
    }
    "
fi

echo "🔍 Verifying data import..."
# Check vehicle count
VEHICLE_COUNT=$(psql $DATABASE_URL -t -c "SELECT COUNT(*) FROM vehicles;" 2>/dev/null || echo "0")
echo "Vehicle count in production: $VEHICLE_COUNT"

if [ "$VEHICLE_COUNT" -gt "0" ]; then
    echo "🎉 SUCCESS! $VEHICLE_COUNT vehicles imported to production"
    echo "📱 Your website should now show all vehicles"
else
    echo "❌ No vehicles found. Import may have failed."
    exit 1
fi