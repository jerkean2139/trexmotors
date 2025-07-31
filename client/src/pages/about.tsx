import { Helmet } from "react-helmet-async";
import { ArrowLeft, Users, Award, Shield, Clock } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>About T-Rex Motors - Richmond, IN's Premier Used Car Dealership</title>
        <meta 
          name="description" 
          content="Learn about T-Rex Motors, Richmond Indiana's trusted used car dealership since founding. Family-owned business serving Wayne County with quality pre-owned vehicles, financing, and exceptional customer service."
        />
        <meta name="keywords" content="T-Rex Motors Richmond IN, used car dealership Wayne County, about us, family owned dealership, Richmond Indiana cars" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="About T-Rex Motors - Richmond, IN's Premier Used Car Dealership" />
        <meta property="og:description" content="Family-owned used car dealership in Richmond, Indiana. Quality vehicles, honest service, and community commitment since our founding." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://trex-motors.com/about" />
        <meta property="og:image" content="https://trex-motors.com/og-about.jpg" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="T-Rex Motors" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About T-Rex Motors - Richmond, IN Used Cars" />
        <meta name="twitter:description" content="Family-owned dealership serving Richmond, Indiana with quality used vehicles and exceptional service." />
        <meta name="twitter:image" content="https://trex-motors.com/twitter-about.jpg" />
        
        {/* Local Business Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AutoDealer",
            "name": "T-Rex Motors",
            "description": "Premier used car dealership in Richmond, Indiana",
            "url": "https://trex-motors.com",
            "telephone": "765-238-2887",
            "email": "info@trexmotors.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "1300 South 9th St",
              "addressLocality": "Richmond",
              "addressRegion": "IN",
              "postalCode": "47374",
              "addressCountry": "US"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "39.8289",
              "longitude": "-84.8907"
            },
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "18:00"
              },
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Saturday",
                "opens": "09:00",
                "closes": "17:00"
              }
            ],
            "priceRange": "$$",
            "paymentAccepted": ["Cash", "Credit Card", "Financing"],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Used Vehicle Inventory",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Car",
                    "name": "Quality Pre-Owned Vehicles"
                  }
                }
              ]
            },
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
                "name": "About Us",
                "item": "https://trex-motors.com/about"
              }
            ]
          })}
        </script>
      </Helmet>

      <Header />
      
      <main className="flex-1 bg-gradient-to-br from-gray-50 to-white">
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
        <section className="container mx-auto px-4 pb-12">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-green-600">T-Rex Motors</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Richmond, Indiana's trusted used car dealership, serving Wayne County with 
              quality pre-owned vehicles and exceptional customer service.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    T-Rex Motors was founded with a simple mission: to provide Richmond, Indiana 
                    and the surrounding Wayne County community with quality used vehicles at fair prices, 
                    backed by honest service and genuine care for our customers.
                  </p>
                  <p>
                    As a family-owned business, we understand the importance of trust when making 
                    one of life's biggest purchases. Every vehicle in our inventory is carefully 
                    selected and thoroughly inspected to ensure you're getting reliable transportation 
                    that fits your budget and lifestyle.
                  </p>
                  <p>
                    Located at 1300 South 9th Street in Richmond, we're proud to be part of this 
                    vibrant community and committed to building lasting relationships with our customers 
                    through transparency, integrity, and exceptional service.
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-50 p-8 rounded-2xl">
                <div className="text-center">
                  <div className="inline-block p-4 bg-green-600 rounded-full mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Family Owned</h3>
                  <p className="text-gray-600">
                    Built on family values and community commitment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose T-Rex Motors?</h2>
              <p className="text-xl text-gray-600">
                We're committed to making your car buying experience exceptional
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="text-center border-green-100 hover:border-green-200 transition-colors">
                <CardHeader>
                  <div className="inline-block p-3 bg-green-100 rounded-full mb-4 mx-auto">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-green-900">Quality Vehicles</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    Every vehicle is carefully inspected and selected for reliability, 
                    safety, and value to ensure you get the best possible car.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border-green-100 hover:border-green-200 transition-colors">
                <CardHeader>
                  <div className="inline-block p-3 bg-green-100 rounded-full mb-4 mx-auto">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-green-900">Honest Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    No pressure, no games, no hidden fees. We believe in transparent 
                    pricing and honest communication throughout your buying experience.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border-green-100 hover:border-green-200 transition-colors">
                <CardHeader>
                  <div className="inline-block p-3 bg-green-100 rounded-full mb-4 mx-auto">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-green-900">Local Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    As your neighbors in Richmond, we're here for you long after 
                    your purchase. Local support you can count on.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Vehicle?</h2>
            <p className="text-xl mb-8 text-green-100">
              Visit our lot at 1300 South 9th Street in Richmond, or browse our inventory online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/inventory">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                  View Inventory
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-green-700 hover:border-green-700 hover:text-white transition-all duration-300">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}