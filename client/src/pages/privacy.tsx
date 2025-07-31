import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Privacy Policy - T-Rex Motors</title>
        <meta name="description" content="Privacy Policy for T-Rex Motors - Your trusted used car dealer in Richmond, Indiana." />
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
          
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Effective Date:</strong> January 1, 2025
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                At T-Rex Motors, we collect information you provide directly to us, such as when you:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Submit an inquiry about a vehicle</li>
                <li>Request financing information</li>
                <li>Contact us via phone, email, or our website</li>
                <li>Visit our dealership location</li>
              </ul>
              <p className="text-gray-700">
                This may include your name, email address, phone number, and information about your vehicle interests.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Respond to your inquiries about vehicles</li>
                <li>Provide customer service and support</li>
                <li>Process financing applications</li>
                <li>Send you updates about vehicles that match your interests</li>
                <li>Improve our services and website experience</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information with:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Financial institutions for financing purposes (with your consent)</li>
                <li>Service providers who assist us in operating our business</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-700">
                We implement appropriate security measures to protect your personal information against unauthorized access, 
                alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Access and update your personal information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt out of marketing communications</li>
                <li>Contact us with questions about your privacy</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Contact Us</h2>
              <p className="text-gray-700">
                If you have questions about this Privacy Policy, please contact us:
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Changes to This Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page with an updated effective date.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}