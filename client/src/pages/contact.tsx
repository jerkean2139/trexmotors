import { Helmet } from "react-helmet-async";
import { ArrowLeft, Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ContactForm from "@/components/contact-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Contact T-Rex Motors - Richmond, IN Used Car Dealership | 765-238-2887</title>
        <meta 
          name="description" 
          content="Contact T-Rex Motors in Richmond, Indiana. Call 765-238-2887, visit us at 1300 South 9th St, or email info@trexmotors.com. Get directions, hours, and connect with our team today."
        />
        <meta name="keywords" content="contact T-Rex Motors, Richmond IN car dealer phone, 765-238-2887, 1300 South 9th Street, hours location directions" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Contact T-Rex Motors - Richmond, IN Used Car Dealership" />
        <meta property="og:description" content="Get in touch with T-Rex Motors. Located at 1300 South 9th St, Richmond, IN. Call 765-238-2887 or email info@trexmotors.com" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://trex-motors.com/contact" />
        <meta property="og:image" content="https://trex-motors.com/og-contact.jpg" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="T-Rex Motors" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact T-Rex Motors - Richmond, IN" />
        <meta name="twitter:description" content="Visit, call, or email T-Rex Motors in Richmond, Indiana. Quality used cars with honest service." />
        <meta name="twitter:image" content="https://trex-motors.com/twitter-contact.jpg" />
        
        {/* Local Business Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["AutoDealer", "LocalBusiness"],
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
              },
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Sunday",
                "opens": "12:00",
                "closes": "16:00"
              }
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "765-238-2887",
              "contactType": "sales",
              "areaServed": "US-IN",
              "availableLanguage": "English"
            },
            "sameAs": [
              "https://www.facebook.com/trexmotorsrichmond",
              "https://www.google.com/maps/place/T-Rex+Motors"
            ]
          })}
        </script>
        
        {/* FAQ Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What are T-Rex Motors' hours?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Monday-Friday: 9:00 AM - 6:00 PM, Saturday: 9:00 AM - 5:00 PM, Sunday: 12:00 PM - 4:00 PM"
                }
              },
              {
                "@type": "Question",
                "name": "Where is T-Rex Motors located?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "T-Rex Motors is located at 1300 South 9th Street, Richmond, IN 47374"
                }
              },
              {
                "@type": "Question",
                "name": "What is T-Rex Motors' phone number?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You can reach us at 765-238-2887"
                }
              }
            ]
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
                "name": "Contact",
                "item": "https://trex-motors.com/contact"
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
              Contact <span className="text-green-600">T-Rex Motors</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Ready to find your next vehicle? Get in touch with Richmond's trusted used car dealership.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="text-center border-green-100 hover:border-green-200 transition-colors">
                <CardHeader>
                  <div className="inline-block p-3 bg-green-100 rounded-full mb-4 mx-auto">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-green-900">Call Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    <a href="tel:765-238-2887" className="text-lg font-semibold text-green-600 hover:text-green-700">
                      765-238-2887
                    </a>
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border-green-100 hover:border-green-200 transition-colors">
                <CardHeader>
                  <div className="inline-block p-3 bg-green-100 rounded-full mb-4 mx-auto">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-green-900">Email Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    <a href="mailto:info@trexmotors.com" className="text-lg font-semibold text-green-600 hover:text-green-700">
                      info@trexmotors.com
                    </a>
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border-green-100 hover:border-green-200 transition-colors">
                <CardHeader>
                  <div className="inline-block p-3 bg-green-100 rounded-full mb-4 mx-auto">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-green-900">Visit Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    <a 
                      href="https://maps.google.com/?q=1300+South+9th+St+Richmond+IN+47374" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-green-600 hover:text-green-700"
                    >
                      1300 South 9th St<br />
                      Richmond, IN 47374
                    </a>
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border-green-100 hover:border-green-200 transition-colors">
                <CardHeader>
                  <div className="inline-block p-3 bg-green-100 rounded-full mb-4 mx-auto">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-green-900">Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-sm">
                    <div className="space-y-1">
                      <div>Mon-Fri: 9AM-6PM</div>
                      <div>Saturday: 9AM-5PM</div>
                      <div>Sunday: 12PM-4PM</div>
                    </div>
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Form and Map */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div>
                  <div className="mb-8">
                    <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                      <MessageSquare className="h-6 w-6 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
                    <p className="text-gray-600">
                      Have questions about a specific vehicle or need more information? 
                      Fill out the form below and we'll get back to you promptly.
                    </p>
                  </div>
                  <ContactForm />
                </div>

                {/* Map and Directions */}
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Find Our Location</h2>
                  
                  {/* Embedded Map */}
                  <div className="bg-gray-100 rounded-lg h-64 mb-6 flex items-center justify-center">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.8889!2d-84.8907!3d39.8289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDQ5JzQ0LjAiTiA4NMKwNTMnMjYuNSJX!5e0!3m2!1sen!2sus!4v1640000000000!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0, borderRadius: '0.5rem' }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="T-Rex Motors Location"
                    />
                  </div>

                  {/* Directions */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">Directions</h3>
                    <div className="text-gray-600 space-y-2">
                      <p>
                        <strong>From I-70:</strong> Take Exit 156A toward Richmond/US-27 S. 
                        Continue on US-27 S for 2.5 miles, then turn right onto S 9th St. 
                        We'll be on your right.
                      </p>
                      <p>
                        <strong>From Downtown Richmond:</strong> Head south on 9th Street. 
                        We're located just past the intersection with Chester Boulevard.
                      </p>
                    </div>
                    
                    <a 
                      href="https://maps.google.com/?q=1300+South+9th+St+Richmond+IN+47374"
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button className="btn-primary-green">
                        Get Directions
                        <MapPin className="h-4 w-4 ml-2" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-900">Do you offer financing?</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    Yes! We work with multiple lenders to help you secure financing that fits your budget. 
                    Check out our <Link href="/financing" className="text-green-600 hover:text-green-700 font-medium">financing page</Link> for more details.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-green-900">Can I trade in my current vehicle?</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    Absolutely! We accept trade-ins and will provide you with a fair market evaluation. 
                    Bring your vehicle and title when you visit, and we'll assess its value.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-green-900">Do you provide vehicle history reports?</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    Yes, we provide CARFAX or AutoCheck reports for our vehicles. 
                    Vehicle history transparency is important to us, and we want you to have all the information you need.
                  </CardDescription>
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