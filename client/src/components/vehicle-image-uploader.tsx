import { useState, useCallback, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Image as ImageIcon, FolderOpen, CheckCircle, AlertCircle, Move, Plus, Link, Star, ArrowUp, ArrowDown, Grip } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VehicleImageUploaderProps {
  vehicleId: number;
  vehicleTitle: string;
  currentImages: string[];
  onImagesUpdated?: (images: string[]) => void;
}

interface UploadedFile {
  file: File;
  preview: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  driveFileId?: string;
  error?: string;
}

interface GoogleDriveFile {
  id: string;
  name: string;
  thumbnail: string;
  downloadUrl: string;
}

export default function VehicleImageUploader({ 
  vehicleId, 
  vehicleTitle, 
  currentImages, 
  onImagesUpdated 
}: VehicleImageUploaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [driveFiles, setDriveFiles] = useState<GoogleDriveFile[]>([]);
  const [selectedDriveFiles, setSelectedDriveFiles] = useState<string[]>([]);
  const [browseFolderId, setBrowseFolderId] = useState<string>("root");
  const [driveLinks, setDriveLinks] = useState<string[]>(['']);
  const [bulkDriveLinks, setBulkDriveLinks] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Upload files to Google Drive and update vehicle
  const uploadMutation = useMutation({
    mutationFn: async (files: UploadedFile[]) => {
      const uploadPromises = files.map(async (fileData) => {
        const formData = new FormData();
        formData.append('file', fileData.file);
        formData.append('vehicleId', vehicleId.toString());
        formData.append('vehicleTitle', vehicleTitle);

        const response = await fetch('/api/admin/upload-vehicle-image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${fileData.file.name}`);
        }

        return response.json();
      });

      return Promise.all(uploadPromises);
    },
    onSuccess: (results) => {
      const newImages = results.map(r => r.imageUrl);
      const updatedImages = [...currentImages, ...newImages];
      
      toast({
        title: "Images Uploaded",
        description: `${results.length} image(s) uploaded successfully to Google Drive.`
      });
      
      onImagesUpdated?.(updatedImages);
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      setUploadedFiles([]);
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload images",
        variant: "destructive"
      });
    }
  });

  // Add images from existing Google Drive files
  const addDriveImagesMutation = useMutation({
    mutationFn: async (fileIds: string[]) => {
      const response = await fetch(`/api/vehicles/${vehicleId}/add-drive-images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileIds })
      });

      if (!response.ok) {
        throw new Error('Failed to add images from Google Drive');
      }

      return response.json();
    },
    onSuccess: (result) => {
      toast({
        title: "Images Added",
        description: `${selectedDriveFiles.length} image(s) added from Google Drive.`
      });
      
      onImagesUpdated?.(result.images);
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      setSelectedDriveFiles([]);
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Failed to Add Images",
        description: "Could not add images from Google Drive",
        variant: "destructive"
      });
    }
  });

  // Add Google Drive images via URL links
  const addDriveUrlsMutation = useMutation({
    mutationFn: async (imageUrls: string[]) => {
      const response = await fetch(`/api/admin/vehicles/${vehicleId}/drive-urls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrls }),
      });

      if (!response.ok) {
        throw new Error('Failed to add images from URLs');
      }

      return response.json();
    },
    onSuccess: (data) => {
      const newImages = [...currentImages, ...data.imageUrls];
      onImagesUpdated?.(newImages);
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      
      setDriveLinks(['']);
      setBulkDriveLinks('');
      setIsDialogOpen(false);
      
      toast({
        title: "Images Added Successfully",
        description: `Added ${data.imageUrls.length} images from Google Drive links`,
      });
    },
    onError: (error) => {
      console.error('Drive URLs error:', error);
      toast({
        title: "Failed to Add Images",
        description: "Could not add images from Google Drive URLs",
        variant: "destructive"
      });
    }
  });

  // Handle drag and drop
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      toast({
        title: "Invalid Files",
        description: "Only image files are allowed",
        variant: "destructive"
      });
    }

    const newUploadedFiles: UploadedFile[] = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'pending'
    }));

    setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const browseDriveFolder = async (folderId: string = "root") => {
    try {
      const response = await fetch(`/api/admin/browse-files/${folderId}`);
      if (response.ok) {
        const files = await response.json();
        console.log('Received files from API:', files); // Debug log
        
        // Convert API response to our expected format
        const processedFiles = files.map((file: any) => ({
          id: file.id,
          name: file.name,
          thumbnail: file.thumbnailLink || `https://drive.google.com/thumbnail?id=${file.id}&sz=w150-h150`,
          downloadUrl: file.webViewLink || `https://drive.google.com/uc?id=${file.id}`
        }));
        
        setDriveFiles(processedFiles);
        setBrowseFolderId(folderId);
        
        if (processedFiles.length === 0) {
          toast({
            title: "No Images Found",
            description: "No image files found in the selected Google Drive folder",
          });
        } else {
          toast({
            title: "Images Loaded",
            description: `Found ${processedFiles.length} image(s) in Google Drive`,
          });
        }
      } else {
        throw new Error('Failed to fetch files');
      }
    } catch (error) {
      console.error('Browse Drive error:', error);
      toast({
        title: "Browse Failed",
        description: "Could not browse Google Drive folder",
        variant: "destructive"
      });
    }
  };

  const toggleDriveFileSelection = (fileId: string) => {
    setSelectedDriveFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const startUpload = () => {
    if (uploadedFiles.length > 0) {
      uploadMutation.mutate(uploadedFiles);
    }
  };

  const addSelectedDriveImages = () => {
    if (selectedDriveFiles.length > 0) {
      addDriveImagesMutation.mutate(selectedDriveFiles);
    }
  };

  const addDriveLink = () => {
    setDriveLinks([...driveLinks, '']);
  };

  const removeDriveLink = (index: number) => {
    const newLinks = driveLinks.filter((_, i) => i !== index);
    setDriveLinks(newLinks.length > 0 ? newLinks : ['']);
  };

  const updateDriveLink = (index: number, value: string) => {
    const newLinks = [...driveLinks];
    newLinks[index] = value;
    setDriveLinks(newLinks);
  };

  const importBulkLinks = () => {
    if (bulkDriveLinks.trim()) {
      const links = bulkDriveLinks.split('\n').filter(link => link.trim());
      setDriveLinks(links);
      setBulkDriveLinks('');
      toast({
        title: "Links Imported",
        description: `${links.length} Google Drive links imported`
      });
    }
  };

  const addDriveUrls = () => {
    const validUrls = driveLinks.filter(url => url.trim());
    if (validUrls.length > 0) {
      addDriveUrlsMutation.mutate(validUrls);
    }
  };

  // Helper function to convert Google Drive URLs for preview
  const getGoogleDrivePreviewUrl = (url: string): string => {
    if (!url || !url.includes('drive.google.com')) {
      return url;
    }

    // Extract file ID from various Google Drive URL formats
    let fileId = '';
    
    // Handle sharing URLs: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    const shareMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (shareMatch) {
      fileId = shareMatch[1];
    }
    
    // Handle direct URLs: https://drive.google.com/uc?id=FILE_ID
    const directMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (directMatch) {
      fileId = directMatch[1];
    }

    if (fileId) {
      // First try direct image URL, fallback to thumbnail
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }

    return url;
  };

  // Reorder images
  const reorderImagesMutation = useMutation({
    mutationFn: async (newOrder: string[]) => {
      const response = await fetch(`/api/vehicles/${vehicleId}/reorder-images`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageOrder: newOrder }),
      });

      if (!response.ok) {
        throw new Error('Failed to reorder images');
      }

      return response.json();
    },
    onSuccess: (data) => {
      onImagesUpdated?.(data.images);
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      toast({
        title: "Images Reordered",
        description: "Primary image updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Failed to Reorder",
        description: "Could not reorder vehicle images",
        variant: "destructive"
      });
    }
  });

  const moveImageUp = (index: number) => {
    if (index > 0) {
      const newOrder = [...currentImages];
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      reorderImagesMutation.mutate(newOrder);
    }
  };

  const moveImageDown = (index: number) => {
    if (index < currentImages.length - 1) {
      const newOrder = [...currentImages];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      reorderImagesMutation.mutate(newOrder);
    }
  };

  const setAsPrimary = (index: number) => {
    const newOrder = [...currentImages];
    const [selectedImage] = newOrder.splice(index, 1);
    newOrder.unshift(selectedImage);
    reorderImagesMutation.mutate(newOrder);
  };

  const removeImage = async (index: number) => {
    try {
      const response = await fetch(`/api/vehicles/${vehicleId}/images/${index}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedImages = currentImages.filter((_, i) => i !== index);
        onImagesUpdated?.(updatedImages);
        queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
        toast({
          title: "Image Removed",
          description: "Image deleted successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to Remove",
        description: "Could not remove image",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Upload className="w-4 h-4 mr-2" />
          Manage Images ({currentImages.length})
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Vehicle Image Management
          </DialogTitle>
          <DialogDescription>
            {vehicleTitle} • Upload new images or select from Google Drive
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Images */}
          {currentImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Current Images ({currentImages.length})
                </CardTitle>
                <CardDescription>
                  First image is the primary/featured image. Use controls to reorder.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentImages.map((imageUrl, index) => (
                    <div key={index} className="relative group border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex gap-3">
                        {/* Image Thumbnail */}
                        <div className="relative">
                          <img 
                            src={imageUrl} 
                            alt={`Vehicle image ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg border"
                          />
                          {index === 0 && (
                            <div className="absolute -top-2 -right-2">
                              <Badge className="bg-green-600 text-white text-xs px-2">
                                <Star className="w-3 h-3 mr-1" />
                                PRIMARY
                              </Badge>
                            </div>
                          )}
                        </div>

                        {/* Controls */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Image {index + 1}
                              {index === 0 && <span className="text-green-600 ml-2">(Featured)</span>}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeImage(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="flex gap-1 mt-2">
                            {index !== 0 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setAsPrimary(index)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Star className="w-4 h-4 mr-1" />
                                Set Primary
                              </Button>
                            )}
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => moveImageUp(index)}
                              disabled={index === 0}
                            >
                              <ArrowUp className="w-4 h-4" />
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => moveImageDown(index)}
                              disabled={index === currentImages.length - 1}
                            >
                              <ArrowDown className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Drag and Drop Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle>Upload New Images</CardTitle>
              <CardDescription>Drag and drop images or click to browse</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">
                  {isDragOver ? 'Drop images here' : 'Drag & drop images here'}
                </p>
                <p className="text-gray-600 mb-4">or click to browse your computer</p>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>

              {/* Upload Preview */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Files to Upload ({uploadedFiles.length})</h4>
                    <Button 
                      onClick={startUpload}
                      disabled={uploadMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {uploadMutation.isPending ? 'Uploading...' : 'Upload All'}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedFiles.map((fileData, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={fileData.preview} 
                          alt={fileData.file.name}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                          <div className="text-center text-white">
                            <div className="text-xs mb-1">
                              {fileData.status === 'success' && <CheckCircle className="w-4 h-4 mx-auto" />}
                              {fileData.status === 'error' && <AlertCircle className="w-4 h-4 mx-auto" />}
                              {fileData.status === 'pending' && <Upload className="w-4 h-4 mx-auto" />}
                            </div>
                            <div className="text-xs">{fileData.file.name.slice(0, 12)}...</div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 w-6 h-6 p-0"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Google Drive URL Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5" />
                Add Google Drive Links
              </CardTitle>
              <CardDescription>
                Paste Google Drive sharing links directly - faster than browsing folders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Instructions */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">📸 Quick Instructions:</h4>
                  <div className="text-sm text-green-800 space-y-1">
                    <p><strong>1.</strong> Right-click image in Google Drive → "Get link"</p>
                    <p><strong>2.</strong> Change to "Anyone with the link can view"</p>
                    <p><strong>3.</strong> Paste the link below</p>
                  </div>
                </div>

                {/* Bulk paste area */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <Label htmlFor="bulkPaste">💡 Bulk Paste (Multiple Links)</Label>
                  <Textarea
                    id="bulkPaste"
                    value={bulkDriveLinks}
                    onChange={(e) => setBulkDriveLinks(e.target.value)}
                    placeholder="Paste multiple Google Drive links here (one per line)..."
                    rows={3}
                    className="mt-2 mb-2"
                  />
                  <Button
                    onClick={importBulkLinks}
                    variant="outline"
                    size="sm"
                    disabled={!bulkDriveLinks.trim()}
                  >
                    Import Links
                  </Button>
                </div>

                {/* Individual URL inputs */}
                <div className="space-y-3">
                  <Label>Individual Google Drive Links</Label>
                  {driveLinks.map((link, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={link}
                        onChange={(e) => updateDriveLink(index, e.target.value)}
                        placeholder="https://drive.google.com/file/d/YOUR_FILE_ID/view"
                        className="flex-1"
                      />
                      {driveLinks.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeDriveLink(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={addDriveLink}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Link
                    </Button>
                    
                    {driveLinks.filter(url => url.trim()).length > 0 && (
                      <Button
                        onClick={addDriveUrls}
                        disabled={addDriveUrlsMutation.isPending}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {addDriveUrlsMutation.isPending ? 'Adding...' : `Add ${driveLinks.filter(url => url.trim()).length} Images`}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Preview section */}
                {driveLinks.filter(url => url.trim()).length > 0 && (
                  <div className="mt-4">
                    <Label>Preview</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                      {driveLinks.filter(url => url.trim()).map((url, index) => (
                        <div key={index} className="relative">
                          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border">
                            <img 
                              src={getGoogleDrivePreviewUrl(url)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                const originalSrc = target.src;
                                
                                // Try thumbnail fallback if direct URL fails
                                if (originalSrc.includes('uc?export=view')) {
                                  const fileIdMatch = originalSrc.match(/[?&]id=([a-zA-Z0-9_-]+)/);
                                  if (fileIdMatch) {
                                    target.src = `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=w300-h200`;
                                    return;
                                  }
                                }
                                
                                // Final fallback to placeholder
                                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA5VjEzTTEyIDE3SDE2TTggMTdIMTJNOCAxM0gxNk04IDlIMTYiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
                              }}
                            />
                          </div>
                          <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Google Drive Browser */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Select from Google Drive
              </CardTitle>
              <CardDescription>
                Browse and select existing images from Google Drive folders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => browseDriveFolder("root")}
                    disabled={addDriveImagesMutation.isPending}
                  >
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Browse Drive
                  </Button>
                  
                  {selectedDriveFiles.length > 0 && (
                    <Button 
                      onClick={addSelectedDriveImages}
                      disabled={addDriveImagesMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Move className="w-4 h-4 mr-2" />
                      Add Selected ({selectedDriveFiles.length})
                    </Button>
                  )}
                </div>

                {driveFiles.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 max-h-60 overflow-y-auto">
                    {driveFiles.map((file) => (
                      <div 
                        key={file.id}
                        className={`relative cursor-pointer border-2 rounded-lg transition-all ${
                          selectedDriveFiles.includes(file.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => toggleDriveFileSelection(file.id)}
                      >
                        <img 
                          src={file.thumbnail} 
                          alt={file.name}
                          className="w-full h-20 object-cover rounded-t-lg"
                        />
                        <div className="p-2">
                          <div className="text-xs truncate">{file.name}</div>
                        </div>
                        {selectedDriveFiles.includes(file.id) && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle className="w-5 h-5 text-blue-600 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}