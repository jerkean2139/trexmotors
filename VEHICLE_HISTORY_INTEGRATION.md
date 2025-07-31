# Vehicle History Report Integration

## Overview
T-Rex Motors now features comprehensive third-party vehicle history report integration, providing customers and staff with detailed vehicle background information from multiple trusted providers.

## Supported Providers
- **CARFAX** - Industry leader in vehicle history reports
- **AutoCheck** - Experian's vehicle history service
- **VIN Audit** - Cost-effective alternative reports
- **Vehicle History** - Comprehensive history database

## Features for Customers

### Vehicle Detail Pages
- **Unified History Button**: Single button to access all available reports
- **Report Summaries**: Quick overview of key metrics (accidents, owners, service records)
- **Interactive Dialogs**: Tabbed interface showing different provider reports
- **PDF Downloads**: Direct access to downloadable report PDFs
- **Real-time Updates**: Reports refresh automatically when new data is available

### Report Information Display
- Previous owners count
- Accident history summary
- Service records count
- Title status (Clean, Branded, Lemon, Flood, Salvage)
- Vehicle history score (1-100)
- Last report update date

## Features for T-Rex Motors Staff

### Admin Dashboard Integration
- **History Report Manager**: Complete report management for each vehicle
- **Auto-Fetch Reports**: One-click automatic report retrieval
- **Manual Report Entry**: Ability to manually add/edit report data
- **Provider Status**: Real-time check of which providers are available
- **Bulk Operations**: Process multiple vehicles at once

### Report Management Capabilities
- Upload CARFAX embed codes
- Add AutoCheck report URLs
- Edit vehicle history summaries
- Set title status and accident history
- Track service records and previous owners
- Monitor report expiration dates

## API Integration

### Automatic Report Fetching
The system can automatically fetch reports when:
- New vehicles are added to inventory
- VIN numbers are updated
- Staff requests fresh reports
- Scheduled maintenance runs (weekly)

### Provider Authentication
Each provider requires API credentials:
- CARFAX: API key from dealer portal
- AutoCheck: Experian dealer account
- VIN Audit: Service subscription
- Vehicle History: API access token

### Error Handling
- Graceful fallbacks when providers are unavailable
- Retry logic for temporary failures
- Clear error messages for staff
- Alternative provider suggestions

## Data Storage

### Database Fields
- `carfaxEmbedCode`: Complete CARFAX embed HTML
- `autoCheckUrl`: Direct link to AutoCheck report
- `vehicleHistoryScore`: Overall score (1-100)
- `accidentHistory`: Number of reported accidents
- `previousOwners`: Count of previous owners
- `serviceRecords`: Number of maintenance records
- `titleStatus`: clean/branded/lemon/flood/salvage/unknown
- `lastHistoryUpdate`: Timestamp of last report update

### Report Caching
- Reports cached for 30 days
- Automatic refresh for expired reports
- Manual refresh available anytime
- Provider-specific cache intervals

## Customer Benefits

### Trust and Transparency
- Full vehicle history disclosure
- Multiple provider verification
- Professional report presentation
- Easy-to-understand summaries

### Informed Purchasing
- Complete accident history
- Service maintenance records
- Previous ownership details
- Title and lien information

## Staff Workflow

### Adding New Vehicles
1. Enter basic vehicle information
2. Click "Auto-Fetch Reports" in admin panel
3. System retrieves available reports automatically
4. Review and verify report data
5. Publish vehicle with complete history

### Managing Existing Inventory
1. Access admin dashboard
2. Navigate to vehicle inventory
3. Click "Manage History Reports" for any vehicle
4. Update report information as needed
5. Set up automatic refresh schedules

### Customer Inquiries
1. Staff can instantly access any vehicle's complete history
2. Print or email reports to customers
3. Explain report findings in simple terms
4. Address any customer concerns about vehicle history

## Technical Implementation

### Frontend Components
- `VehicleHistoryReports`: Customer-facing report display
- `HistoryReportManager`: Admin interface for report management
- `CarFaxButton`: Legacy CARFAX integration (maintained for compatibility)

### Backend Services
- `vehicleHistoryService`: Core API integration service
- Provider-specific classes for each report service
- Automatic report fetching and caching
- Report status monitoring and updates

### API Endpoints
- `GET /api/vehicle-history/providers` - Check available providers
- `GET /api/vehicle-history/:vin` - Get report for specific VIN
- `POST /api/vehicle-history/:vin/request` - Request new report
- `POST /api/vehicles/:id/auto-populate-history` - Auto-fetch and populate

## Configuration

### Required Environment Variables
```
CARFAX_API_KEY=your_carfax_api_key
AUTOCHECK_API_KEY=your_autocheck_api_key
VINAUDIT_API_KEY=your_vinaudit_api_key
VEHICLE_HISTORY_API_KEY=your_vehicle_history_key
```

### Provider Setup
1. Contact each provider to establish dealer accounts
2. Obtain API credentials for automated access
3. Configure rate limits and usage quotas
4. Set up billing and payment methods

## Pricing Considerations

### Provider Costs
- CARFAX: $39.99 per report (dealer rates available)
- AutoCheck: $24.99 per report
- VIN Audit: $9.99 per report
- Vehicle History: $19.99 per report

### Cost Management
- Automatic provider selection based on cost
- Bulk pricing for high-volume dealers
- Monthly subscription options available
- Usage monitoring and budget alerts

## Compliance and Legal

### Data Privacy
- Customer consent for report sharing
- Secure storage of report data
- Regular data purging for expired reports
- GDPR and CCPA compliance measures

### Accuracy Disclaimers
- Clear statements about report limitations
- Recommendation for professional inspections
- Multiple provider verification suggestions
- "As-is" data presentation with source attribution

## Future Enhancements

### Planned Features
- Mobile app integration
- Real-time VIN scanning
- Automated report email delivery
- Advanced analytics and reporting
- Integration with finance applications

### Potential Providers
- AutoTrader history services
- Kelley Blue Book reports
- Edmunds vehicle history
- OEM manufacturer records

This integration provides T-Rex Motors with industry-leading vehicle history capabilities, enhancing customer trust and streamlining the sales process while maintaining complete transparency about vehicle backgrounds.