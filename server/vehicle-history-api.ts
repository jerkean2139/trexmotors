import axios from 'axios';

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
    try {
      if (!this.apiKey) return false;
      
      const response = await axios.get(`${this.apiUrl}/auth/validate`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      return response.status === 200;
    } catch (error) {
      console.error('CARFAX authentication failed:', error);
      return false;
    }
  }

  async getReport(vin: string): Promise<VehicleHistoryReport> {
    const response = await axios.get(`${this.apiUrl}/reports/${vin}`, {
      headers: { 'Authorization': `Bearer ${this.apiKey}` }
    });

    const data = response.data;
    
    return {
      provider: 'carfax',
      vin,
      reportId: data.reportId,
      reportUrl: data.reportUrl,
      embedCode: data.embedCode,
      summary: {
        titleStatus: this.mapTitleStatus(data.titleInfo?.status),
        previousOwners: data.ownershipSummary?.totalOwners || 0,
        accidentHistory: data.accidentSummary?.totalAccidents || 0,
        serviceRecords: data.serviceSummary?.totalRecords || 0,
        historyScore: data.scorecard?.overallScore || 0,
        lastReported: data.lastUpdated
      },
      details: {
        titleHistory: data.titleHistory || [],
        ownershipHistory: data.ownershipHistory || [],
        accidentRecords: data.accidentHistory || [],
        serviceHistory: data.serviceHistory || []
      },
      pricing: {
        reportCost: data.pricing?.cost || 39.99,
        currency: 'USD'
      },
      metadata: {
        reportDate: data.createdAt,
        expirationDate: data.expiresAt,
        confidence: data.confidence || 95
      }
    };
  }

  async requestReport(vin: string): Promise<string> {
    const response = await axios.post(`${this.apiUrl}/reports/request`, {
      vin,
      reportType: 'full'
    }, {
      headers: { 'Authorization': `Bearer ${this.apiKey}` }
    });

    return response.data.reportId;
  }

  async getReportStatus(reportId: string): Promise<'pending' | 'completed' | 'failed'> {
    const response = await axios.get(`${this.apiUrl}/reports/${reportId}/status`, {
      headers: { 'Authorization': `Bearer ${this.apiKey}` }
    });

    return response.data.status;
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
    try {
      if (!this.apiKey) return false;
      
      const response = await axios.get(`${this.apiUrl}/validate`, {
        headers: { 'X-API-Key': this.apiKey }
      });
      return response.status === 200;
    } catch (error) {
      console.error('AutoCheck authentication failed:', error);
      return false;
    }
  }

  async getReport(vin: string): Promise<VehicleHistoryReport> {
    const response = await axios.get(`${this.apiUrl}/vehicle/${vin}/history`, {
      headers: { 'X-API-Key': this.apiKey }
    });

    const data = response.data;
    
    return {
      provider: 'autocheck',
      vin,
      reportId: data.id,
      reportUrl: data.reportUrl,
      summary: {
        titleStatus: this.mapTitleStatus(data.title?.brand),
        previousOwners: data.ownership?.count || 0,
        accidentHistory: data.accidents?.count || 0,
        serviceRecords: data.maintenance?.count || 0,
        historyScore: data.autoCheckScore || 0,
        lastReported: data.lastUpdated
      },
      details: {
        titleHistory: data.titleEvents || [],
        ownershipHistory: data.ownershipEvents || [],
        accidentRecords: data.accidentEvents || [],
        serviceHistory: data.maintenanceEvents || []
      },
      pricing: {
        reportCost: 24.99,
        currency: 'USD'
      },
      metadata: {
        reportDate: data.generatedAt,
        expirationDate: data.expiresAt,
        confidence: data.confidenceScore || 90
      }
    };
  }

  async requestReport(vin: string): Promise<string> {
    const response = await axios.post(`${this.apiUrl}/reports`, {
      vin,
      productType: 'full_history'
    }, {
      headers: { 'X-API-Key': this.apiKey }
    });

    return response.data.reportId;
  }

  async getReportStatus(reportId: string): Promise<'pending' | 'completed' | 'failed'> {
    const response = await axios.get(`${this.apiUrl}/reports/${reportId}`, {
      headers: { 'X-API-Key': this.apiKey }
    });

    return response.data.status;
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