import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scan, FolderOpen, Image, Check, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DriveFolderScannerProps {
  onImagesMatched?: (matches: any[]) => void;
}

export default function DriveFolderScanner({ onImagesMatched }: DriveFolderScannerProps) {
  const [folderUrl, setFolderUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any | null>(null);

  const scanDriveFolder = async () => {
    if (!folderUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter your Google Drive folder URL",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    
    try {
      const response = await fetch('/api/admin/scan-drive-folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ folderUrl: folderUrl.trim() })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Scan failed');
      }

      const results = await response.json();
      setScanResults(results);
      
      if (results.matchedVehicles > 0) {
        toast({
          title: "Scan Complete!",
          description: `Found ${results.matchedVehicles} vehicle folders with images from ${results.totalFolders} total folders`
        });
        
        if (onImagesMatched) {
          onImagesMatched(results.matches);
        }
      } else {
        toast({
          title: "No Matches Found",
          description: `Scanned ${results.totalFolders} folders but couldn't match any to your vehicles. Check folder names.`,
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('Drive scan error:', error);
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : "Failed to scan Drive folder",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Google Drive Folder Scanner
          </CardTitle>
          <CardDescription>
            Automatically match vehicle photos from your Google Drive folder to your inventory
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="folder-url">Google Drive Folder URL</Label>
            <Input
              id="folder-url"
              placeholder="https://drive.google.com/drive/folders/1ABC123..."
              value={folderUrl}
              onChange={(e) => setFolderUrl(e.target.value)}
              disabled={isScanning}
            />
            <p className="text-sm text-gray-600">
              Make sure your folder is set to "Anyone with the link can view"
            </p>
          </div>
          
          <Button 
            onClick={scanDriveFolder} 
            disabled={isScanning || !folderUrl.trim()}
            className="w-full"
          >
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning Folders...
              </>
            ) : (
              <>
                <Scan className="mr-2 h-4 w-4" />
                Scan Drive Folder
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {scanResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Scan Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{scanResults.totalFolders}</div>
                <div className="text-sm text-gray-600">Total Folders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{scanResults.matchedVehicles}</div>
                <div className="text-sm text-gray-600">Vehicles Matched</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {scanResults.matches?.reduce((total: number, match: any) => total + match.imageCount, 0) || 0}
                </div>
                <div className="text-sm text-gray-600">Total Images</div>
              </div>
            </div>

            {scanResults.matches && scanResults.matches.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold">Matched Vehicles:</h4>
                <div className="space-y-3">
                  {scanResults.matches.map((match: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Image className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="font-medium">
                            {match.vehicle.year} {match.vehicle.make} {match.vehicle.model}
                          </div>
                          <div className="text-sm text-gray-600">
                            Folder: "{match.folder}" • Stock: {match.vehicle.stockNumber}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {match.imageCount} images
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {scanResults.matchedVehicles === 0 && (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">No Vehicle Matches Found</h4>
                <p className="text-gray-600 mb-4">
                  The folder names don't match our vehicle inventory. Try these naming patterns:
                </p>
                <div className="text-left bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-700">
                    <strong>Examples:</strong><br />
                    • "2020 Dodge Charger White"<br />
                    • "Stock 1021" or "1021"<br />
                    • "Honda Civic 2018 White"<br />
                    • "2015 Toyota Corolla"
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}