import { db } from "./db";
import { vehicles } from "@shared/schema";

const sampleVehicles = [
  {
    slug: "2012-cadillac-cts",
    title: "2012 Cadillac CTS",
    description: "American Luxury Performance Sedan",
    price: 12500,
    status: "for-sale",
    mileage: "93,086",
    year: "2012",
    make: "Cadillac",
    model: "CTS",
    engine: "3.0L V6",
    transmission: "6-Speed Automatic",
    driveType: "Rear-Wheel Drive",
    exteriorColor: "Black",
    interiorColor: "Black",
    images: [
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      "https://pixabay.com/get/g8308600abe57b2dfa8f6a38ae7203d1c19aa133e0fcd34d832597ebb21a74195180bfdafab568959b42c27d36bb4f2f7fb51af6ef4dad5b7d05e0bb338432c1e_1280.jpg",
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    keyFeatures: [
      "Leatherette Seats",
      "Bose Premium Audio",
      "Dual A/C Zones"
    ],
    metaTitle: "2012 Cadillac CTS – Luxury Sedan | T-Rex Motors",
    metaDescription: "Used 2012 Cadillac CTS for sale in Richmond, IN with leatherette interior and premium audio.",
    carfaxEmbedCode: null // Will be added by backend when available
  },
  {
    slug: "2018-honda-accord",
    title: "2018 Honda Accord",
    description: "Reliable Midsize Sedan",
    price: 18900,
    status: "for-sale",
    mileage: "42,150",
    year: "2018",
    make: "Honda",
    model: "Accord",
    engine: "1.5L Turbo",
    transmission: "CVT",
    driveType: "Front-Wheel Drive",
    exteriorColor: "Silver",
    interiorColor: "Black",
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    ],
    keyFeatures: [
      "Honda Sensing Safety Suite",
      "Apple CarPlay",
      "Heated Seats"
    ],
    metaTitle: "2018 Honda Accord – Reliable Sedan | T-Rex Motors",
    metaDescription: "Used 2018 Honda Accord for sale in Richmond, IN with Honda Sensing safety features.",
    carfaxEmbedCode: null // Will be added by backend when available
  },
  {
    slug: "2019-toyota-camry",
    title: "2019 Toyota Camry",
    description: "Popular Family Sedan",
    price: 21900,
    status: "for-sale",
    mileage: "28,450",
    year: "2019",
    make: "Toyota",
    model: "Camry",
    engine: "2.5L 4-Cyl",
    transmission: "8-Speed Auto",
    driveType: "Front-Wheel Drive",
    exteriorColor: "White",
    interiorColor: "Gray",
    images: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    ],
    keyFeatures: [
      "Toyota Safety Sense 2.0",
      "Wireless Charging",
      "Premium Audio"
    ],
    metaTitle: "2019 Toyota Camry – Family Sedan | T-Rex Motors",
    metaDescription: "Used 2019 Toyota Camry for sale in Richmond, IN with Toyota Safety Sense 2.0.",
    carfaxEmbedCode: null // Will be added by backend when available
  }
];

async function seedDatabase() {
  try {
    console.log("Seeding database with sample vehicles...");
    
    // Check if vehicles already exist
    const existingVehicles = await db.select().from(vehicles);
    
    if (existingVehicles.length === 0) {
      await db.insert(vehicles).values(sampleVehicles);
      console.log("Sample vehicles added successfully!");
    } else {
      console.log("Database already contains vehicles, skipping seed.");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seedDatabase();