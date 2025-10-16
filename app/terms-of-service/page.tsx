'use client';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using SAFISAANA ("the Service"), you accept and agree to be bound by the terms and conditions of this agreement. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
              <p className="mb-4">
                SAFISAANA provides a platform for managing and selling digital products, including but not limited to plugins, e-books, and online courses. The Service allows users to list, sell, and distribute digital products to customers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
              <p className="mb-4">
                To access certain features of the Service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Product Listings and Sales</h2>
              <p className="mb-4">
                When listing products on SAFISAANA, you agree to provide accurate and complete information. You are solely responsible for the content you upload and the products you sell. We reserve the right to remove any content that violates our policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Payment and Fees</h2>
              <p className="mb-4">
                SAFISAANA charges a transaction fee for sales made through the platform. All fees are clearly displayed during the checkout process. You are responsible for paying all applicable taxes and fees associated with your use of the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Refund Policy</h2>
              <p className="mb-4">
                Due to the digital nature of our products, all sales are final. We do not offer refunds for digital downloads. If you experience any issues with your purchase, please contact our support team for assistance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
              <p className="mb-4">
                All content included on the Service, including text, graphics, logos, and software, is the property of SAFISAANA or its content suppliers and protected by international copyright laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
              <p className="mb-4">
                In no event shall SAFISAANA be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
              <p className="mb-4">
                We reserve the right to modify these terms at any time. We will provide notice of any changes by posting the new Terms of Service on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="mt-2">
                Email: support@safisaana.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
