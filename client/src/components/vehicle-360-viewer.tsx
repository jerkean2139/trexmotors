import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCw, MousePointer, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Vehicle360ViewerProps {
  images: string[];
  vehicleTitle: string;
  className?: string;
  autoPlay?: boolean;
  speed?: number; // milliseconds between frames
}

export default function Vehicle360Viewer({ 
  images, 
  vehicleTitle, 
  className,
  autoPlay = false,
  speed = 150
}: Vehicle360ViewerProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartIndex, setDragStartIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  
  const intervalRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  // Preload all images
  useEffect(() => {
    if (images.length === 0) return;

    const preloadImages = async () => {
      const loadPromises = images.map((src, index) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            setLoadedImages(prev => new Set(Array.from(prev).concat([index])));
            resolve();
          };
          img.onerror = () => {
            console.warn(`Failed to load 360° image ${index}: ${src}`);
            resolve();
          };
          img.src = src;
        });
      });

      await Promise.all(loadPromises);
      setIsLoading(false);
    };

    preloadImages();
  }, [images]);

  // Auto-rotation effect
  useEffect(() => {
    if (isPlaying && !isDragging && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
      }, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isDragging, images.length, speed]);

  // Mouse drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (images.length <= 1) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartIndex(currentImageIndex);
    setIsPlaying(false);
  }, [currentImageIndex, images.length]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || images.length <= 1) return;
    
    const deltaX = e.clientX - dragStartX;
    const sensitivity = containerRef.current ? containerRef.current.offsetWidth / images.length : 100;
    const imageChange = Math.floor(deltaX / sensitivity);
    const newIndex = (dragStartIndex + imageChange + images.length) % images.length;
    
    setCurrentImageIndex(newIndex);
  }, [isDragging, dragStartX, dragStartIndex, images.length]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (images.length <= 1) return;
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    setDragStartIndex(currentImageIndex);
    setIsPlaying(false);
  }, [currentImageIndex, images.length]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || images.length <= 1) return;
    
    const deltaX = e.touches[0].clientX - dragStartX;
    const sensitivity = containerRef.current ? containerRef.current.offsetWidth / images.length : 100;
    const imageChange = Math.floor(deltaX / sensitivity);
    const newIndex = (dragStartIndex + imageChange + images.length) % images.length;
    
    setCurrentImageIndex(newIndex);
  }, [isDragging, dragStartX, dragStartIndex, images.length]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return;
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          setIsPlaying(prev => !prev);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
          break;
        case 'ArrowRight':
          e.preventDefault();
          setCurrentImageIndex(prev => (prev + 1) % images.length);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <Card className={cn("p-8 text-center bg-gray-100", className)}>
        <div className="text-gray-500">
          <RotateCw className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No 360° images available for this vehicle</p>
        </div>
      </Card>
    );
  }

  if (images.length === 1) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <div className="relative aspect-video bg-gray-100">
          <img
            src={images[0]}
            alt={vehicleTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            Single View
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden select-none", className)}>
      <div 
        ref={containerRef}
        className={cn(
          "relative aspect-video bg-gray-100 cursor-grab group",
          isDragging && "cursor-grabbing",
          isFullscreen && "fixed inset-0 z-50 aspect-auto"
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        tabIndex={0}
      >
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <RotateCw className="h-8 w-8 mx-auto mb-2 animate-spin text-green-600" />
              <p className="text-sm text-gray-600">Loading 360° view...</p>
            </div>
          </div>
        )}

        {/* 360° Images */}
        <div className="relative w-full h-full">
          {images.map((src, index) => (
            <img
              key={index}
              ref={el => imageRefs.current[index] = el}
              src={src}
              alt={`${vehicleTitle} - View ${index + 1}`}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-150",
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              )}
              draggable={false}
              style={{ display: Array.from(loadedImages).includes(index) ? 'block' : 'none' }}
            />
          ))}
        </div>

        {/* 360° Badge */}
        <div className="absolute top-4 left-4 bg-gradient-to-r from-green-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
          <RotateCw className="inline h-4 w-4 mr-1" />
          360° VIEW
        </div>

        {/* Progress Indicator */}
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {images.length}
        </div>

        {/* Control Overlay */}
        <div className={cn(
          "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 transition-opacity duration-300",
          "opacity-0 group-hover:opacity-100"
        )}>
          <div className="flex items-center justify-between">
            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => setCurrentImageIndex(prev => (prev + 1) % images.length)}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>

            {/* Instructions */}
            <div className="hidden md:flex items-center text-white/80 text-sm">
              <MousePointer className="h-4 w-4 mr-2" />
              Drag to rotate • Space to play/pause • F for fullscreen
            </div>

            {/* Fullscreen Toggle */}
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mt-2 w-full bg-white/20 rounded-full h-1">
            <div 
              className="bg-green-500 h-1 rounded-full transition-all duration-150"
              style={{ width: `${((currentImageIndex + 1) / images.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Mobile Instructions */}
        <div className="md:hidden absolute inset-x-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <div className={cn(
            "text-center text-white/80 text-sm bg-black/50 mx-4 p-2 rounded-lg transition-opacity duration-300",
            isDragging ? "opacity-0" : "opacity-100 group-hover:opacity-0"
          )}>
            Swipe left or right to rotate
          </div>
        </div>
      </div>
    </Card>
  );
}