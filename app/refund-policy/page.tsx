'use client';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Refund Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Digital Products Refund Policy</h2>
              <p className="mb-4">
                At SAFISAANA, we strive to provide high-quality digital products. We understand that sometimes a product may not meet your expectations. This refund policy explains your rights and our obligations regarding refunds.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. 30-Day Money-Back Guarantee</h2>
              <p className="mb-4">
                We offer a 30-day money-back guarantee on all our digital products, including plugins, e-books, and courses. If you are not satisfied with your purchase, you may request a refund within 30 days of the purchase date.
              </p>
              <p className="mb-4">
                To be eligible for a refund, you must meet the following conditions:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>The refund request must be made within 30 days of purchase</li>
                <li>You must provide a valid reason for the refund request</li>
                <li>The product must not have been used extensively or completed (for courses)</li>
                <li>No signs of abuse or misuse of the product</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Non-Refundable Items</h2>
              <p className="mb-4">The following items are not eligible for refunds:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Products purchased more than 30 days ago</li>
                <li>Bundle packages where individual items have been downloaded or accessed</li>
                <li>Custom-made or personalized products</li>
                <li>Products purchased during special promotions marked as "non-refundable"</li>
                <li>Gift purchases (refunds must be requested by the original purchaser)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. How to Request a Refund</h2>
              <p className="mb-4">To request a refund, please follow these steps:</p>
              <ol className="list-decimal pl-6 mb-4 space-y-2">
                <li>Log into your SAFISAANA account</li>
                <li>Navigate to your purchase history</li>
                <li>Click on the "Request Refund" button next to the product</li>
                <li>Fill out the refund request form with a detailed reason</li>
                <li>Submit your request for review</li>
              </ol>
              <p className="mb-4">
                Alternatively, you can email us at <a href="mailto:refunds@safisaana.com" className="text-blue-600 hover:underline">refunds@safisaana.com</a> with your order number and reason for the refund.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Refund Processing Time</h2>
              <p className="mb-4">
                Once we receive your refund request, we will review it within 3-5 business days. If approved, the refund will be processed using the original payment method within 7-10 business days.
              </p>
              <p className="mb-4">
                You will receive an email notification once your refund has been processed. Please note that it may take additional time for the refund to appear in your account depending on your payment provider.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Partial Refunds</h2>
              <p className="mb-4">
                In some cases, we may offer partial refunds for:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Products that have been partially used or accessed</li>
                <li>Courses where only some modules have been completed</li>
                <li>Bundle packages where some items have been downloaded</li>
              </ul>
              <p className="mb-4">
                The amount of the partial refund will be determined on a case-by-case basis.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Technical Issues</h2>
              <p className="mb-4">
                If you experience technical difficulties with a product, please contact our support team at <a href="mailto:support@safisaana.com" className="text-blue-600 hover:underline">support@safisaana.com</a> before requesting a refund. We will work with you to resolve any technical issues.
              </p>
              <p className="mb-4">
                Refunds for technical issues will only be granted if we are unable to resolve the problem within a reasonable timeframe.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Refund Abuse</h2>
              <p className="mb-4">
                We reserve the right to refuse refunds or ban users who abuse our refund policy. This includes, but is not limited to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Requesting refunds for multiple products repeatedly</li>
                <li>Completing courses or using products extensively before requesting a refund</li>
                <li>Providing false information in refund requests</li>
                <li>Attempting to keep access to products after receiving a refund</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
              <p className="mb-4">
                We reserve the right to modify this refund policy at any time. Changes will be effective immediately upon posting to our website. Your continued use of our products after changes are posted constitutes your acceptance of the modified policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
              <p className="mb-4">If you have any questions about our refund policy, please contact us:</p>
              <p className="mb-2">Email: <a href="mailto:refunds@safisaana.com" className="text-blue-600 hover:underline">refunds@safisaana.com</a></p>
              <p className="mb-2">Support Email: <a href="mailto:support@safisaana.com" className="text-blue-600 hover:underline">support@safisaana.com</a></p>
              <p>Response Time: Within 24-48 hours</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
