import { Car } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-light-section text-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <img 
                src="https://storage.googleapis.com/msgsndr/QjiQRR74D1pxPF7I8fcC/media/68042afc29d629c59c352a2b.png" 
                alt="T-Rex Motors Logo" 
                className="h-16 w-auto"
              />
            </div>
            <p className="content-font text-gray-600 mb-4">
              Your trusted partner for quality used cars in Richmond, IN since 2008.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-600">
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-green-600">
                <i className="fab fa-google text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-green-600">
                <i className="fab fa-yelp text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-black">
              <li><Link href="/inventory" className="hover:text-green-600">Inventory</Link></li>
              <li><a href="#financing" className="hover:text-green-600">Financing</a></li>
              <li><a href="#about" className="hover:text-green-600">About Us</a></li>
              <li><a href="#contact" className="hover:text-green-600">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-black">
              <li><a href="#" className="hover:text-green-600">Vehicle Inspection</a></li>
              <li><a href="#" className="hover:text-green-600">Trade-In Appraisal</a></li>
              <li><a href="#" className="hover:text-green-600">Extended Warranties</a></li>
              <li><a href="#" className="hover:text-green-600">Service Center</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-black">
              <div>1300 South 9th St</div>
              <div>Richmond, IN 47374</div>
              <div>(765) 238-2887</div>
              <div>info@trexmotors.com</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 T-Rex Motors. All rights reserved. | <Link href="/privacy" className="hover:text-green-600">Privacy Policy</Link> | <Link href="/terms" className="hover:text-green-600">Terms of Service</Link></p>
          <p className="mt-2 text-sm">
            Website designed and hosted by{' '}
            <a 
              href="https://keanonbiz.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 underline transition-colors"
            >
              keanonbiz.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
