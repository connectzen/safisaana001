'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const ref = searchParams.get('ref');
      const invoiceId = searchParams.get('invoice_id');
      const state = searchParams.get('state');

      // Check payment state parameter
      if (state) {
        if (state === 'COMPLETE' || state === 'SUCCESS') {
          setStatus('success');
        } else if (state === 'FAILED') {
          setStatus('failed');
        }
      }

      // Store payment details
      setPaymentDetails({
        ref: ref,
        invoiceId: invoiceId,
        state: state,
      });

      // Auto-redirect to dashboard after 5 seconds on success
      if (state === 'COMPLETE' || state === 'SUCCESS') {
        setTimeout(() => {
          router.push('/dashboard?payment=success');
        }, 5000);
      }
    };

    checkPaymentStatus();
  }, [searchParams, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-blue-600" />
            <CardTitle>Processing Payment...</CardTitle>
            <CardDescription>Please wait while we verify your payment</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-900">Payment Successful!</CardTitle>
            <CardDescription className="text-base">
              Your payment has been processed successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentDetails?.invoiceId && (
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-600">Transaction ID:</p>
                <p className="font-mono text-sm font-semibold">{paymentDetails.invoiceId}</p>
              </div>
            )}
            
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <ul className="space-y-2 text-sm text-green-900">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Payment confirmed
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Receipt sent to your email
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Access granted to your purchase
                </li>
              </ul>
            </div>

            <p className="text-center text-sm text-gray-600">
              Redirecting to dashboard in 5 seconds...
            </p>

            <div className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-900">Payment Failed</CardTitle>
            <CardDescription className="text-base">
              We couldn't process your payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-900">
                Your payment was not successful. Please try again or use a different payment method.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link href="/">Browse Products</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/support">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
