'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  
  const invoiceId = searchParams.get('invoice_id');
  const signature = searchParams.get('signature');

  useEffect(() => {
    // Simulate checking payment status
    // In production, you'd verify this with your backend
    setTimeout(() => {
      if (invoiceId) {
        setStatus('success');
      } else {
        setStatus('failed');
      }
    }, 2000);
  }, [invoiceId]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-8 pb-8 text-center">
            <Loader2 className="h-16 w-16 text-primary mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-semibold mb-2">Verifying Payment...</h3>
            <p className="text-muted-foreground">
              Please wait while we confirm your transaction
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 mx-auto animate-bounce">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Payment Successful! 🎉</CardTitle>
            <CardDescription>
              Your payment has been processed successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {invoiceId && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium mb-1">Transaction ID:</p>
                <p className="text-xs text-muted-foreground font-mono">{invoiceId}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                ✅ Payment confirmed
              </p>
              <p className="text-sm text-muted-foreground">
                📧 Receipt sent to your email
              </p>
              <p className="text-sm text-muted-foreground">
                🎁 Access granted to purchased items
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Link href="/dashboard" className="flex-1">
                <Button className="w-full">Go to Dashboard</Button>
              </Link>
              <Link href="/pricing" className="flex-1">
                <Button variant="outline" className="w-full">Browse More</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4 mx-auto">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Payment Failed</CardTitle>
          <CardDescription>
            We couldn't process your payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Your payment was not completed. Please try again or contact support if the problem persists.
          </p>

          <div className="flex gap-3 pt-4">
            <Link href="/pricing" className="flex-1">
              <Button className="w-full">Try Again</Button>
            </Link>
            <Link href="/support" className="flex-1">
              <Button variant="outline" className="w-full">Contact Support</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
