import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import VehicleSearch from "@/components/vehicle-search";
import VehicleCard from "@/components/vehicle-card";
import VehicleCard360 from "@/components/vehicle-card-360";
import Footer from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import SEOHead from "@/components/seo-head";

export default function Inventory() {
  const [searchFilters, setSearchFilters] = useState({});
  
  const { data: rawVehicles, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/vehicles/search", searchFilters],
    queryFn: async () => {
      try {
        // Try API search first
        return await api.vehicles.search(searchFilters);
      } catch (apiError) {
        console.warn('🚨 API search failed, using static fallback:', apiError.message);
        
        // Fallback to static JSON file
        const fallbackResponse = await fetch('/api/vehicles.json');
        if (fallbackResponse.ok) {
          const allVehicles = await fallbackResponse.json();
          
          // Apply search filters client-side
          let filtered = allVehicles;
          if (searchFilters.make) {
            filtered = filtered.filter(v => v.make?.toLowerCase().includes(searchFilters.make.toLowerCase()));
          }
          if (searchFilters.model) {
            filtered = filtered.filter(v => v.model?.toLowerCase().includes(searchFilters.model.toLowerCase()));
          }
          if (searchFilters.year) {
            filtered = filtered.filter(v => v.year === searchFilters.year);
          }
          if (searchFilters.maxPrice) {
            filtered = filtered.filter(v => v.price <= searchFilters.maxPrice);
          }
          
          console.log(`📊 Static fallback: ${filtered.length}/${allVehicles.length} vehicles after filters`);
          return filtered;
        }
        
        throw new Error('Both API and fallback failed');
      }
    },
    retry: 1,
    refetchOnMount: true
  });

  // Debug logging
  console.log('🔍 Inventory Debug:', { 
    isLoading, 
    error: error?.message, 
    vehicleCount: rawVehicles?.length || 0,
    searchFilters,
    hasVehicles: !!rawVehicles && rawVehicles.length > 0,
    firstVehicle: rawVehicles?.[0]?.title || 'No vehicles'
  });

  // Emergency fallback - try direct API call if React Query fails
  if (!isLoading && (!rawVehicles || rawVehicles.length === 0)) {
    console.warn('🚨 No vehicles from React Query, attempting direct API call...');
    fetch('/api/vehicles')
      .then(res => res.json())
      .then(data => console.log('📊 Direct API result:', data?.length || 0, 'vehicles'))
      .catch(err => console.error('❌ Direct API failed:', err));
  }

  // Sort vehicles by NEW banner first, then by creation date (newest first)
  const vehicles = rawVehicles ? [...rawVehicles].sort((a, b) => {
    // First sort by NEW banner status (NEW banners first)
    if (a.bannerNew && !b.bannerNew) return -1;
    if (!a.bannerNew && b.bannerNew) return 1;
    
    // Then sort by creation date (newest first)
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  }) : [];

  const handleSearch = (filters: any) => {
    setSearchFilters(filters);
    refetch();
  };

  const vehicleCount = vehicles.length;
  const seoTitle = `${vehicleCount} Quality Used Cars for Sale | T-Rex Motors Richmond, IN`;
  const seoDescription = `Browse ${vehicleCount} quality used cars at T-Rex Motors Richmond, IN. Sedans, SUVs, trucks with 360° virtual tours, competitive prices, and financing. Visit 1300 South 9th St or call 765-238-2887.`;
  const seoKeywords = [
    "used cars Richmond IN",
    "T-Rex Motors inventory", 
    "pre-owned vehicles Wayne County",
    "used car dealer Richmond Indiana",
    "quality used cars for sale",
    "car financing Richmond",
    "used SUVs Richmond IN",
    "used trucks Richmond IN",
    "certified pre-owned vehicles",
    "automotive Richmond Indiana"
  ];

  // Generate ItemList structured data for vehicle inventory
  const vehicleListData = vehicles.length > 0 ? [{
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "T-Rex Motors Vehicle Inventory",
    "description": "Complete inventory of quality used vehicles at T-Rex Motors",
    "numberOfItems": vehicles.length,
    "itemListElement": vehicles.slice(0, 20).map((vehicle, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Car",
        "name": vehicle.title,
        "url": `${typeof window !== 'undefined' ? window.location.origin : ''}/vehicle/${vehicle.slug}`,
        "brand": vehicle.make,
        "model": vehicle.model,
        "vehicleModelDate": vehicle.year,
        "offers": {
          "@type": "Offer",
          "price": vehicle.price,
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        }
      }
    }))
  }] : [];

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonicalUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/inventory`}
        localBusiness={true}
        structuredData={vehicleListData}
      />
      
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
              Our Vehicle Inventory
            </h1>
            <p className="text-xl text-gray-600 text-center mb-8 max-w-2xl mx-auto">
              Browse our complete selection of quality used vehicles. All cars undergo thorough inspection and come with detailed specifications.
            </p>
          </div>
        </div>

        <VehicleSearch onSearch={handleSearch} />
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-6 space-y-4">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-10 w-32" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : vehicles && vehicles.length > 0 ? (
              <>
                <div className="mb-6">
                  <p className="text-gray-600">
                    Showing {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {vehicles.map((vehicle) => {
                    // Use 360° enhanced card for vehicles with 4+ images
                    const use360Card = vehicle.images && vehicle.images.length >= 4;
                    return use360Card ? (
                      <VehicleCard360 key={vehicle.id} vehicle={vehicle} />
                    ) : (
                      <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">No vehicles found matching your criteria.</p>
                <p className="text-gray-500 mt-2">Try adjusting your search filters.</p>
                <div className="mt-4 text-xs text-gray-400">
                  Debug: Loading={isLoading ? 'true' : 'false'}, Error={error?.message || 'none'}, Count={rawVehicles?.length || 0}
                </div>
              </div>  
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
