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
    // Check if IntaSend credentials are configured
    if (!process.env.INTASEND_PUBLISHABLE_KEY || !process.env.INTASEND_SECRET_KEY) {
      console.error('IntaSend credentials not configured');
      return NextResponse.json(
        { 
          error: 'Payment gateway not configured',
          details: 'IntaSend API keys are missing. Please contact support.'
        },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { email, phone, amount, currency, firstName, lastName, productId, productName, userId } = body;

    console.log('Payment initiation request:', { email, phone, amount, currency, productId, userId });

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

    console.log('IntaSend initialized with test mode:', process.env.INTASEND_TEST_MODE === 'true');

    // Create a collection/checkout
    let collection;
    try {
      collection = intasend.collection();
      console.log('Collection object created:', typeof collection);
    } catch (err) {
      console.error('Failed to create collection:', err);
      throw new Error('Failed to initialize payment collection');
    }

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
    };

    console.log('Creating IntaSend checkout with data:', {
      email,
      phone,
      amount: parseFloat(amount),
      currency,
      first_name: firstName || 'Customer',
    });

    // Create the checkout - try different method signatures
    let response;
    try {
      if (typeof collection.create === 'function') {
        response = await collection.create(checkoutData);
      } else if (typeof collection === 'function') {
        response = await collection(checkoutData);
      } else {
        throw new Error('Collection object does not have a create method');
      }
    } catch (err: any) {
      console.error('Collection.create error:', err);
      throw err;
    }

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
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    
    // Extract meaningful error message
    let errorMessage = 'Failed to initiate payment';
    let errorDetails = error.message || 'Unknown error';
    
    if (error.response?.data) {
      errorDetails = JSON.stringify(error.response.data);
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails,
        hint: 'Please check your IntaSend API keys and test mode settings in Vercel environment variables.'
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
