import { NextRequest, NextResponse } from 'next/server';

const IntaSend = require('intasend-node');

/**
 * POST /api/payments/initiate
 * Initiates a payment collection with IntaSend
 * 
 * Body: { email, phone, amount, currency, firstName?, lastName? }
 * Returns: { checkout_url, invoice_id }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { email, phone, amount, currency, firstName, lastName, productId, productName, userId } = body;

    // Validate required fields
    if (!email || !phone || !amount || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields: email, phone, amount, currency' },
        { status: 400 }
      );
    }

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount. Must be a positive number' },
        { status: 400 }
      );
    }

    // Validate currency
    if (!['KES', 'USD', 'EUR', 'GBP'].includes(currency)) {
      return NextResponse.json(
        { error: 'Invalid currency. Supported: KES, USD, EUR, GBP' },
        { status: 400 }
      );
    }

    // Initialize IntaSend
    const intasend = new IntaSend(
      process.env.INTASEND_PUBLISHABLE_KEY,
      process.env.INTASEND_SECRET_KEY,
      process.env.INTASEND_TEST_MODE === 'true' // true for test/sandbox mode
    );

    // Create a collection/checkout
    const collection = intasend.collection();

    // Prepare checkout data
    const checkoutData = {
      email: email,
      phone_number: phone,
      amount: parseFloat(amount),
      currency: currency,
      first_name: firstName || 'Customer',
      last_name: lastName || '',
      // Redirect URLs (customize these)
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://safisaana.com'}/payment/success`,
      // Add metadata for webhook processing
      api_ref: productId ? `${userId}_${productId}_${Date.now()}` : undefined,
      // Store product and user info in the payment record
      host: process.env.NEXT_PUBLIC_APP_URL || 'https://safisaana.com',
    };

    console.log('Creating IntaSend checkout:', checkoutData);

    // Create the checkout
    const response = await collection.create(checkoutData);

    console.log('IntaSend response:', response);

    // Return checkout URL and invoice ID
    return NextResponse.json({
      success: true,
      checkout_url: response.url,
      invoice_id: response.invoice?.invoice_id || response.id,
      signature: response.signature,
    });

  } catch (error: any) {
    console.error('IntaSend payment initiation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to initiate payment',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/payments/initiate
 * Returns method not allowed
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to initiate payment.' },
    { status: 405 }
  );
}
