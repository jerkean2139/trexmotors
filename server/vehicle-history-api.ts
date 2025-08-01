// Temporarily removed axios import to fix startup issue
// import axios from 'axios';

interface VehicleHistoryReport {
  provider: 'carfax' | 'autocheck' | 'vinaudit' | 'vehiclehistory';
  vin: string;
  reportId?: string;
  reportUrl?: string;
  embedCode?: string;
  summary: {
    titleStatus: 'clean' | 'branded' | 'lemon' | 'flood' | 'salvage' | 'unknown';
    previousOwners: number;
    accidentHistory: number;
    serviceRecords: number;
    historyScore: number; // 1-100
    lastReported: string;
  };
  details: {
    titleHistory: Array<{
      date: string;
      type: string;
      state: string;
      description: string;
    }>;
    ownershipHistory: Array<{
      startDate: string;
      endDate?: string;
      ownerType: 'individual' | 'fleet' | 'rental' | 'lease';
      state: string;
    }>;
    accidentRecords: Array<{
      date: string;
      severity: 'minor' | 'moderate' | 'severe';
      description: string;
      damageAreas: string[];
    }>;
    serviceHistory: Array<{
      date: string;
      mileage: number;
      serviceType: string;
      description: string;
      location: string;
    }>;
  };
  pricing: {
    reportCost: number;
    currency: 'USD';
  };
  metadata: {
    reportDate: string;
    expirationDate: string;
    confidence: number; // 1-100
  };
}

interface HistoryProvider {
  name: string;
  apiUrl: string;
  apiKey?: string;
  authenticate(): Promise<boolean>;
  getReport(vin: string): Promise<VehicleHistoryReport>;
  getReportStatus(reportId: string): Promise<'pending' | 'completed' | 'failed'>;
  requestReport(vin: string): Promise<string>; // Returns report ID
}

class CarfaxProvider implements HistoryProvider {
  name = 'CARFAX';
  apiUrl = 'https://api.carfax.com/v1';
  apiKey = process.env.CARFAX_API_KEY;

  async authenticate(): Promise<boolean> {
    // Temporarily disabled due to axios dependency issue
    console.log('CARFAX authentication temporarily disabled');
    return false;
  }

  async getReport(vin: string): Promise<VehicleHistoryReport> {
    // Temporarily return mock data due to axios dependency issue
    console.log('CARFAX getReport temporarily returning mock data for VIN:', vin);
    return {
      provider: 'carfax',
      vin,
      reportId: 'mock-report-id',
      reportUrl: 'https://carfax.com/report/mock',
      embedCode: '<div>Mock CARFAX Report</div>',
      summary: {
        titleStatus: 'clean',
        previousOwners: 1,
        accidentHistory: 0,
        serviceRecords: 5,
        historyScore: 85,
        lastReported: new Date().toISOString()
      },
      details: {
        titleHistory: [],
        ownershipHistory: [],
        accidentRecords: [],
        serviceHistory: []
      },
      pricing: {
        reportCost: 39.99,
        currency: 'USD'
      },
      metadata: {
        reportDate: new Date().toISOString(),
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        confidence: 95
      }
    };
  }

  async requestReport(vin: string): Promise<string> {
    // Temporarily return mock report ID due to axios dependency issue
    console.log('CARFAX requestReport temporarily returning mock ID for VIN:', vin);
    return 'mock-report-' + Date.now();
  }

  async getReportStatus(reportId: string): Promise<'pending' | 'completed' | 'failed'> {
    // Temporarily return completed status due to axios dependency issue
    console.log('CARFAX getReportStatus temporarily returning completed for:', reportId);
    return 'completed';
  }

  private mapTitleStatus(status: string): 'clean' | 'branded' | 'lemon' | 'flood' | 'salvage' | 'unknown' {
    switch (status?.toLowerCase()) {
      case 'clean': return 'clean';
      case 'branded': case 'rebuilt': case 'reconstructed': return 'branded';
      case 'lemon': return 'lemon';
      case 'flood': case 'water damage': return 'flood';
      case 'salvage': case 'total loss': return 'salvage';
      default: return 'unknown';
    }
  }
}

class AutoCheckProvider implements HistoryProvider {
  name = 'AutoCheck';
  apiUrl = 'https://api.autocheck.com/v2';
  apiKey = process.env.AUTOCHECK_API_KEY;

  async authenticate(): Promise<boolean> {
    // Temporarily disabled due to axios dependency issue
    console.log('AutoCheck authentication temporarily disabled');
    return false;
  }

