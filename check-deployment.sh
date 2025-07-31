#!/bin/bash

echo "🚗 T-Rex Motors Deployment Check"
echo "================================"
echo ""

echo "1. Checking development API..."
curl -s http://localhost:5000/api/vehicles | head -c 100
echo ""
echo ""

echo "2. Checking production deployment..."
curl -s https://trexmotors.replit.app/api/vehicles | head -c 100
echo ""
echo ""

echo "3. Testing production endpoint status..."
curl -s -o /dev/null -w "Status: %{http_code}\n" https://trexmotors.replit.app/api/vehicles
echo ""

echo "4. Checking database connection..."
npx tsx -e "
import { db } from './server/db.js';
import { vehicles } from './shared/schema.js';
const count = await db.select().from(vehicles);
console.log('Database vehicles:', count.length);
"