# CarFax Integration Documentation

## Overview
The T-Rex Motors website now supports CarFax report embed codes for each vehicle listing. CarFax buttons are displayed on both vehicle cards and detailed vehicle pages.

## Adding CarFax Embed Codes

### Via API Endpoint
You can add CarFax embed codes to vehicles using the PATCH endpoint:

```bash
curl -X PATCH http://localhost:5000/api/vehicles/{vehicle_id}/carfax \
  -H "Content-Type: application/json" \
  -d '{"carfaxEmbedCode": "<script>...</script>"}'
```

### Example Usage
```bash
# Add CarFax embed code to vehicle with ID 1
curl -X PATCH http://localhost:5000/api/vehicles/1/carfax \
  -H "Content-Type: application/json" \
  -d '{"carfaxEmbedCode": "<div id=\"carfax-report\"><script src=\"https://www.carfax.com/embed/report.js\"></script></div>"}'
```

## Database Schema
The `vehicles` table includes a `carfax_embed_code` column:
- Type: TEXT (nullable)
- Purpose: Stores HTML/JavaScript embed code provided by CarFax

## Frontend Integration

### CarFax Button Behavior
- **With embed code**: Executes the CarFax embed code to display the report
- **Without embed code**: Opens CarFax.com in a new tab as fallback

### Button Locations
1. **Vehicle Cards**: Appears next to "View Details" button
2. **Vehicle Detail Page**: Prominently displayed below contact buttons

## Technical Implementation

### Components
- `CarFaxButton`: Reusable component handling embed code execution
- Integrated into `VehicleCard` and `VehicleDetail` components

### API Endpoints
- `PATCH /api/vehicles/:id/carfax`: Update CarFax embed code for a vehicle
- Existing vehicle endpoints now return the `carfaxEmbedCode` field

## Notes for Backend Integration
- Embed codes should be provided by CarFax for each specific vehicle
- The system safely executes the embed code when users click the CarFax button
- All vehicles display the CarFax button regardless of embed code availability