  async getReport(vin: string): Promise<VehicleHistoryReport> {
    // Mock data for AutoCheck reports due to axios dependency issue
    console.log('AutoCheck getReport temporarily returning mock data for VIN:', vin);
    return {
      provider: 'autocheck',
      vin,
      reportId: 'mock-autocheck-' + Date.now(),
      reportUrl: 'https://autocheck.com/report/mock',
      summary: {
        titleStatus: 'clean',
        previousOwners: 1,
        accidentHistory: 0,
        serviceRecords: 3,
        historyScore: 82,
        lastReported: new Date().toISOString()
      },
      details: {
        titleHistory: [],
        ownershipHistory: [],
        accidentRecords: [],
        serviceHistory: []
      },
      pricing: {
        reportCost: 24.99,
        currency: 'USD'
      },
      metadata: {
        reportDate: new Date().toISOString(),
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        confidence: 90
      }
    };
  }

  async requestReport(vin: string): Promise<string> {
    // Mock report request due to axios dependency issue
    console.log('AutoCheck requestReport temporarily returning mock ID for VIN:', vin);
    return 'mock-autocheck-' + Date.now();
  }

  async getReportStatus(reportId: string): Promise<'pending' | 'completed' | 'failed'> {
    // Mock status check due to axios dependency issue
    console.log('AutoCheck getReportStatus temporarily returning completed for:', reportId);
    return 'completed';
  }

  private mapTitleStatus(brand: string): 'clean' | 'branded' | 'lemon' | 'flood' | 'salvage' | 'unknown' {
    switch (brand?.toLowerCase()) {
      case 'clear': case 'clean': return 'clean';
      case 'branded': case 'manufacturer buyback': return 'branded';
      case 'lemon law buyback': return 'lemon';
      case 'flood damage': case 'water damage': return 'flood';
      case 'salvage': case 'junk': return 'salvage';
      default: return 'unknown';
    }
  }
}

class VehicleHistoryService {
  private providers: HistoryProvider[] = [];

  constructor() {
    this.providers = [
      new CarfaxProvider(),
      new AutoCheckProvider()
    ];
  }

  async getAvailableProviders(): Promise<string[]> {
    const available = [];
    for (const provider of this.providers) {
      const isAuthenticated = await provider.authenticate();
      if (isAuthenticated) {
        available.push(provider.name);
      }
    }
    return available;
  }

  async getReport(vin: string, preferredProvider?: string): Promise<VehicleHistoryReport | null> {
    // Try preferred provider first
    if (preferredProvider) {
      const provider = this.providers.find(p => p.name.toLowerCase() === preferredProvider.toLowerCase());
      if (provider && await provider.authenticate()) {
        try {
          return await provider.getReport(vin);
        } catch (error) {
          console.error(`Failed to get report from ${provider.name}:`, error);
        }
      }
    }

    // Try all available providers
    for (const provider of this.providers) {
      if (await provider.authenticate()) {
        try {
          return await provider.getReport(vin);
        } catch (error) {
          console.error(`Failed to get report from ${provider.name}:`, error);
          continue;
        }
      }
    }

    return null;
  }

  async requestReport(vin: string, provider: string): Promise<string | null> {
    const historyProvider = this.providers.find(p => p.name.toLowerCase() === provider.toLowerCase());
    
    if (!historyProvider || !await historyProvider.authenticate()) {
      return null;
    }

    try {
      return await historyProvider.requestReport(vin);
    } catch (error) {
      console.error(`Failed to request report from ${provider}:`, error);
      return null;
    }
  }

  async getReportStatus(reportId: string, provider: string): Promise<'pending' | 'completed' | 'failed' | null> {
    const historyProvider = this.providers.find(p => p.name.toLowerCase() === provider.toLowerCase());
    
    if (!historyProvider || !await historyProvider.authenticate()) {
      return null;
    }

    try {
      return await historyProvider.getReportStatus(reportId);
    } catch (error) {
      console.error(`Failed to get report status from ${provider}:`, error);
      return null;
    }
  }

  async getBestReport(vin: string): Promise<VehicleHistoryReport | null> {
    const reports: VehicleHistoryReport[] = [];

    // Get reports from all available providers
    for (const provider of this.providers) {
      if (await provider.authenticate()) {
        try {
          const report = await provider.getReport(vin);
          reports.push(report);
        } catch (error) {
          console.error(`Failed to get report from ${provider.name}:`, error);
        }
      }
    }

    if (reports.length === 0) return null;

    // Return the report with the highest confidence score
    return reports.reduce((best, current) => 
      current.metadata.confidence > best.metadata.confidence ? current : best
    );
  }

  formatReportSummary(report: VehicleHistoryReport): string {
    return `${report.provider.toUpperCase()} Report Summary:
• Title Status: ${report.summary.titleStatus.replace('-', ' ').toUpperCase()}
• Previous Owners: ${report.summary.previousOwners}
• Reported Accidents: ${report.summary.accidentHistory}
• Service Records: ${report.summary.serviceRecords}
• History Score: ${report.summary.historyScore}/100
• Confidence: ${report.metadata.confidence}%
• Last Updated: ${new Date(report.summary.lastReported).toLocaleDateString()}`;
  }
}

export const vehicleHistoryService = new VehicleHistoryService();
export type { VehicleHistoryReport, HistoryProvider };