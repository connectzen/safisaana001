'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, CreditCard, Lock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [planName, setPlanName] = useState('');
  const [price, setPrice] = useState(0);
  const [priceKES, setPriceKES] = useState(0);
  const [productId, setProductId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [paymentMessage, setPaymentMessage] = useState('');

  useEffect(() => {
    const name = searchParams.get('plan') || 'Selected Plan';
    const priceParam = searchParams.get('price') || '0';
    const id = searchParams.get('productId') || '';
    const usdPrice = parseFloat(priceParam);
    setPlanName(name);
    setPrice(usdPrice);
    // Convert USD to KES (1 USD = ~128 KES)
    setPriceKES(usdPrice * 128);
    setProductId(id);
  }, [searchParams]);

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    setPaymentStatus('failed');
    setPaymentMessage(error?.message || 'Payment failed. Please try again.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
          <p className="text-muted-foreground">Secure checkout powered by SAFISAANA</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Select your preferred payment option</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Status Messages */}
                {paymentStatus === 'success' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-900">Payment Successful!</h4>
                      <p className="text-sm text-green-700">{paymentMessage}</p>
                    </div>
                  </div>
                )}

                {paymentStatus === 'failed' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-900">Payment Failed</h4>
                      <p className="text-sm text-red-700">{paymentMessage}</p>
                    </div>
                  </div>
                )}

                {paymentStatus === 'processing' && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                    <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900">Processing Payment</h4>
                      <p className="text-sm text-blue-700">{paymentMessage}</p>
                    </div>
                  </div>
                )}

                {/* Payment Integration Placeholder */}
                <div className="p-6 border rounded-lg bg-white">
                  <div className="text-center mb-6">
                    <CreditCard className="h-12 w-12 mx-auto mb-3 text-blue-600" />
                    <h3 className="text-lg font-semibold mb-2">Payment Integration</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Payment integration will be added here
                    </p>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  <span>Secure SSL Encrypted Payment</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Plan Selected</p>
                  <p className="font-semibold text-lg">{planName}</p>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span className="text-primary">${price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <h4 className="font-semibold text-sm mb-2">What's included:</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Instant access to all features</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>30-day money-back guarantee</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Lifetime updates</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Premium support</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p className="mb-2">💡 <strong>How it works:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Click the payment button above</li>
                    <li>Choose your preferred payment method</li>
                    <li>Complete the payment securely</li>
                    <li>Get instant access to your purchase</li>
                  </ol>
                </div>

                <Button asChild className="w-full" variant="outline">
                  <Link href="/pricing">← Back to Pricing</Link>
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By completing your purchase, you agree to our{' '}
                  <Link href="/terms-of-service" className="underline hover:text-primary">
                    Terms of Service
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
