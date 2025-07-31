import { Button } from "@/components/ui/button";
import { Search, Calculator } from "lucide-react";
import { Link } from "wouter";

export default function Hero() {
  return (
    <section className="relative h-[500px] sm:h-[600px] md:h-[700px] overflow-hidden bg-dark-section">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30" 
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')`
        }}
      />
      
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-4xl text-white">
          <h1 className="heading-font text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 md:mb-8 leading-tight">
            Find Your Perfect Car at T-Rex Motors
          </h1>
          <p className="content-font text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 md:mb-12 opacity-95 max-w-3xl font-light">
            Richmond, IN's premier destination for quality used vehicles. Over 15 years of trusted service with transparent pricing and easy financing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <Link href="/inventory">
              <Button size="lg" className="btn-primary-green px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-semibold shadow-2xl heading-font w-full sm:w-auto">
                <Search className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                Browse Our Inventory
              </Button>
            </Link>
            <a href="https://trexmotors.com/application" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-semibold heading-font w-full sm:w-auto">
                <Calculator className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                Get Pre-Approved
              </Button>
            </a>
            <Link href="/financing">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-semibold shadow-2xl heading-font w-full sm:w-auto">
                Calculate Payment
              </Button>
            </Link>
          </div>
          
          {/* Stats section - hidden on small screens to prevent overlap */}
          <div className="hidden sm:grid grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-16 max-w-2xl">
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">15+</div>
              <div className="text-sm md:text-lg opacity-90">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">500+</div>
              <div className="text-sm md:text-lg opacity-90">Cars Sold</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">100%</div>
              <div className="text-sm md:text-lg opacity-90">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
