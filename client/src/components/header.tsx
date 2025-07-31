import { Link, useLocation } from "wouter";
import { Car, Phone, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  const Navigation = () => (
    <nav className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0">
      <Link href="/" className={`heading-font font-medium transition-colors ${isActive("/") ? "text-green-600" : "text-gray-700 hover:text-green-600"}`}>
        Home
      </Link>
      <Link href="/inventory" className={`heading-font font-medium transition-colors ${isActive("/inventory") ? "text-green-600" : "text-gray-700 hover:text-green-600"}`}>
        Inventory
      </Link>
      <Link href="/financing" className={`heading-font font-medium transition-colors ${isActive("/financing") ? "text-green-600" : "text-gray-700 hover:text-green-600"}`}>
        Financing
      </Link>
      <Link href="/about" className={`heading-font font-medium transition-colors ${isActive("/about") ? "text-green-600" : "text-gray-700 hover:text-green-600"}`}>
        About Us
      </Link>
      <Link href="/contact" className={`heading-font font-medium transition-colors ${isActive("/contact") ? "text-green-600" : "text-gray-700 hover:text-green-600"}`}>
        Contact
      </Link>
    </nav>
  );

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          <Link href="/" className="flex items-center">
            <img 
              src="https://storage.googleapis.com/msgsndr/QjiQRR74D1pxPF7I8fcC/media/68042afc29d629c59c352a2b.png" 
              alt="T-Rex Motors Logo" 
              className="w-[180px] sm:w-[200px] md:w-[240px] lg:w-[280px] xl:w-[300px] h-auto"
            />
          </Link>
          
          <div className="hidden md:block ml-8">
            <Navigation />
          </div>

          <div className="flex items-center space-x-4">
            <a href="tel:765-238-2887" className="hidden sm:flex items-center text-green-600 font-semibold heading-font whitespace-nowrap">
              <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>(765) 238-2887</span>
            </a>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="mt-6">
                  <Navigation />
                  <div className="mt-6 pt-6 border-t">
                    <a href="tel:765-238-2887" className="flex items-center text-green-600 font-semibold">
                      <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>(765) 238-2887</span>
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
