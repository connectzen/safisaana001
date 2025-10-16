'use client';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="mb-4">
                Welcome to SAFISAANA. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
              <p className="mb-4">We may collect, use, store, and transfer different kinds of personal data about you, including:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Identity Data (name, username, or similar identifier)</li>
                <li>Contact Data (billing address, email address, and telephone numbers)</li>
                <li>Financial Data (payment card details)</li>
                <li>Transaction Data (details about payments and products you've purchased)</li>
                <li>Technical Data (IP address, login data, browser type and version)</li>
                <li>Usage Data (how you use our website and services)</li>
                <li>Marketing and Communications Data (your preferences in receiving marketing)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Data</h2>
              <p className="mb-4">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>To register you as a new customer</li>
                <li>To process and deliver your orders</li>
                <li>To manage our relationship with you</li>
                <li>To enable you to participate in promotions or complete surveys</li>
                <li>To improve our website, products/services, and customer relationships</li>
                <li>To recommend products or services that may be of interest to you</li>
                <li>To comply with legal or regulatory requirements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
              <p className="mb-4">
                We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. We limit access to your personal data to those employees and other third parties who have a business need to know.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
              <p className="mb-4">
                We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Your Legal Rights</h2>
              <p className="mb-4">Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Request access to your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
                <li>Request transfer of your personal data</li>
                <li>Right to withdraw consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Third-Party Links</h2>
              <p className="mb-4">
                Our website may include links to third-party websites, plug-ins, and applications. Clicking on those links may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Cookies</h2>
              <p className="mb-4">
                Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Refund Policy</h2>
              <p className="mb-4">
                For information about refunds and returns, please refer to our <a href="/refund-policy" className="text-blue-600 hover:underline">Refund Policy</a>. We offer a 30-day money-back guarantee on all digital products.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Updates to This Policy</h2>
              <p className="mb-4">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date at the top of this document.
              </p>
              <p>
                For any questions about this privacy policy, please email us at <a href="mailto:privacy@safisaana.com" className="text-blue-600 hover:underline">privacy@safisaana.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
