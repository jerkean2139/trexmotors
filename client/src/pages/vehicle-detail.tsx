import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Mail, Check, ArrowLeft, Calculator } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ContactForm from "@/components/contact-form";
import CarFaxButton from "@/components/carfax-button";
import VehicleHistoryReports from "@/components/vehicle-history-reports";
import FinancingCalculator from "@/components/financing-calculator";
import VehicleContactForm from "@/components/vehicle-contact-form";
import Vehicle360Viewer from "@/components/vehicle-360-viewer";
import { api } from "@/lib/api";
import { Link } from "wouter";
import SEOHead from "@/components/seo-head";

// Enhanced function to get working image URLs for all formats
const getWorkingImageUrl = (url: string): string => {
  if (!url) return '';
  
  // Handle Google Drive URLs - use the same approach that works for thumbnails
  if (url.includes('drive.google.com/file/d/')) {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      // Use the usercontent domain that Google redirects to
      return `https://lh3.googleusercontent.com/d/${match[1]}=w800`;
    }
  }
  
  // Handle Google Drive uc URLs
  if (url.includes('drive.google.com/uc?id=')) {
    const urlObj = new URL(url);
    const id = urlObj.searchParams.get('id');
    if (id) {
      return `https://lh3.googleusercontent.com/d/${id}=w800`;
    }
  }
  
  // Handle leadconnectorhq URLs (already optimized for web)
  if (url.includes('leadconnectorhq.com') || url.includes('filesafe.space')) {
    return url;
  }
  
  // Return original URL for other formats
  return url;
};

