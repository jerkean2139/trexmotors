import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface VehicleData {
  status: string;
  stockNumber: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  miles: number;
  price: number;
  exteriorColor: string;
  interiorColor: string;
  description: string;
  notes: string;
}

export default function WebhookReceiver() {
  const [receivedData, setReceivedData] = useState<VehicleData | null>(null);
  const [processStatus, setProcessStatus] = useState<'waiting' | 'processing' | 'success' | 'error'>('waiting');
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();

  const webhookUrl = `${window.location.origin}/webhook-receiver`;

  useEffect(() => {
    // Check URL parameters for webhook data
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('status')) {
      const vehicleData: VehicleData = {
        status: urlParams.get('status') || 'for-sale',
        stockNumber: urlParams.get('stockNumber') || '',
        vin: urlParams.get('vin') || '',
        year: parseInt(urlParams.get('year') || '0'),
        make: urlParams.get('make') || '',
        model: urlParams.get('model') || '',
        miles: parseInt(urlParams.get('miles') || '0'),
        price: parseInt(urlParams.get('price') || '0'),
        exteriorColor: urlParams.get('exteriorColor') || '',
        interiorColor: urlParams.get('interiorColor') || '',
        description: urlParams.get('description') || '',
        notes: urlParams.get('notes') || ''
      };

      setReceivedData(vehicleData);
      processVehicleData(vehicleData);
    }
  }, []);

  const processVehicleData = async (vehicleData: VehicleData) => {
    setProcessStatus('processing');
    
    try {
      const insertVehicle = {
        slug: generateSlug(vehicleData.year, vehicleData.make, vehicleData.model, vehicleData.vin),
        title: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`,
        description: vehicleData.description,
        price: vehicleData.price,
        status: vehicleData.status,
        mileage: vehicleData.miles.toString(),
        year: vehicleData.year.toString(),
        make: vehicleData.make,
        model: vehicleData.model,
        vin: vehicleData.vin,
        stockNumber: vehicleData.stockNumber,
        engine: 'Not specified',
        transmission: 'Not specified',
        driveType: 'Not specified',
        exteriorColor: vehicleData.exteriorColor,
        interiorColor: vehicleData.interiorColor,
        images: [],
        keyFeatures: [],
        metaTitle: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model} - T-Rex Motors`,
        metaDescription: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model} with ${vehicleData.miles} miles.`,
        notes: vehicleData.notes
      };

      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(insertVehicle),
      });

      if (response.ok) {
        const vehicle = await response.json();
        setProcessStatus('success');
        toast({
          title: "Vehicle Added Successfully",
          description: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model} has been added to your inventory.`,
        });
      } else {
        throw new Error('Failed to create vehicle');
      }
    } catch (error) {
      setProcessStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      toast({
        title: "Error Adding Vehicle",
        description: "Failed to add vehicle to inventory.",
        variant: "destructive",
      });
    }
  };

  const generateSlug = (year: number, make: string, model: string, vin: string): string => {
    const baseSlug = `${year}-${make}-${model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const vinSuffix = vin.slice(-6).toLowerCase();
    return `${baseSlug}-${vinSuffix}`;
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast({
      title: "URL Copied",
      description: "Webhook URL copied to clipboard",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Google Sheets Webhook Receiver</h1>
        <p className="text-muted-foreground">
          This page receives vehicle data from your Google Apps Script and adds it to your T-Rex Motors inventory.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Webhook URL</CardTitle>
          <CardDescription>
            Use this URL in your Google Apps Script to send vehicle data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <code className="flex-1 p-2 bg-muted rounded font-mono text-sm">
              {webhookUrl}
            </code>
            <Button variant="outline" size="sm" onClick={copyWebhookUrl}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Status: 
            {processStatus === 'waiting' && <Badge variant="secondary">Waiting for data</Badge>}
            {processStatus === 'processing' && <Badge variant="default">Processing...</Badge>}
            {processStatus === 'success' && <Badge variant="default" className="bg-green-600"><CheckCircle className="h-4 w-4 mr-1" />Success</Badge>}
            {processStatus === 'error' && <Badge variant="destructive"><AlertCircle className="h-4 w-4 mr-1" />Error</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {processStatus === 'waiting' && (
            <p className="text-muted-foreground">
              Waiting for vehicle data from Google Apps Script...
            </p>
          )}

          {receivedData && (
            <div className="space-y-4">
              <h3 className="font-semibold">Received Vehicle Data:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Year:</strong> {receivedData.year}</div>
                <div><strong>Make:</strong> {receivedData.make}</div>
                <div><strong>Model:</strong> {receivedData.model}</div>
                <div><strong>VIN:</strong> {receivedData.vin}</div>
                <div><strong>Stock #:</strong> {receivedData.stockNumber}</div>
                <div><strong>Price:</strong> ${receivedData.price.toLocaleString()}</div>
                <div><strong>Miles:</strong> {receivedData.miles.toLocaleString()}</div>
                <div><strong>Status:</strong> {receivedData.status}</div>
                <div><strong>Exterior:</strong> {receivedData.exteriorColor}</div>
                <div><strong>Interior:</strong> {receivedData.interiorColor}</div>
              </div>
              {receivedData.description && (
                <div>
                  <strong>Description:</strong>
                  <p className="text-sm text-muted-foreground mt-1">{receivedData.description}</p>
                </div>
              )}
            </div>
          )}

          {processStatus === 'error' && (
            <div className="text-red-600 mt-4">
              <strong>Error:</strong> {errorMessage}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}