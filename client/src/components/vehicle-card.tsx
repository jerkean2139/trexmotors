import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Gauge, Settings, Fuel, Route, Truck } from "lucide-react";
import { Link } from "wouter";
import CarFaxButton from "@/components/carfax-button";
import VehicleBanner from "./vehicle-banner";
import type { Vehicle } from "@shared/schema";

// Enhanced function to get working image URLs for all formats
const getWorkingImageUrl = (url: string): string => {
  if (!url) return '';
  
  // Handle Google Drive URLs - use the same approach that works for thumbnails
  if (url.includes('drive.google.com/file/d/')) {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      // Use the usercontent domain that Google redirects to
      return `https://lh3.googleusercontent.com/d/${match[1]}=w400`;
    }
  }
  
  // Handle Google Drive uc URLs
  if (url.includes('drive.google.com/uc?id=')) {
    const urlObj = new URL(url);
    const id = urlObj.searchParams.get('id');
    if (id) {
      return `https://lh3.googleusercontent.com/d/${id}=w400`;
    }
  }
  
  // Handle leadconnectorhq URLs (already optimized for web)
  if (url.includes('leadconnectorhq.com') || url.includes('filesafe.space')) {
    return url;
  }
  
  // Return original URL for other formats
  return url;
};

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Link href={`/vehicle/${vehicle.slug}`} className="block">
      <Card className="overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-white cursor-pointer">
        <div className="relative h-56">
        {vehicle.images && vehicle.images.length > 0 ? (
          <img 
            src={getWorkingImageUrl(vehicle.images[0])} 
            alt={vehicle.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIHN0b3AtY29sb3I9IiNmMGYwZjAiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlMGUwZTAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-500">
              <div className="h-12 w-12 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-xl font-bold">🚗</span>
              </div>
              <p className="text-sm font-medium">No Image Available</p>
            </div>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <Badge variant={vehicle.status === "for-sale" ? "default" : "secondary"} className="bg-green-500 text-white px-3 py-1 text-sm font-semibold">
            Available
          </Badge>
        </div>
        <div className="absolute top-4 right-16">
          <VehicleBanner vehicle={vehicle} size="sm" />
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 shadow-lg"
        >
          <Heart className="h-5 w-5" />
        </Button>
        
        {/* Enhanced Price overlay */}
        <div className="absolute bottom-4 right-4">
          <div className="relative bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-3 rounded-xl font-bold text-xl shadow-2xl border-2 border-white/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-xl blur-sm"></div>
            <div className="relative flex items-center gap-2">
              <span className="text-lg font-light">$</span>
              <span className="text-2xl font-extrabold tracking-tight">{vehicle.price.toLocaleString()}</span>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-3">{vehicle.title}</h3>
        <p className="text-gray-600 mb-6 text-lg">{vehicle.description}</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center">
            <Gauge className="w-5 h-5 text-auto-blue-600 mr-3" />
            <span className="font-medium">{vehicle.mileage}</span>
          </div>
          <div className="flex items-center">
            <Settings className="w-5 h-5 text-auto-blue-600 mr-3" />
            <span className="font-medium">{vehicle.transmission}</span>
          </div>
          <div className="flex items-center">
            <Fuel className="w-5 h-5 text-auto-blue-600 mr-3" />
            <span className="font-medium">{vehicle.engine}</span>
          </div>
          <div className="flex items-center">
            <Route className="w-5 h-5 text-auto-blue-600 mr-3" />
            <span className="font-medium">{vehicle.driveType}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex gap-3">
            <Button className="flex-1 bg-auto-blue-600 hover:bg-auto-blue-700 py-3 text-lg font-semibold">
              View Details
            </Button>
            <CarFaxButton 
              embedCode={vehicle.carfaxEmbedCode} 
              vehicleTitle={vehicle.title}
              size="default"
              className="px-4"
            />
          </div>
        </div>
      </CardContent>
      </Card>
    </Link>
  );
}
