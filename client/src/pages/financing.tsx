import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import FinancingCalculator from "@/components/financing-calculator";
import VehicleCard from "@/components/vehicle-card";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, DollarSign, Clock, Shield, ArrowLeft } from "lucide-react";
import type { Vehicle } from "@shared/schema";

export default function Financing() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const { data: vehicles = [] } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Auto Financing - T-Rex Motors Richmond, IN | Car Loans & Payment Calculator</title>
        <meta 
          name="description" 
          content="Calculate car payments and explore auto financing options at T-Rex Motors in Richmond, IN. Competitive rates, flexible terms, and quick approvals for used car loans. Apply today!"
        />
        <meta name="keywords" content="auto financing Richmond IN, car loans Wayne County, vehicle financing calculator, T-Rex Motors financing, used car loans Indiana" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Auto Financing - T-Rex Motors Richmond, IN" />
        <meta property="og:description" content="Get competitive auto financing at T-Rex Motors. Calculate payments, explore loan options, and get pre-approved for your next vehicle." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://trex-motors.com/financing" />
        <meta property="og:image" content="https://trex-motors.com/og-financing.jpg" />
        
        {/* Local Business Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialService",
            "name": "T-Rex Motors Auto Financing",
            "description": "Auto financing and car loans for used vehicles in Richmond, Indiana",
            "provider": {
              "@type": "AutoDealer",
              "name": "T-Rex Motors",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "1300 South 9th St",
                "addressLocality": "Richmond",
                "addressRegion": "IN",
                "postalCode": "47374"
              },
              "telephone": "765-238-2887"
            },
            "serviceType": "Auto Financing",
            "areaServed": {
              "@type": "Place",
              "name": "Richmond, Indiana and Wayne County"
            }
          })}
        </script>
        
        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://trex-motors.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Financing",
                "item": "https://trex-motors.com/financing"
              }
            ]
          })}
        </script>
      </Helmet>

      <Header />
      
      <main className="flex-1 bg-gray-50">
        {/* Back Navigation */}
        <div className="container mx-auto px-4 pt-6">
          <Link href="/">
            <Button variant="ghost" className="mb-6 text-green-600 hover:text-green-700 hover:bg-green-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Auto Financing Made Simple
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Calculate your monthly payments and explore financing options for your next vehicle.
            </p>
          </div>
        </div>
      </section>

        <section className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-8">
          {/* Financing Calculator */}
          <div>
            <FinancingCalculator 
              vehiclePrice={selectedVehicle?.price || 0} 
              className="sticky top-8"
            />
          </div>

          {/* Content and Vehicle Selection */}
          <div className="space-y-8">
            {/* Financing Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Why Finance with T-Rex Motors?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Competitive Rates</h3>
                    <p className="text-gray-600">We work with multiple lenders to find you the best rates available.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Quick Approval</h3>
                    <p className="text-gray-600">Get pre-approved in minutes with our streamlined process.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Flexible Terms</h3>
                    <p className="text-gray-600">Choose from various loan terms to fit your budget and lifestyle.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Application Section */}
            <Card>
              <CardHeader>
                <CardTitle>Apply for Financing</CardTitle>
                <p className="text-gray-600">Select the vehicle you're interested in and submit your application.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select Vehicle
                  </label>
                  <select 
                    value={selectedVehicle?.id || ""} 
                    onChange={(e) => {
                      const vehicle = vehicles.find(v => v.id === parseInt(e.target.value));
                      setSelectedVehicle(vehicle || null);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Choose a vehicle...</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.title} - ${vehicle.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
                
                {selectedVehicle && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Selected: {selectedVehicle.title}</span>
                      <Badge variant="secondary">${selectedVehicle.price.toLocaleString()}</Badge>
                    </div>
                  </div>
                )}

                <a 
                  href="https://trexmotors.com/application" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button className="w-full btn-primary-green text-white py-3 text-lg">
                    Apply for Financing
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      </main>
      
      <Footer />
    </div>
  );
}