export default function VehicleDetail() {
  const { slug } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const { data: vehicle, isLoading, error } = useQuery({
    queryKey: [`/api/vehicles/${slug}`],
    queryFn: () => api.vehicles.getBySlug(slug!)
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Skeleton className="h-80 w-full rounded-xl mb-4" />
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-24 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 flex-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Vehicle Not Found</h1>
          <p className="text-gray-600 mb-6">The vehicle you're looking for doesn't exist or has been sold.</p>
          <Link href="/inventory">
            <Button>Back to Inventory</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const seoTitle = vehicle.metaTitle || `${vehicle.year} ${vehicle.make} ${vehicle.model} for Sale in Richmond IN | T-Rex Motors`;
  const seoDescription = vehicle.metaDescription || `Buy this ${vehicle.year} ${vehicle.make} ${vehicle.model} with ${vehicle.mileage} miles for $${vehicle.price.toLocaleString()} at T-Rex Motors Richmond, IN. Quality used car, financing available, 360° virtual tour.`;
  const seoKeywords = [
    `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    `used ${vehicle.make} Richmond IN`,
    `${vehicle.model} for sale`,
    `T-Rex Motors inventory`,
    `${vehicle.exteriorColor} ${vehicle.make}`,
    `used cars Richmond Indiana`,
    `pre-owned ${vehicle.make} ${vehicle.model}`,
    `car dealership Richmond IN`,
    `${vehicle.make} dealer near me`,
    `quality used vehicles`
  ];

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonicalUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/vehicle/${vehicle.slug}`}
        ogImage={getWorkingImageUrl(vehicle.images?.[0]) || "/icon-512.png"}
        ogType="product"
        vehicle={{
          year: vehicle.year,
          make: vehicle.make,
          model: vehicle.model,
          price: vehicle.price,
          mileage: vehicle.mileage,
          vin: vehicle.vin || "",
          stockNumber: vehicle.stockNumber || "",
          images: vehicle.images?.map(getWorkingImageUrl) || [],
          description: vehicle.description,
          exteriorColor: vehicle.exteriorColor,
          interiorColor: vehicle.interiorColor,
          transmission: vehicle.transmission || "Automatic",
          engine: vehicle.engine || "V6",
          driveType: vehicle.driveType || "FWD"
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <Link href="/inventory">
            <Button variant="ghost" className="mb-6 hover:bg-white/50 transition-all duration-300 backdrop-blur-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Inventory
            </Button>
          </Link>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">{vehicle.title}</h1>
                <Badge variant={vehicle.status === "for-sale" ? "default" : "secondary"} className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
                  {vehicle.status === "for-sale" ? "Available" : vehicle.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Gallery & 360° Virtual Showroom */}
                <div>
                  {vehicle.images && vehicle.images.length > 0 ? (
                    <Tabs defaultValue="gallery" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="gallery" className="text-sm">
                          📷 Photo Gallery
                        </TabsTrigger>
                        <TabsTrigger value="360" className="text-sm">
                          🔄 360° Virtual Tour
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="gallery" className="space-y-4">
                        <div className="relative h-80 rounded-xl overflow-hidden shadow-lg">
                          <img 
                            src={getWorkingImageUrl(vehicle.images[selectedImageIndex])} 
                            alt={`${vehicle.title} - Image ${selectedImageIndex + 1}`}
                            className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                            {selectedImageIndex + 1} / {vehicle.images.length}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          {vehicle.images.map((image, index) => (
                            <div 
                              key={index}
                              className={`h-24 rounded-lg cursor-pointer border-2 transition-all duration-300 transform hover:scale-105 overflow-hidden ${
                                selectedImageIndex === index 
                                  ? "border-green-500 shadow-lg scale-105" 
                                  : "border-transparent hover:border-green-300 shadow-md"
                              }`}
                              onClick={() => setSelectedImageIndex(index)}
                            >
                              <img 
                                src={getWorkingImageUrl(image)} 
                                alt={`${vehicle.title} thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="360" className="space-y-4">
                        <Vehicle360Viewer 
                          images={vehicle.images.map(img => getWorkingImageUrl(img))}
                          vehicleTitle={vehicle.title}
                          autoPlay={false}
                          speed={200}
                          className="h-80"
                        />
                        <div className="text-center text-sm text-gray-600 bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-100">
                          <div className="font-semibold text-green-700 mb-2">🚗 Interactive Virtual Showroom Experience</div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                            <div>🖱️ <strong>Drag</strong> to rotate view</div>
                            <div>⏯️ <strong>Space</strong> to auto-rotate</div>
                            <div>🔍 <strong>F</strong> for fullscreen</div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="h-80 rounded-xl bg-gray-100 flex items-center justify-center shadow-lg">
                      <div className="text-center text-gray-500">
                        <div className="h-20 w-20 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 text-3xl">🚗</span>
                        </div>
                        <p className="text-lg font-medium">No Images Available</p>
                        <p className="text-sm text-gray-400 mt-2">Contact us for more photos of this vehicle</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Vehicle Details */}
                <div>
                  <div className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-100">
                    <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-3">
                      ${vehicle.price.toLocaleString()}
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed">{vehicle.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Vehicle Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Year:</span>
                          <span className="font-medium">{vehicle.year}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Make:</span>
                          <span className="font-medium">{vehicle.make}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Model:</span>
                          <span className="font-medium">{vehicle.model}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mileage:</span>
                          <span className="font-medium">{vehicle.mileage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Engine:</span>
                          <span className="font-medium">{vehicle.engine}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transmission:</span>
                          <span className="font-medium">{vehicle.transmission}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Drive Type:</span>
                          <span className="font-medium">{vehicle.driveType}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Exterior/Interior</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Exterior Color:</span>
                          <span className="font-medium">{vehicle.exteriorColor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Interior Color:</span>
                          <span className="font-medium">{vehicle.interiorColor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="font-medium text-green-600 capitalize">{vehicle.status.replace("-", " ")}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Key Features</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {vehicle.keyFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <Check className="w-4 h-4 text-green-500 mr-2" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <a href="tel:765-238-2887" className="flex-1">
                        <Button size="lg" className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                          <Phone className="w-4 h-4 mr-2" />
                          Call (765) 238-2887
                        </Button>
                      </a>
                      <Button size="lg" variant="outline" className="flex-1 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 hover:border-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Inquiry
                      </Button>
                    </div>
                    
                    <VehicleHistoryReports
                      vin={vehicle.vin || ""}
                      vehicleTitle={vehicle.title}
                      carfaxEmbedCode={vehicle.carfaxEmbedCode || null}
                      autoCheckUrl={vehicle.autoCheckUrl || null}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Financing Calculator and Contact Section */}
          <div className="mt-16">
            <Tabs defaultValue="calculator" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl p-2">
                <TabsTrigger value="calculator" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white transition-all duration-300 rounded-lg">
                  <Calculator className="w-4 h-4" />
                  Payment Calculator
                </TabsTrigger>
                <TabsTrigger value="contact" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white transition-all duration-300 rounded-lg">
                  <Mail className="w-4 h-4" />
                  Contact Us
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="calculator" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Calculate Your Monthly Payment</h2>
                    <p className="text-gray-600 mb-6">
                      Use our financing calculator to estimate your monthly payments for this {vehicle.year} {vehicle.make} {vehicle.model}.
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Financing Benefits:</h3>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Competitive interest rates starting at 2.9% APR</li>
                        <li>• Flexible loan terms up to 84 months</li>
                        <li>• Quick approval process</li>
                        <li>• No prepayment penalties</li>
                      </ul>
                    </div>
                  </div>
                  <FinancingCalculator vehiclePrice={vehicle.price} />
                </div>
              </TabsContent>
              
              <TabsContent value="contact" className="mt-6">
                <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 rounded-2xl p-8 shadow-2xl">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="text-white">
                      <h2 className="text-2xl md:text-3xl font-bold mb-4">Interested in this {vehicle.year} {vehicle.make} {vehicle.model}?</h2>
                      <p className="text-lg opacity-90 mb-6">
                        Get more information or schedule a test drive. Our team will respond within 2 hours.
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <Phone className="w-5 h-5 mr-3" />
                          <span className="font-semibold">(765) 238-2887</span>
                        </div>
                        <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <Mail className="w-5 h-5 mr-3" />
                          <span className="font-semibold">info@trexmotors.com</span>
                        </div>
                      </div>
                    </div>
                    <VehicleContactForm vehicle={vehicle} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
