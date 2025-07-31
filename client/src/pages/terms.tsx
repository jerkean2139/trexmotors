import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Terms of Service - T-Rex Motors</title>
        <meta name="description" content="Terms of Service for T-Rex Motors - Your trusted used car dealer in Richmond, Indiana." />
      </Helmet>
      
      <Header />
      
      <main className="flex-1 bg-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Effective Date:</strong> January 1, 2025
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing and using the T-Rex Motors website and services, you accept and agree to be bound by the 
                terms and provision of this agreement. These terms apply to all visitors, users, and customers.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Vehicle Information</h2>
              <p className="text-gray-700 mb-4">
                T-Rex Motors strives to provide accurate information about our vehicles. However:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Vehicle information is subject to verification and may contain errors</li>
                <li>Prices are subject to change without notice</li>
                <li>Vehicle availability is not guaranteed until purchase</li>
                <li>All vehicles are sold "as-is" unless otherwise specified</li>
                <li>Mileage, features, and condition should be verified in person</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Pricing and Payments</h2>
              <p className="text-gray-700 mb-4">
                All prices listed are subject to the following conditions:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Prices do not include taxes, title, license, and documentation fees</li>
                <li>Financing terms are subject to credit approval</li>
                <li>Trade-in values are estimates and subject to vehicle inspection</li>
                <li>Special offers may have terms and conditions that apply</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Website Use</h2>
              <p className="text-gray-700 mb-4">You agree to use this website only for lawful purposes and in a way that does not:</p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Infringe upon the rights of others</li>
                <li>Restrict or inhibit anyone else's use of the website</li>
                <li>Post or transmit any unlawful, threatening, or inappropriate material</li>
                <li>Attempt to gain unauthorized access to our systems</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Disclaimer of Warranties</h2>
              <p className="text-gray-700">
                This website and all information, content, materials, products, and services included are provided on an 
                "as is" and "as available" basis. T-Rex Motors disclaims all warranties of any kind, whether express or implied.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-700">
                In no event shall T-Rex Motors be liable for any direct, indirect, incidental, special, or consequential 
                damages arising out of or in connection with your use of this website or services.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Governing Law</h2>
              <p className="text-gray-700">
                These terms and conditions are governed by and construed in accordance with the laws of the State of Indiana, 
                and you irrevocably submit to the exclusive jurisdiction of the courts in that state.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Information</h2>
              <p className="text-gray-700">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="text-gray-700">
                  <strong>T-Rex Motors</strong><br />
                  1300 South 9th St<br />
                  Richmond, IN 47374<br />
                  Phone: (765) 238-2887<br />
                  Email: info@trexmotors.com
                </p>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
              <p className="text-gray-700">
                T-Rex Motors reserves the right to change these terms and conditions at any time. Changes will be effective 
                immediately upon posting to the website. Your continued use of the website constitutes acceptance of any changes.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}