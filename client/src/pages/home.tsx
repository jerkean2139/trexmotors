import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Shield, Handshake, CreditCard, MapPin, Phone, Mail, Search } from "lucide-react";
import Header from "@/components/header";
import Hero from "@/components/hero";
import VehicleSearch from "@/components/vehicle-search";
import VehicleCard from "@/components/vehicle-card";
import ContactForm from "@/components/contact-form";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Link } from "wouter";
import SEOHead from "@/components/seo-head";

export default function Home() {
  const [filteredVehicles, setFilteredVehicles] = useState<any[]>([]);
  
  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["/api/vehicles"],
    queryFn: async () => {
      try {
        // Try API first
        return await api.vehicles.getAll();
      } catch (apiError) {
        console.warn('🚨 API failed, using static fallback:', apiError.message);
        
        // Fallback to static JSON file
        const fallbackResponse = await fetch('/api/vehicles.json');
        if (fallbackResponse.ok) {
          const allVehicles = await fallbackResponse.json();
          console.log(`📊 Static fallback: ${allVehicles.length} vehicles loaded`);
          return allVehicles;
        }
        
        throw new Error('Both API and fallback failed');
      }
    }
  });

  // Sort vehicles by creation date (newest first) and show NEW banners at top
  const sortedVehicles = vehicles ? [...vehicles].sort((a, b) => {
    // First sort by NEW banner status (NEW banners first)
    if (a.bannerNew && !b.bannerNew) return -1;
    if (!a.bannerNew && b.bannerNew) return 1;
    
    // Then sort by creation date (newest first)
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  }) : [];

  // Show sorted vehicles by default, filtered vehicles when search is used
  const displayVehicles = filteredVehicles.length > 0 ? filteredVehicles : sortedVehicles;

  const handleSearch = async (filters: any) => {
    if (!vehicles) return;
    
    let filtered = vehicles;
    
    if (filters.make) {
      filtered = filtered.filter(v => v.make.toLowerCase().includes(filters.make.toLowerCase()));
    }
    if (filters.model) {
      filtered = filtered.filter(v => v.model.toLowerCase().includes(filters.model.toLowerCase()));
    }
    if (filters.year) {
      filtered = filtered.filter(v => v.year === filters.year);
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(v => v.price <= filters.maxPrice);
    }
    
    setFilteredVehicles(filtered);
  };

  return (
    <>
      <SEOHead
        title="T-Rex Motors - #1 Used Car Dealer Richmond IN | Quality Pre-Owned Vehicles"
        description={`Find your perfect used car at T-Rex Motors Richmond, IN. ${vehicles?.length || 'Quality'} pre-owned vehicles with 360° virtual tours, competitive prices, and financing. Call 765-238-2887 today!`}
        keywords={[
          "used cars Richmond IN",
          "T-Rex Motors Richmond", 
          "pre-owned vehicles Indiana",
          "car dealership Richmond IN",
          "auto sales Wayne County",
          "quality used cars Richmond",
          "car financing Richmond Indiana",
          "used car lots Richmond IN",
          "certified pre-owned Richmond",
          "automotive dealer Richmond"
        ]}
        canonicalUrl={typeof window !== 'undefined' ? window.location.origin : ''}
        localBusiness={true}
      />
      
      <div className="min-h-screen bg-light-section">
        <Header />
        <Hero />
        
        {/* Vehicle Search and Complete Inventory */}
        <section className="py-20 bg-white relative -mt-20 z-10">
          <div className="container mx-auto px-4">
            {/* Search Section */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 mb-12">
              <VehicleSearch onSearch={handleSearch} />
            </div>
            
            {/* Current Inventory Header */}
            <div className="text-center mb-16">
              <h2 className="heading-font text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                CURRENT <span className="text-green-600">INVENTORY</span>
              </h2>
              <p className="content-font text-xl text-gray-600 max-w-3xl mx-auto font-light">
                Browse our complete selection of quality used vehicles. Each car undergoes thorough inspection and comes with transparent pricing.
              </p>
            </div>

            {/* All Vehicles Grid */}
            {isLoading ? (
              <div className="text-center text-lg">Loading our inventory...</div>
            ) : displayVehicles.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-2xl text-gray-600 mb-4">No vehicles found matching your search criteria</div>
                <Button 
                  onClick={() => setFilteredVehicles([])} 
                  variant="outline" 
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  Clear Search
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {displayVehicles.map((vehicle: any) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>
                
                {/* Results Summary */}
                <div className="text-center mt-12 p-6 bg-gray-50 rounded-lg">
                  <p className="text-lg text-gray-600">
                    Showing <span className="font-semibold text-green-600">{displayVehicles.length}</span> 
                    {filteredVehicles.length > 0 ? ' filtered' : ''} vehicle{displayVehicles.length !== 1 ? 's' : ''}
                    {filteredVehicles.length > 0 && (
                      <Button 
                        onClick={() => setFilteredVehicles([])} 
                        variant="link" 
                        className="text-green-600 underline ml-2"
                      >
                        Show All ({vehicles?.length || 0})
                      </Button>
                    )}
                  </p>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-light-section">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="heading-font text-4xl md:text-5xl font-bold text-gray-800 mb-6">Why Richmond Trusts T-Rex Motors</h2>
              <p className="content-font text-xl text-gray-600 max-w-3xl mx-auto font-light">
                We've built our reputation on quality, transparency, and exceptional customer service. Here's what sets us apart from other dealerships.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="heading-font text-xl font-bold text-gray-800 mb-4">Quality Inspected</h3>
                <p className="content-font text-gray-600">Every vehicle undergoes a comprehensive 150-point inspection before sale</p>
              </div>

              <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Handshake className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="heading-font text-xl font-bold text-gray-800 mb-4">No-Haggle Pricing</h3>
                <p className="content-font text-gray-600">Transparent, competitive pricing with no hidden fees or surprises</p>
              </div>

              <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="heading-font text-xl font-bold text-gray-800 mb-4">Easy Financing</h3>
                <p className="content-font text-gray-600">Flexible financing options with competitive rates for all credit types</p>
              </div>
            </div>
          </div>
        </section>



        {/* Contact Section */}
        <section id="contact" className="py-20 bg-dark-section">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <h2 className="heading-font text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Next Car?</h2>
                <p className="content-font text-xl mb-8 opacity-90 font-light">
                  Contact us today or visit our showroom in Richmond, IN. Our friendly team is ready to help you find the perfect vehicle.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="w-6 h-6 mr-4" />
                    <div>
                      <div className="font-semibold">1300 South 9th St</div>
                      <div className="opacity-90">Richmond, IN 47374</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="w-6 h-6 mr-4" />
                    <div>
                      <div className="font-semibold">(765) 238-2887</div>
                      <div className="opacity-90">Mon-Fri: 10am-6pm, Sat: 10am-4pm, Sun: Closed</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="w-6 h-6 mr-4" />
                    <div>
                      <div className="font-semibold">info@trexmotors.com</div>
                      <div className="opacity-90">We respond within 2 hours</div>
                    </div>
                  </div>
                </div>
              </div>

              <ContactForm />
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
