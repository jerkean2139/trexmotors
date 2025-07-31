import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ImageIcon, ExternalLink, CheckCircle } from "lucide-react";

interface DriveImagePreviewProps {
  imageLinks: string[];
  onImageSelect: (selectedImages: { url: string; featured: boolean }[]) => void;
  className?: string;
}

interface ImagePreview {
  url: string;
  thumbnail: string;
  isValid: boolean;
  featured: boolean;
  selected: boolean;
}

export default function DriveImagePreview({ imageLinks, onImageSelect, className }: DriveImagePreviewProps) {
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [loading, setLoading] = useState(false);

  // Extract file ID from Google Drive links and create thumbnails
  const processGoogleDriveLinks = (links: string[]) => {
    return links.map(link => {
      if (!link) return null;
      
      // Extract file ID from various Google Drive URL formats
      let fileId = '';
      
      if (link.includes('/file/d/')) {
        fileId = link.split('/file/d/')[1].split('/')[0];
      } else if (link.includes('id=')) {
        fileId = link.split('id=')[1].split('&')[0];
      } else if (link.includes('/open?id=')) {
        fileId = link.split('/open?id=')[1].split('&')[0];
      }
      
      if (!fileId) return null;
      
      return {
        url: `https://drive.google.com/uc?id=${fileId}`,
        thumbnail: `https://drive.google.com/thumbnail?id=${fileId}&sz=w300-h200`,
        isValid: true,
        featured: false,
        selected: true // Auto-select all valid images
      };
    }).filter(Boolean) as ImagePreview[];
  };

  useEffect(() => {
    if (imageLinks && imageLinks.length > 0) {
      setLoading(true);
      const processed = processGoogleDriveLinks(imageLinks);
      
      // Set first image as featured by default
      if (processed.length > 0) {
        processed[0].featured = true;
      }
      
      setImagePreviews(processed);
      setLoading(false);
      
      // Auto-notify parent of initial selection
      const selectedImages = processed
        .filter(img => img.selected)
        .map(img => ({ url: img.url, featured: img.featured }));
      onImageSelect(selectedImages);
    }
  }, [imageLinks]);

  const toggleImageSelection = (index: number) => {
    const updated = [...imagePreviews];
    updated[index].selected = !updated[index].selected;
    
    // If unselecting featured image, auto-select another as featured
    if (!updated[index].selected && updated[index].featured) {
      updated[index].featured = false;
      const firstSelected = updated.find(img => img.selected);
      if (firstSelected) {
        firstSelected.featured = true;
      }
    }
    
    setImagePreviews(updated);
    
    const selectedImages = updated
      .filter(img => img.selected)
      .map(img => ({ url: img.url, featured: img.featured }));
    onImageSelect(selectedImages);
  };

  const setFeaturedImage = (index: number) => {
    const updated = [...imagePreviews];
    // Remove featured from all images
    updated.forEach(img => img.featured = false);
    // Set new featured image and ensure it's selected
    updated[index].featured = true;
    updated[index].selected = true;
    
    setImagePreviews(updated);
    
    const selectedImages = updated
      .filter(img => img.selected)
      .map(img => ({ url: img.url, featured: img.featured }));
    onImageSelect(selectedImages);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Processing image links...</p>
        </div>
      </div>
    );
  }

  if (imagePreviews.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No valid Google Drive image links found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">Vehicle Images ({imagePreviews.length})</h4>
        <p className="text-sm text-gray-500">Click to select/deselect • Star for featured image</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {imagePreviews.map((image, index) => (
          <Card 
            key={index}
            className={`relative cursor-pointer transition-all duration-200 ${
              image.selected 
                ? 'ring-2 ring-green-500 shadow-lg' 
                : 'hover:ring-2 hover:ring-gray-300'
            }`}
            onClick={() => toggleImageSelection(index)}
          >
            <CardContent className="p-2">
              <div className="relative aspect-video rounded-md overflow-hidden bg-gray-100">
                <img
                  src={image.thumbnail}
                  alt={`Vehicle image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-200">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
                
                {/* Selection indicator */}
                {image.selected && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="h-5 w-5 text-green-500 bg-white rounded-full" />
                  </div>
                )}
                
                {/* Featured badge */}
                {image.featured && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-yellow-500 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="mt-2 space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFeaturedImage(index);
                  }}
                >
                  <Star className="h-3 w-3 mr-1" />
                  Set Featured
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(image.url, '_blank');
                  }}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Full
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <p><strong>Selected:</strong> {imagePreviews.filter(img => img.selected).length} images</p>
        <p><strong>Featured:</strong> {imagePreviews.find(img => img.featured)?.url ? 'Set' : 'None selected'}</p>
      </div>
    </div>
  );
}