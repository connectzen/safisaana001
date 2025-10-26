'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CreditCard, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface PaymentFormProps {
  productName: string;
  price: number;
  productId?: string;
  productType?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function PaymentForm({ 
  productName,
  price,
  productId,
  productType,
  onSuccess,
  onError
}: PaymentFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    customerName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    message: '',
    productName: productName,
    price: price,
    productId: productId || '',
    productType: productType || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare webhook payload
      const webhookPayload = {
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        product: {
          name: formData.productName,
          price: formData.price,
          id: formData.productId,
          type: formData.productType,
        },
        timestamp: new Date().toISOString(),
        source: 'safisaana-website'
      };

      console.log('Processing purchase request:', webhookPayload);

      // Store purchase request (simulated - replace with actual storage)
      // For now, we'll just show success message
      setSuccess(true);
      
      // Call success callback
      if (onSuccess) {
        onSuccess(webhookPayload);
      }

    } catch (error: any) {
      console.error('Payment form error:', error);
      alert(`Failed to submit: ${error.message}`);
      
      // Call error callback
      if (onError) {
        onError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Processing Your Request...</h3>
          <p className="text-sm text-gray-600 mb-4">
            We're setting up your checkout for {productName}. Please wait while we prepare your payment details.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              🔄 Processing your request...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Request Purchase
        </CardTitle>
        <CardDescription>
          Fill out the form below and we'll contact you to complete your purchase
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Info Display */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium">{productName}</p>
            <p className="text-lg font-bold text-primary">${price.toFixed(2)}</p>
          </div>

          {/* Customer Name */}
          <div className="space-y-2">
            <Label htmlFor="customerName">Full Name *</Label>
            <Input
              id="customerName"
              name="customerName"
              type="text"
              placeholder="John Doe"
              value={formData.customerName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+254712345678"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Additional Message (Optional)</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Any specific requirements or questions..."
              value={formData.message}
              onChange={handleChange}
              disabled={loading}
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Request Purchase
              </>
            )}
          </Button>

          <p className="text-xs text-center text-gray-500">
            We'll contact you within 24 hours to complete your purchase.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
