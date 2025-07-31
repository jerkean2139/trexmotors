import React, { useRef, useState, useCallback } from 'react';
import { Camera, RotateCcw, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface MobileCameraProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

export default function MobileCamera({ onCapture, onClose }: MobileCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access camera. Please ensure camera permissions are enabled.');
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsActive(false);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  }, [stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const confirmPhoto = useCallback(() => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  }, [capturedImage, onCapture, onClose]);

  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    stopCamera();
    // Restart camera with new facing mode
    setTimeout(startCamera, 100);
  }, [stopCamera, startCamera]);

  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex-1 relative">
        {!capturedImage ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Camera controls */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center space-x-6">
              <Button
                variant="outline"
                size="icon"
                onClick={switchCamera}
                className="bg-black/50 border-white/30 text-white hover:bg-black/70"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
              
              <Button
                onClick={capturePhoto}
                size="icon"
                className="w-16 h-16 rounded-full bg-white hover:bg-gray-100 text-black"
              >
                <Camera className="h-8 w-8" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={onClose}
                className="bg-black/50 border-white/30 text-white hover:bg-black/70"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
            
            {/* Photo confirmation controls */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center space-x-6">
              <Button
                variant="outline"
                onClick={retakePhoto}
                className="bg-black/50 border-white/30 text-white hover:bg-black/70"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Retake
              </Button>
              
              <Button
                onClick={confirmPhoto}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="h-5 w-5 mr-2" />
                Use Photo
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}