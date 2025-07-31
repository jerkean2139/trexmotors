// GHL/Lead Connector integration removed - now using internal contact forms and applications

export default function SurveyForm() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg p-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Us Today</h3>
        <p className="text-gray-600 mb-6">
          Ready to find your perfect vehicle? Contact us directly using our contact form or apply for financing.
        </p>
        <div className="space-y-4">
          <a 
            href="/contact" 
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Contact Us
          </a>
          <br />
          <a 
            href="/application" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Apply for Financing
          </a>
        </div>
      </div>
    </div>
  );
}