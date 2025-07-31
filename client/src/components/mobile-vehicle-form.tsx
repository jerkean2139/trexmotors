import React, { useState } from 'react';
import { Camera, Plus, X, Save, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import MobileCamera from './mobile-camera';

interface MobileVehicleFormProps {
  onSubmit: (vehicleData: any) => void;
  onClose: () => void;
}

export default function MobileVehicleForm({ onSubmit, onClose }: MobileVehicleFormProps) {
  const [showCamera, setShowCamera] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: '',
    price: '',
    exteriorColor: '',
    interiorColor: '',
    vin: '',
    description: '',
    notes: '',
    auctionLot: '',
    auctionHouse: ''
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCapturePhoto = (imageData: string) => {
    setImages(prev => [...prev, imageData]);
    setShowCamera(false);
    toast({
      title: "Photo captured",
      description: "Vehicle photo added successfully"
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast({
            title: "Location captured",
            description: "Vehicle location recorded"
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Location error",
            description: "Could not get current location",
            variant: "destructive"
          });
        }
      );
    }
  };

  const handleSubmit = () => {
    if (!formData.make || !formData.model || !formData.year) {
      toast({
        title: "Required fields missing",
        description: "Please fill in make, model, and year",
        variant: "destructive"
      });
      return;
    }

    const vehicleData = {
      ...formData,
      images,
      location,
      addedFrom: 'mobile',
      timestamp: new Date().toISOString()
    };

    onSubmit(vehicleData);
  };

  if (showCamera) {
    return <MobileCamera onCapture={handleCapturePhoto} onClose={() => setShowCamera(false)} />;
  }

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      <div className="min-h-screen p-4 pb-safe">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Add Vehicle from Auction</CardTitle>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Vehicle Photos */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Vehicle Photos</Label>
                <div className="grid grid-cols-2 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Vehicle ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => setShowCamera(true)}
                  >
                    <Camera className="h-6 w-6 mb-1" />
                    <span className="text-xs">Add Photo</span>
                  </Button>
                </div>
              </div>

              {/* Basic Vehicle Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="make">Make *</Label>
                  <Input
                    id="make"
                    value={formData.make}
                    onChange={(e) => handleInputChange('make', e.target.value)}
                    placeholder="Ford, Toyota, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder="F-150, Camry, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                    min="1990"
                    max={new Date().getFullYear() + 1}
                  />
                </div>
                <div>
                  <Label htmlFor="mileage">Mileage</Label>
                  <Input
                    id="mileage"
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => handleInputChange('mileage', e.target.value)}
                    placeholder="75000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="15000"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="exteriorColor">Exterior Color</Label>
                  <Input
                    id="exteriorColor"
                    value={formData.exteriorColor}
                    onChange={(e) => handleInputChange('exteriorColor', e.target.value)}
                    placeholder="Red, Blue, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="interiorColor">Interior Color</Label>
                  <Input
                    id="interiorColor"
                    value={formData.interiorColor}
                    onChange={(e) => handleInputChange('interiorColor', e.target.value)}
                    placeholder="Black, Tan, etc."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="vin">VIN</Label>
                <Input
                  id="vin"
                  value={formData.vin}
                  onChange={(e) => handleInputChange('vin', e.target.value)}
                  placeholder="1FTFW1ET5DFC12345"
                />
              </div>

              {/* Auction Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="auctionHouse">Auction House</Label>
                  <Input
                    id="auctionHouse"
                    value={formData.auctionHouse}
                    onChange={(e) => handleInputChange('auctionHouse', e.target.value)}
                    placeholder="Manheim, Copart, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="auctionLot">Lot Number</Label>
                  <Input
                    id="auctionLot"
                    value={formData.auctionLot}
                    onChange={(e) => handleInputChange('auctionLot', e.target.value)}
                    placeholder="12345"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Vehicle condition, features, etc."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Internal notes, issues, etc."
                  rows={2}
                />
              </div>

              {/* Location */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>Location</Label>
                  <p className="text-sm text-muted-foreground">
                    {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Not captured'}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={getLocation}>
                  <MapPin className="h-4 w-4 mr-2" />
                  Get Location
                </Button>
              </div>

              {/* Submit Button */}
              <Button 
                onClick={handleSubmit}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <Save className="h-5 w-5 mr-2" />
                Save Vehicle
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}