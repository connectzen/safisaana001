'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { PaymentForm } from '@/components/payment-form';
import { useAuth } from '@/lib/auth-context';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [planName, setPlanName] = useState('');
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const name = searchParams.get('plan') || 'Selected Plan';
    const priceParam = searchParams.get('price') || '0';
    setPlanName(name);
    setPrice(parseFloat(priceParam));
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
          <p className="text-muted-foreground">Secure checkout powered by IntaSend</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary Sidebar */}
          <div className="order-2 lg:order-1">
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

                <Button asChild className="w-full" variant="outline">
                  <Link href="/pricing">← Back to Pricing</Link>
                </Button>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2">
                  <Lock className="h-4 w-4" />
                  <span>Secure SSL Encrypted Payment</span>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  By completing your purchase, you agree to our{' '}
                  <Link href="/terms-of-service" className="underline hover:text-primary">
                    Terms of Service
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="order-1 lg:order-2">
            <PaymentForm 
              amount={price} 
              currency="KES"
              onSuccess={(data) => {
                console.log('Payment initiated:', data);
                // IntaSend will redirect to their checkout page
              }}
              onError={(error) => {
                console.error('Payment error:', error);
                alert('Failed to initiate payment. Please try again.');
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
