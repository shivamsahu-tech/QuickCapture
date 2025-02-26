export default function TermsPage() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-2xl">
          <h1 className="text-3xl font-bold mb-4 text-center">Terms & Conditions</h1>
          
          <p className="text-gray-700 mb-4">
            Welcome to our platform. By using our services, you agree to the following terms and conditions.
          </p>
  
          <h2 className="text-xl font-semibold mt-4">1. Use of Service</h2>
          <p className="text-gray-600">
            Our platform allows users to manage and store notes. The "Buy a Coffee" feature is for voluntary contributions.
          </p>
  
          <h2 className="text-xl font-semibold mt-4">2. Payments</h2>
          <p className="text-gray-600">
            Payments made via Razorpay are processed securely. We do not store any payment details.
          </p>
  
          <h2 className="text-xl font-semibold mt-4">3. Refund Policy</h2>
          <p className="text-gray-600">
            Donations made through "Buy a Coffee" are non-refundable.
          </p>
  
          <h2 className="text-xl font-semibold mt-4">4. Changes to Terms</h2>
          <p className="text-gray-600">
            We reserve the right to update these terms at any time. Users will be notified of significant changes.
          </p>
  
          <p className="text-gray-600 mt-6">
            If you have any questions, please <a href="/contact" className="text-blue-500 underline">contact us</a>.
          </p>
        </div>
      </div>
    );
  }
  