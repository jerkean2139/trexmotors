import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  articleAuthor?: string;
  publishedTime?: string;
  modifiedTime?: string;
  structuredData?: object[];
  localBusiness?: boolean;
  vehicle?: {
    year: string;
    make: string;
    model: string;
    price: number;
    mileage: string;
    vin: string;
    stockNumber: string;
    images: string[];
    description: string;
    exteriorColor: string;
    interiorColor: string;
    transmission: string;
    engine: string;
    driveType: string;
  };
}

export default function SEOHead({
  title = "T-Rex Motors - Used Cars Richmond IN | Quality Pre-Owned Vehicles",
  description = "Find your perfect used car at T-Rex Motors in Richmond, IN. Quality pre-owned vehicles, competitive prices, financing available. Visit our 360° virtual showroom today!",
  keywords = ["used cars Richmond IN", "pre-owned vehicles", "car dealership Richmond", "auto sales Indiana", "quality used cars", "car financing Richmond"],
  canonicalUrl,
  ogImage = "/icon-512.png",
  ogType = "website",
  structuredData = [],
  localBusiness = false,
  vehicle
}: SEOHeadProps) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com';
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : baseUrl);

  // Generate vehicle-specific structured data
  const vehicleStructuredData = vehicle ? {
    "@context": "https://schema.org",
    "@type": "Car",
    "name": `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    "brand": {
      "@type": "Brand",
      "name": vehicle.make
    },
    "model": vehicle.model,
    "vehicleModelDate": vehicle.year,
    "color": vehicle.exteriorColor,
    "vehicleTransmission": vehicle.transmission,
    "vehicleEngine": {
      "@type": "EngineSpecification",
      "name": vehicle.engine
    },
    "driveWheelConfiguration": vehicle.driveType,
    "mileageFromOdometer": {
      "@type": "QuantitativeValue",
      "value": parseInt(vehicle.mileage.replace(/,/g, '')),
      "unitCode": "SMI"
    },
    "vehicleIdentificationNumber": vehicle.vin,
    "offers": {
      "@type": "Offer",
      "price": vehicle.price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "seller": {
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
      }
    },
    "image": vehicle.images.slice(0, 5),
    "description": vehicle.description,
    "url": currentUrl,
    "potentialAction": {
      "@type": "ViewAction",
      "name": "View Vehicle Details",
      "target": currentUrl
    }
  } : null;

  // Local business structured data
  const localBusinessData = localBusiness ? {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "name": "T-Rex Motors",
    "image": `${baseUrl}/icon-512.png`,
    "description": "Premium used car dealership in Richmond, Indiana. Quality pre-owned vehicles with financing options and exceptional customer service.",
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
      "latitude": 39.8289,
      "longitude": -84.8907
    },
    "telephone": "765-238-2887",
    "email": "info@trexmotors.com",
    "url": baseUrl,
    "openingHours": [
      "Mo-Fr 09:00-18:00",
      "Sa 09:00-17:00"
    ],
    "priceRange": "$$",
    "paymentAccepted": ["Cash", "Credit Card", "Financing"],
    "currenciesAccepted": "USD",
    "areaServed": [
      {
        "@type": "City",
        "name": "Richmond",
        "addressRegion": "IN"
      },
      {
        "@type": "State", 
        "name": "Indiana"
      }
    ],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 39.8289,
        "longitude": -84.8907
      },
      "geoRadius": "50000"
    }
  } : null;

  // Organization structured data
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "T-Rex Motors",
    "url": baseUrl,
    "logo": `${baseUrl}/icon-512.png`,
    "sameAs": [
      // Add your social media URLs here when available
      // "https://www.facebook.com/trexmotors",
      // "https://www.instagram.com/trexmotors"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "765-238-2887",
      "contactType": "sales",
      "areaServed": "US",
      "availableLanguage": "English"
    }
  };

  // Breadcrumb structured data for vehicle pages
  const breadcrumbData = vehicle ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem", 
        "position": 2,
        "name": "Inventory",
        "item": `${baseUrl}/inventory`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        "item": currentUrl
      }
    ]
  } : null;

  // Combine all structured data
  const allStructuredData = [
    organizationData,
    localBusinessData,
    vehicleStructuredData,
    breadcrumbData,
    ...structuredData
  ].filter(Boolean);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`} />
      <meta property="og:site_name" content="T-Rex Motors" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="author" content="T-Rex Motors" />
      <meta name="publisher" content="T-Rex Motors" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="1 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Geographic Meta Tags */}
      <meta name="geo.region" content="US-IN" />
      <meta name="geo.placename" content="Richmond, Indiana" />
      <meta name="geo.position" content="39.8289;-84.8907" />
      <meta name="ICBM" content="39.8289, -84.8907" />
      
      {/* Structured Data */}
      {allStructuredData.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="preconnect" href="https://lh3.googleusercontent.com" />
      
      {/* DNS Prefetch for performance */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
    </Helmet>
  );
}