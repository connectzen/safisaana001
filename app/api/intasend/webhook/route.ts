import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase-admin';

/**
 * POST /api/intasend/webhook
 * Handles IntaSend webhook notifications for payment status updates
 * 
 * IntaSend sends webhooks when payment status changes
 * Payload example:
 * {
 *   "invoice_id": "ABC123",
 *   "state": "COMPLETE" | "PENDING" | "FAILED",
 *   "value": "100.00",
 *   "account": "254712345678",
 *   "api_ref": "ref123",
 *   "created_at": "2024-01-01T12:00:00Z",
 *   ...
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Get webhook password from headers or body
    const webhookPassword = request.headers.get('x-intasend-signature') || 
                           request.headers.get('authorization');
    
    // Verify webhook password
    if (webhookPassword !== process.env.INTASEND_WEBHOOK_PASSWORD) {
      console.error('Invalid webhook password');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const payload = await request.json();
    
    console.log('IntaSend webhook received:', JSON.stringify(payload, null, 2));

    // Extract payment details from payload
    const {
      invoice_id,
      state,
      value,
      account, // phone number or email
      api_ref,
      created_at,
      currency,
      charges,
      net_amount,
      failed_reason,
      mpesa_reference,
      card_holder_name,
      ...otherFields
    } = payload;

    // Check if payment is successful
    const isSuccess = state === 'COMPLETE' || state === 'SUCCESS';
    const isPending = state === 'PENDING' || state === 'PROCESSING';
    const isFailed = state === 'FAILED' || state === 'RETRY';

    // Prepare payment data for Firestore
    const paymentData = {
      transaction_id: invoice_id || api_ref,
      invoice_id: invoice_id,
      api_ref: api_ref,
      amount: parseFloat(value || '0'),
      currency: currency || 'KES',
      status: state,
      phone: account,
      email: payload.email || '',
      created_at: created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      charges: parseFloat(charges || '0'),
      net_amount: parseFloat(net_amount || value || '0'),
      mpesa_reference: mpesa_reference || null,
      card_holder_name: card_holder_name || null,
      failed_reason: failed_reason || null,
      webhook_received_at: new Date().toISOString(),
      raw_payload: otherFields, // Store any additional fields
    };

    // Save to Firestore using Admin SDK
    const db = getAdminFirestore();
    const paymentRef = db.collection('payments').doc(invoice_id || api_ref);

    if (isSuccess) {
      // Payment successful - create or update payment record
      await paymentRef.set(paymentData, { merge: true });
      
      console.log(`✅ Payment ${invoice_id} marked as SUCCESS in Firestore`);
      
      // Check if this is a product purchase (has productId in payload or metadata)
      const productId = payload.productId || payload.metadata?.productId;
      const userId = payload.userId || payload.metadata?.userId;
      const productName = payload.productName || payload.metadata?.productName;
      
      if (productId && userId) {
        try {
          // Record purchase in purchases collection
          const purchaseId = `${userId}_${productId}`;
          const purchaseRef = db.collection('purchases').doc(purchaseId);
          
          await purchaseRef.set({
            userId: userId,
            productId: productId,
            productName: productName || 'Product',
            amount: parseFloat(value || '0'),
            currency: currency || 'KES',
            transactionId: invoice_id || api_ref,
            status: 'completed',
            purchasedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          }, { merge: true });
          
          console.log(`✅ Purchase recorded for user ${userId}: ${productName}`);
        } catch (purchaseError) {
          console.error('Error recording purchase:', purchaseError);
          // Don't fail the webhook if purchase recording fails
        }
      }
      
      // TODO: Additional logic:
      // - Send email confirmation
      // - Update user subscription status
      // - Send product download link
      
    } else if (isPending) {
      // Payment pending - update status
      await paymentRef.set({
        ...paymentData,
        status: 'PENDING',
      }, { merge: true });
      
      console.log(`⏳ Payment ${invoice_id} marked as PENDING in Firestore`);
      
    } else if (isFailed) {
      // Payment failed - record failure
      await paymentRef.set({
        ...paymentData,
        status: 'FAILED',
      }, { merge: true });
      
      console.log(`❌ Payment ${invoice_id} marked as FAILED in Firestore`);
    }

    // Respond to IntaSend webhook
    return NextResponse.json({ 
      success: true,
      message: 'Webhook processed successfully',
      transaction_id: invoice_id || api_ref,
      status: state
    });

  } catch (error: any) {
    console.error('Webhook processing error:', error);
    
    // Still return 200 to acknowledge receipt
    // (Prevents IntaSend from retrying unnecessarily)
    return NextResponse.json(
      { 
        success: false,
        error: 'Error processing webhook',
        details: error.message 
      },
      { status: 200 } // Return 200 to acknowledge receipt
    );
  }
}

/**
 * GET /api/intasend/webhook
 * Returns method not allowed
 */
export async function GET() {
  return NextResponse.json(
    { 
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests from IntaSend webhooks' 
    },
    { status: 405 }
  );
}
