import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Shield, Plus, Edit, ExternalLink, Upload, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Vehicle {
  id: number;
  title: string;
  vin: string;
  carfaxEmbedCode?: string | null;
  autoCheckUrl?: string | null;
  vehicleHistoryScore?: number | null;
  accidentHistory?: number;
  previousOwners?: number;
  serviceRecords?: number;
  titleStatus?: string;
  lastHistoryUpdate?: string | null;
}

interface HistoryReportManagerProps {
  vehicle: Vehicle;
  onUpdate?: () => void;
}

export default function HistoryReportManager({ vehicle, onUpdate }: HistoryReportManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("carfax");
  const [formData, setFormData] = useState({
    carfaxEmbedCode: vehicle.carfaxEmbedCode || "",
    autoCheckUrl: vehicle.autoCheckUrl || "",
    vehicleHistoryScore: vehicle.vehicleHistoryScore || "",
    accidentHistory: vehicle.accidentHistory || 0,
    previousOwners: vehicle.previousOwners || 0,
    serviceRecords: vehicle.serviceRecords || 0,
    titleStatus: vehicle.titleStatus || "unknown"
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get available providers
  const { data: providersData } = useQuery({
    queryKey: ["/api/vehicle-history/providers"],
    queryFn: async () => {
      const response = await fetch("/api/vehicle-history/providers");
      if (!response.ok) throw new Error("Failed to fetch providers");
      return response.json();
    }
  });

  // Auto-populate history data
  const autoPopulateMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/vehicles/${vehicle.id}/auto-populate-history`, {
        method: "POST"
      });
      if (!response.ok) throw new Error("Failed to auto-populate history");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "History Auto-Populated",
        description: `Vehicle history data has been automatically populated from ${data.report.provider.toUpperCase()}.`
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      setIsDialogOpen(false);
      onUpdate?.();
    },
    onError: () => {
      toast({
        title: "Auto-Population Failed",
        description: "No vehicle history reports found for this VIN.",
        variant: "destructive"
      });
    }
  });

  const updateHistoryReportMutation = useMutation({
    mutationFn: async (updates: any) => {
      const response = await fetch(`/api/vehicles/${vehicle.id}/history-reports`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updates,
          lastHistoryUpdate: new Date().toISOString()
        })
      });
      if (!response.ok) throw new Error("Failed to update history reports");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "History Reports Updated",
        description: "Vehicle history reports have been updated successfully."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      setIsDialogOpen(false);
      onUpdate?.();
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update vehicle history reports.",
        variant: "destructive"
      });
    }
  });

  const handleSave = () => {
    updateHistoryReportMutation.mutate({
      carfaxEmbedCode: formData.carfaxEmbedCode || null,
      autoCheckUrl: formData.autoCheckUrl || null,
      vehicleHistoryScore: formData.vehicleHistoryScore ? parseInt(formData.vehicleHistoryScore.toString()) : null,
      accidentHistory: parseInt(formData.accidentHistory.toString()),
      previousOwners: parseInt(formData.previousOwners.toString()),
      serviceRecords: parseInt(formData.serviceRecords.toString()),
      titleStatus: formData.titleStatus
    });
  };

  const getTitleStatusColor = (status: string) => {
    switch (status) {
      case 'clean': return 'bg-green-100 text-green-800 border-green-200';
      case 'branded': return 'bg-red-100 text-red-800 border-red-200';
      case 'lemon': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'flood': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'salvage': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const hasAnyReport = vehicle.carfaxEmbedCode || vehicle.autoCheckUrl;
  const historyScore = vehicle.vehicleHistoryScore;

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Shield className="w-4 h-4 mr-2" />
            Manage History Reports
            {hasAnyReport && (
              <Badge variant="secondary" className="ml-2">
                {[vehicle.carfaxEmbedCode, vehicle.autoCheckUrl].filter(Boolean).length}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Vehicle History Report Management
            </DialogTitle>
            <DialogDescription>
              {vehicle.title} • VIN: {vehicle.vin}
            </DialogDescription>
          </DialogHeader>

          {/* Current Status Overview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Current Report Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {historyScore || '--'}
                  </div>
                  <div className="text-sm text-gray-600">History Score</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {vehicle.accidentHistory || 0}
                  </div>
                  <div className="text-sm text-gray-600">Accidents</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {vehicle.previousOwners || 0}
                  </div>
                  <div className="text-sm text-gray-600">Owners</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Badge className={getTitleStatusColor(vehicle.titleStatus || 'unknown')}>
                    {vehicle.titleStatus?.replace('-', ' ') || 'Unknown'}
                  </Badge>
                  <div className="text-sm text-gray-600 mt-1">Title Status</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="carfax" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                CARFAX
              </TabsTrigger>
              <TabsTrigger value="autocheck" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                AutoCheck
              </TabsTrigger>
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Summary Data
              </TabsTrigger>
            </TabsList>

            <TabsContent value="carfax" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>CARFAX Report Management</CardTitle>
                  <CardDescription>
                    Manage CARFAX embed codes and report links
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="carfax-embed">CARFAX Embed Code</Label>
                    <Textarea
                      id="carfax-embed"
                      value={formData.carfaxEmbedCode}
                      onChange={(e) => setFormData({...formData, carfaxEmbedCode: e.target.value})}
                      placeholder="Paste CARFAX embed code here..."
                      rows={6}
                    />
                    <p className="text-sm text-gray-600">
                      Paste the complete CARFAX embed code including script tags
                    </p>
                  </div>
                  
                  {vehicle.carfaxEmbedCode && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Test Report
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="autocheck" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>AutoCheck Report Management</CardTitle>
                  <CardDescription>
                    Manage AutoCheck report URLs and links
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="autocheck-url">AutoCheck Report URL</Label>
                    <Input
                      id="autocheck-url"
                      type="url"
                      value={formData.autoCheckUrl}
                      onChange={(e) => setFormData({...formData, autoCheckUrl: e.target.value})}
                      placeholder="https://www.autocheck.com/vehiclehistory/..."
                    />
                    <p className="text-sm text-gray-600">
                      Enter the direct link to the AutoCheck report
                    </p>
                  </div>
                  
                  {vehicle.autoCheckUrl && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Report
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload PDF
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="summary" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle History Summary</CardTitle>
                  <CardDescription>
                    Update summary information from history reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="history-score">History Score (1-100)</Label>
                      <Input
                        id="history-score"
                        type="number"
                        min="1"
                        max="100"
                        value={formData.vehicleHistoryScore}
                        onChange={(e) => setFormData({...formData, vehicleHistoryScore: e.target.value})}
                        placeholder="85"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="title-status">Title Status</Label>
                      <Select 
                        value={formData.titleStatus} 
                        onValueChange={(value) => setFormData({...formData, titleStatus: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clean">Clean Title</SelectItem>
                          <SelectItem value="branded">Branded Title</SelectItem>
                          <SelectItem value="lemon">Lemon Title</SelectItem>
                          <SelectItem value="flood">Flood Damage</SelectItem>
                          <SelectItem value="salvage">Salvage Title</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="accidents">Reported Accidents</Label>
                      <Input
                        id="accidents"
                        type="number"
                        min="0"
                        value={formData.accidentHistory}
                        onChange={(e) => setFormData({...formData, accidentHistory: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="owners">Previous Owners</Label>
                      <Input
                        id="owners"
                        type="number"
                        min="0"
                        value={formData.previousOwners}
                        onChange={(e) => setFormData({...formData, previousOwners: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="service-records">Service Records</Label>
                      <Input
                        id="service-records"
                        type="number"
                        min="0"
                        value={formData.serviceRecords}
                        onChange={(e) => setFormData({...formData, serviceRecords: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between items-center pt-4 border-t">
            <Button 
              variant="outline"
              onClick={() => autoPopulateMutation.mutate()}
              disabled={autoPopulateMutation.isPending}
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              {autoPopulateMutation.isPending ? "Fetching..." : "Auto-Fetch Reports"}
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={updateHistoryReportMutation.isPending}
              >
                {updateHistoryReportMutation.isPending ? "Saving..." : "Save Reports"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}