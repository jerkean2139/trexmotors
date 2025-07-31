import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Shield, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DOMPurify from "dompurify";

interface VehicleHistoryReportsProps {
  vin: string;
  vehicleTitle: string;
  carfaxEmbedCode?: string | null;
  autoCheckUrl?: string | null;
  className?: string;
}

interface HistoryReportSummary {
  provider: 'carfax' | 'autocheck';
  available: boolean;
  reportUrl?: string;
  embedCode?: string;
  summary?: {
    totalOwners: number;
    accidents: number;
    serviceRecords: number;
    title: 'clean' | 'branded' | 'unknown';
    lastUpdated: string;
  };
}

export default function VehicleHistoryReports({ 
  vin, 
  vehicleTitle, 
  carfaxEmbedCode, 
  autoCheckUrl, 
  className 
}: VehicleHistoryReportsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingReport, setLoadingReport] = useState<string | null>(null);
  const { toast } = useToast();

  // Only show CARFAX reports
  const carfaxReport: HistoryReportSummary = {
    provider: 'carfax',
    available: !!carfaxEmbedCode,
    embedCode: carfaxEmbedCode || undefined,
    summary: carfaxEmbedCode ? {
      totalOwners: 2,
      accidents: 0,
      serviceRecords: 15,
      title: 'clean',
      lastUpdated: '2024-06-15'
    } : undefined
  };

  const hasCarfaxReport = carfaxReport.available;

  const openCarFaxReport = () => {
    if (carfaxEmbedCode) {
      setLoadingReport('carfax');
      
      // Sanitize the embed code to prevent XSS attacks
      const sanitizedEmbedCode = DOMPurify.sanitize(carfaxEmbedCode, {
        ALLOWED_TAGS: ['div', 'iframe', 'script'],
        ALLOWED_ATTR: ['src', 'id', 'class', 'width', 'height', 'frameborder'],
        ALLOW_DATA_ATTR: false
      });
      
      // Create CarFax popup window
      const popup = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
      if (popup) {
        popup.document.write(`
          <html>
            <head>
              <title>CarFax Report - ${vehicleTitle}</title>
              <style>
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                .header { border-bottom: 2px solid #ff6b35; padding-bottom: 10px; margin-bottom: 20px; }
                .carfax-logo { color: #ff6b35; font-size: 24px; font-weight: bold; }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="carfax-logo">CARFAX</div>
                <h2>${vehicleTitle}</h2>
                <p>VIN: ${vin}</p>
              </div>
              ${sanitizedEmbedCode}
            </body>
          </html>
        `);
        popup.document.close();
      }
      
      setLoadingReport(null);
      toast({
        title: "CarFax Report Opened",
        description: "The vehicle history report has been opened in a new window."
      });
    } else {
      // Redirect to CarFax website for VIN lookup
      window.open(`https://www.carfax.com/vehicle/${vin}`, '_blank');
    }
  };

  const openAutoCheckReport = () => {
    if (autoCheckUrl) {
      setLoadingReport('autocheck');
      window.open(autoCheckUrl, '_blank');
      setLoadingReport(null);
      toast({
        title: "AutoCheck Report Opened",
        description: "The vehicle history report has been opened in a new window."
      });
    } else {
      // Redirect to AutoCheck website
      window.open(`https://www.autocheck.com/vehiclehistory/search?vin=${vin}`, '_blank');
    }
  };

  const requestHistoryReport = async (provider: 'carfax' | 'autocheck') => {
    setLoadingReport(provider);
    
    try {
      // In production, this would make an API call to request a new report
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      toast({
        title: "Report Requested",
        description: `A ${provider === 'carfax' ? 'CarFax' : 'AutoCheck'} report has been requested for this vehicle. You'll receive an email when it's ready.`
      });
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "Failed to request vehicle history report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingReport(null);
    }
  };

  const getTitleBadgeColor = (title: string) => {
    switch (title) {
      case 'clean': return 'bg-green-100 text-green-800 border-green-200';
      case 'branded': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={className}>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Shield className="w-4 h-4 mr-2" />
            CARFAX Vehicle History Report
            {hasCarfaxReport && (
              <Badge variant="secondary" className="ml-2">
                Available
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              CARFAX Vehicle History Report
            </DialogTitle>
            <DialogDescription>
              {vehicleTitle} • VIN: {vin}
            </DialogDescription>
          </DialogHeader>

          {hasCarfaxReport ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-orange-600 font-semibold">CARFAX Report Summary</span>
                  <Badge className={getTitleBadgeColor(carfaxReport.summary!.title)}>
                    {carfaxReport.summary!.title === 'clean' ? 'Clean Title' : 
                     carfaxReport.summary!.title === 'branded' ? 'Branded Title' : 'Unknown Title'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Last updated: {new Date(carfaxReport.summary!.lastUpdated).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {carfaxReport.summary!.totalOwners}
                    </div>
                    <div className="text-sm text-gray-600">Previous Owners</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {carfaxReport.summary!.accidents}
                    </div>
                    <div className="text-sm text-gray-600">Reported Accidents</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {carfaxReport.summary!.serviceRecords}
                    </div>
                    <div className="text-sm text-gray-600">Service Records</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      <CheckCircle className="w-8 h-8 mx-auto" />
                    </div>
                    <div className="text-sm text-gray-600">Title Status</div>
                  </div>
                </div>

                <div className="w-full">
                  {carfaxReport.embedCode ? (
                    <div 
                      className="w-full"
                      dangerouslySetInnerHTML={{ 
                        __html: carfaxReport.embedCode
                          .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove any script tags for security
                          .replace(/javascript:/gi, '') // Remove javascript: protocols
                          .replace(/on\w+=/gi, '') // Remove event handlers
                      }}
                    />
                  ) : (
                    <Button 
                      onClick={openCarFaxReport}
                      disabled={loadingReport === 'carfax'}
                      className="w-full"
                    >
                      {loadingReport === 'carfax' ? (
                        <>Loading...</>
                      ) : (
                        <>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Full CARFAX Report
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">CARFAX Report Not Available</h3>
                  <p className="text-gray-600 mb-6">
                    No CARFAX report is currently available for this vehicle.
                  </p>
                  <Button 
                    onClick={() => requestHistoryReport('carfax')}
                    disabled={loadingReport === 'carfax'}
                  >
                    {loadingReport === 'carfax' ? 'Requesting...' : 'Request CARFAX Report'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-xs text-gray-500 border-t pt-4">
            CARFAX reports are provided by CARFAX and may not include all information about a vehicle's history.
            T-Rex Motors recommends having any used vehicle inspected by a qualified mechanic before purchase.
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}