import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, X, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SimpleImageUploaderProps {
  onImageSelection: (images: { url: string; featured: boolean }[]) => void;
}

export default function SimpleImageUploader({ onImageSelection }: SimpleImageUploaderProps) {
  const [imageUrls, setImageUrls] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<{ url: string; featured: boolean }[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const processImageUrls = () => {
    const urls = imageUrls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0)
      .map(url => {
        // Convert Google Drive share links to direct image URLs
        if (url.includes('drive.google.com/file/d/')) {
          const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
          if (match) {
            return `https://lh3.googleusercontent.com/d/${match[1]}=w800`;
          }
        }
        
        // Convert Google Drive uc links
        if (url.includes('drive.google.com/uc?')) {
          const match = url.match(/id=([a-zA-Z0-9_-]+)/);
          if (match) {
            return `https://lh3.googleusercontent.com/d/${match[1]}=w800`;
          }
        }
        
        return url;
      });

    setPreviewImages(urls);
    
    const images = urls.map((url, index) => ({
      url,
      featured: index === 0 // First image is featured
    }));
    
    setSelectedImages(images);
    
    if (urls.length > 0) {
      toast({
        title: "Images Processed",
        description: `${urls.length} image(s) ready for selection`
      });
    }
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = selectedImages.filter((_, index) => index !== indexToRemove);
    setSelectedImages(newImages);
    setPreviewImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const toggleFeatured = (indexToToggle: number) => {
    const newImages = selectedImages.map((img, index) => ({
      ...img,
      featured: index === indexToToggle
    }));
    setSelectedImages(newImages);
  };

  const handleSelection = () => {
    onImageSelection(selectedImages);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="image-urls">Image URLs</Label>
        <Textarea
          id="image-urls"
          placeholder={`Paste image URLs here (one per line). Supports:
• Google Drive links (https://drive.google.com/file/d/...)
• Direct image URLs (https://example.com/image.jpg)
• Google Photos links
• Any publicly accessible image URL`}
          value={imageUrls}
          onChange={(e) => setImageUrls(e.target.value)}
          rows={6}
          className="font-mono text-sm"
        />
        <Button onClick={processImageUrls} disabled={!imageUrls.trim()}>
          <Plus className="mr-2 h-4 w-4" />
          Process Images
        </Button>
      </div>

      {previewImages.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Image Preview ({previewImages.length} images)</Label>
            <Button 
              onClick={handleSelection}
              disabled={selectedImages.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              Select {selectedImages.length} Images
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {previewImages.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-green-500 transition-colors">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Load+Error';
                    }}
                  />
                </div>
                
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                    <Button
                      size="sm"
                      variant={selectedImages[index]?.featured ? "default" : "secondary"}
                      onClick={() => toggleFeatured(index)}
                      className="text-xs"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      {selectedImages[index]?.featured ? 'Featured' : 'Feature'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {selectedImages[index]?.featured && (
                  <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                    Featured
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedImages.length === 0 && previewImages.length > 0 && (
        <div className="text-center text-gray-500 py-8">
          No images selected. Click on images to select them for the vehicle.
        </div>
      )}
    </div>
  );
}