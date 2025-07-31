import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  Database, 
  FolderOpen, 
  FileSpreadsheet,
  Server,
  Globe
} from "lucide-react";

interface SystemStatus {
  database: {
    connected: boolean;
    latency?: number;
    error?: string;
  };
  googleSheets: {
    connected: boolean;
    authenticated: boolean;
    sheetsFound?: number;
    error?: string;
  };
  googleDrive: {
    connected: boolean;
    authenticated: boolean;
    foldersFound?: number;
    error?: string;
  };
  server: {
    status: 'healthy' | 'warning' | 'error';
    uptime?: string;
    memory?: number;
  };
}

export default function SystemStatus() {
  const [isExpanded, setIsExpanded] = useState(false);
  const queryClient = useQueryClient();

  // Fetch system status
  const { data: status, isLoading, error } = useQuery({
    queryKey: ['/api/admin/system-status'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Test connections manually
  const testConnectionsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/test-connections', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to test connections');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/system-status'] });
    }
  });

  const getStatusIcon = (connected: boolean, error?: string) => {
    if (error) return <XCircle className="h-5 w-5 text-red-500" />;
    if (connected) return <CheckCircle className="h-5 w-5 text-green-500" />;
    return <AlertCircle className="h-5 w-5 text-yellow-500" />;
  };

  const getStatusBadge = (connected: boolean, error?: string) => {
    if (error) return <Badge variant="destructive">Error</Badge>;
    if (connected) return <Badge className="bg-green-500">Connected</Badge>;
    return <Badge variant="secondary">Disconnected</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-sm">Checking system status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="h-4 w-4" />
            <span className="text-sm">Failed to load system status</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const systemStatus = status as SystemStatus;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Server className="h-5 w-5" />
            System Status
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => testConnectionsMutation.mutate()}
              disabled={testConnectionsMutation.isPending}
            >
              {testConnectionsMutation.isPending ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-1" />
              )}
              Test All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Quick Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-2">
            {getStatusIcon(systemStatus?.database?.connected)}
            <span className="text-sm font-medium">Database</span>
            {getStatusBadge(systemStatus?.database?.connected, systemStatus?.database?.error)}
          </div>
          
          <div className="flex items-center gap-2">
            {getStatusIcon(systemStatus?.googleSheets?.connected)}
            <span className="text-sm font-medium">Google Sheets</span>
            {getStatusBadge(systemStatus?.googleSheets?.connected, systemStatus?.googleSheets?.error)}
          </div>
          
          <div className="flex items-center gap-2">
            {getStatusIcon(systemStatus?.googleDrive?.connected)}
            <span className="text-sm font-medium">Google Drive</span>
            {getStatusBadge(systemStatus?.googleDrive?.connected, systemStatus?.googleDrive?.error)}
          </div>
          
          <div className="flex items-center gap-2">
            {getStatusIcon(systemStatus?.server?.status === 'healthy')}
            <span className="text-sm font-medium">Server</span>
            <Badge variant={systemStatus?.server?.status === 'healthy' ? 'default' : 'destructive'}>
              {systemStatus?.server?.status || 'Unknown'}
            </Badge>
          </div>
        </div>

        {/* Detailed Status (Expandable) */}
        {isExpanded && (
          <div className="space-y-4 border-t pt-4">
            {/* Database Details */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Database className="h-5 w-5 mt-0.5 text-blue-600" />
              <div className="flex-1">
                <h4 className="font-medium">PostgreSQL Database</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Status: {getStatusBadge(systemStatus?.database?.connected, systemStatus?.database?.error)}</div>
                  {systemStatus?.database?.latency && (
                    <div>Latency: {systemStatus.database.latency}ms</div>
                  )}
                  {systemStatus?.database?.error && (
                    <div className="text-red-600">Error: {systemStatus.database.error}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Google Sheets Details */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <FileSpreadsheet className="h-5 w-5 mt-0.5 text-green-600" />
              <div className="flex-1">
                <h4 className="font-medium">Google Sheets Integration</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Authentication: {getStatusBadge(systemStatus?.googleSheets?.authenticated)}</div>
                  <div>Connection: {getStatusBadge(systemStatus?.googleSheets?.connected, systemStatus?.googleSheets?.error)}</div>
                  {systemStatus?.googleSheets?.sheetsFound !== undefined && (
                    <div>Sheets Found: {systemStatus.googleSheets.sheetsFound}</div>
                  )}
                  {systemStatus?.googleSheets?.error && (
                    <div className="text-red-600">Error: {systemStatus.googleSheets.error}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Google Drive Details */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <FolderOpen className="h-5 w-5 mt-0.5 text-yellow-600" />
              <div className="flex-1">
                <h4 className="font-medium">Google Drive Integration</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Authentication: {getStatusBadge(systemStatus?.googleDrive?.authenticated)}</div>
                  <div>Connection: {getStatusBadge(systemStatus?.googleDrive?.connected, systemStatus?.googleDrive?.error)}</div>
                  {systemStatus?.googleDrive?.foldersFound !== undefined && (
                    <div>Folders Accessible: {systemStatus.googleDrive.foldersFound}</div>
                  )}
                  {systemStatus?.googleDrive?.error && (
                    <div className="text-red-600">Error: {systemStatus.googleDrive.error}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Server Details */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Globe className="h-5 w-5 mt-0.5 text-purple-600" />
              <div className="flex-1">
                <h4 className="font-medium">Server Health</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Status: <Badge variant={systemStatus?.server?.status === 'healthy' ? 'default' : 'destructive'}>
                    {systemStatus?.server?.status || 'Unknown'}
                  </Badge></div>
                  {systemStatus?.server?.uptime && (
                    <div>Uptime: {systemStatus.server.uptime}</div>
                  )}
                  {systemStatus?.server?.memory && (
                    <div>Memory Usage: {Math.round(systemStatus.server.memory)}%</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}