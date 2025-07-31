import { Badge } from "@/components/ui/badge";
import type { Vehicle } from "@shared/schema";

interface VehicleBannerProps {
  vehicle: Vehicle;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function VehicleBanner({ vehicle, size = "md", className = "" }: VehicleBannerProps) {
  const banners = [];

  if (vehicle.bannerReduced) {
    banners.push({
      text: "REDUCED",
      color: "bg-orange-500 text-white",
      icon: "💰"
    });
  }

  if (vehicle.bannerSold) {
    banners.push({
      text: "SOLD",
      color: "bg-red-500 text-white",
      icon: "✅"
    });
  }

  if (vehicle.bannerGreatDeal) {
    banners.push({
      text: "GREAT DEAL",
      color: "bg-green-500 text-white",
      icon: "🔥"
    });
  }

  if (vehicle.bannerNew) {
    banners.push({
      text: "NEW",
      color: "bg-blue-500 text-white",
      icon: "✨"
    });
  }

  if (banners.length === 0) return null;

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2"
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {banners.map((banner, index) => (
        <Badge
          key={index}
          className={`${banner.color} ${sizeClasses[size]} font-bold shadow-lg animate-pulse`}
        >
          <span className="mr-1">{banner.icon}</span>
          {banner.text}
        </Badge>
      ))}
    </div>
  );
}