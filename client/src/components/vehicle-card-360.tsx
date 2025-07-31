import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { RotateCw, Eye, Phone, Calendar, Gauge, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface Vehicle {
  id: number;
  slug: string;
  title: string;
  price: number;
  year: string;
  make: string;
  model: string;
  mileage: string;
  images: string[];
  exteriorColor?: string;
  status: string;
  bannerReduced?: boolean | null;
  bannerSold?: boolean | null;
  bannerGreatDeal?: boolean | null;
  bannerNew?: boolean | null;
}

interface VehicleCard360Props {
  vehicle: Vehicle;
  className?: string;
}

// Enhanced function to get working image URLs
const getWorkingImageUrl = (url: string): string => {
  if (!url) return '';
  
  if (url.includes('drive.google.com/file/d/')) {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      return `https://lh3.googleusercontent.com/d/${match[1]}=w400`;
    }
  }
  
  if (url.includes('drive.google.com/uc?id=')) {
    const urlObj = new URL(url);
    const id = urlObj.searchParams.get('id');
    if (id) {
      return `https://lh3.googleusercontent.com/d/${id}=w400`;
    }
  }
  
  if (url.includes('leadconnectorhq.com') || url.includes('filesafe.space')) {
    return url;
  }
  
  return url;
};

export default function VehicleCard360({ vehicle, className }: VehicleCard360Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [show360, setShow360] = useState(false);

  // Auto-rotate images on hover for 360° preview effect
  const handleMouseEnter = () => {
    setIsHovering(true);
    if (show360 && vehicle.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % vehicle.images.length);
      }, 300);
      
      setTimeout(() => {
        clearInterval(interval);
        setCurrentImageIndex(0);
      }, vehicle.images.length * 300);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setCurrentImageIndex(0);
  };

  const currentImage = vehicle.images.length > 0 
    ? getWorkingImageUrl(vehicle.images[currentImageIndex]) 
    : null;

  return (
    <Card 
      className={cn(
        "group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border-0 bg-white",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative">
        {/* Vehicle Image with 360° Mode Toggle */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {currentImage ? (
            <img
              src={currentImage}
              alt={vehicle.title}
              className={cn(
                "w-full h-full object-cover transition-all duration-500",
                show360 && isHovering ? "scale-110" : "group-hover:scale-105"
              )}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <div className="text-center text-gray-500">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-2xl">🚗</span>
                </div>
                <p className="text-sm">No Image</p>
              </div>
            </div>
          )}

          {/* 360° Mode Toggle */}
          {vehicle.images.length > 3 && (
            <Button
              size="sm"
              variant="ghost"
              className={cn(
                "absolute top-3 right-3 bg-black/70 hover:bg-black/80 text-white border-0 transition-all duration-300",
                show360 ? "bg-green-600 hover:bg-green-700" : ""
              )}
              onClick={(e) => {
                e.stopPropagation();
                setShow360(!show360);
              }}
            >
              <RotateCw className={cn(
                "h-3 w-3 mr-1 transition-transform duration-300",
                show360 && isHovering ? "animate-spin" : ""
              )} />
              {show360 ? "360° ON" : "360°"}
            </Button>
          )}

          {/* Status Banners */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {vehicle.bannerNew && (
              <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1">
                ✨ NEW
              </Badge>
            )}
            {vehicle.bannerReduced && (
              <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-1">
                💰 REDUCED
              </Badge>
            )}
            {vehicle.bannerGreatDeal && (
              <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1">
                🔥 GREAT DEAL
              </Badge>
            )}
            {vehicle.bannerSold && (
              <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1">
                ✅ SOLD
              </Badge>
            )}
          </div>

          {/* Image Counter */}
          {vehicle.images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              {show360 ? `${currentImageIndex + 1}/${vehicle.images.length}` : `${vehicle.images.length} photos`}
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Vehicle Details */}
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Title and Price */}
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-green-600 transition-colors duration-300 line-clamp-2">
                {vehicle.title}
              </h3>
              <div className="text-right ml-2 flex-shrink-0">
                <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                  ${vehicle.price.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Vehicle Info Grid */}
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-green-600" />
                <span>{vehicle.year}</span>
              </div>
              <div className="flex items-center gap-1">
                <Gauge className="h-3 w-3 text-green-600" />
                <span>{vehicle.mileage}</span>
              </div>
              {vehicle.exteriorColor && (
                <div className="flex items-center gap-1 col-span-2">
                  <Palette className="h-3 w-3 text-green-600" />
                  <span>{vehicle.exteriorColor}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Link href={`/vehicle/${vehicle.slug}`} className="flex-1">
                <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg transition-all duration-300 transform hover:scale-105">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </Link>
              <Button
                variant="outline"
                size="icon"
                className="border-green-600 text-green-600 hover:bg-green-50 transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = 'tel:765-238-2887';
                }}
              >
                <Phone className="h-4 w-4" />
              </Button>
            </div>

            {/* 360° Virtual Tour Indicator */}
            {vehicle.images.length > 3 && (
              <div className="flex items-center justify-center pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                  <RotateCw className="h-3 w-3" />
                  360° Virtual Tour Available
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}