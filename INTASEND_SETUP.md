# IntaSend Payment Integration - Complete Setup Guide

## 📋 Overview
This guide covers the complete setup of IntaSend payments for SAFISAANA marketplace.

---

## 🔑 Environment Variables

Add these to your `.env.local` (for local development) and Vercel (for production):

```env
# ===== INTASEND CONFIGURATION =====

# IntaSend API Keys (Get from https://sandbox.intasend.com/account/api-keys/)
INTASEND_PUBLISHABLE_KEY=ISPubKey_test_xxxxxxxxxx
INTASEND_SECRET_KEY=ISSecretKey_test_xxxxxxxxxx

# Test Mode (set to "false" for production)
INTASEND_TEST_MODE=true

# Webhook Password (Create a strong random password)
# This is used to verify webhook requests from IntaSend
INTASEND_WEBHOOK_PASSWORD=your_secure_webhook_password_here_123456

# App URL (for redirects after payment)
NEXT_PUBLIC_APP_URL=https://safisaana.com

# ===== FIREBASE ADMIN (for webhook to save to Firestore) =====

# Option 1: Full service account JSON (Recommended)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key":"..."}

# Option 2: Individual fields (Alternative)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

---

## 🚀 Step-by-Step Setup

### 1. Get IntaSend API Keys

1. **Sign up** at [IntaSend](https://intasend.com)
2. Go to **Sandbox** (test mode): https://sandbox.intasend.com/
3. Navigate to **Account → API Keys**
4. Copy your **Publishable Key** and **Secret Key**
5. For production, switch to live mode and get live keys

### 2. Configure Firebase Admin SDK

You need Firebase Admin SDK to save payment data from webhooks.

#### Option A: Service Account JSON (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project → **Project Settings** → **Service Accounts**
3. Click **Generate New Private Key**
4. Download the JSON file
5. Minify it to one line (remove line breaks)
6. Add to `.env.local`:
   ```env
   FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"daigavilla",...}
   ```

#### Option B: Individual Fields

Extract from the service account JSON:
```env
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@daigavilla.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 3. Set Up Webhook in IntaSend

1. Go to IntaSend Dashboard → **Developer** → **Webhooks**
2. Click **Add Webhook**
3. Configure:
   - **Webhook URL**: `https://safisaana.com/api/intasend/webhook`
   - **Event Types**: Select all payment-related events
     - `COLLECTION_PENDING`
     - `COLLECTION_COMPLETE`
     - `COLLECTION_FAILED`
   - **Webhook Password**: Use the same password from `INTASEND_WEBHOOK_PASSWORD`
   - **Active**: Yes
4. Save the webhook

### 4. Configure Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (safisaana001)
3. Go to **Settings** → **Environment Variables**
4. Add all environment variables from above
5. **Important**: Make sure to select:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
6. Click **Save**
7. Redeploy your app

---

## 📂 Files Created

### Backend (API Routes)

1. **`app/api/payments/initiate/route.ts`**
   - Initiates payment with IntaSend
   - Returns checkout URL
   
2. **`app/api/intasend/webhook/route.ts`**
   - Receives webhook notifications
   - Saves payment data to Firestore
   
3. **`lib/firebase-admin.ts`**
   - Firebase Admin SDK setup
   - Server-side Firestore access

### Frontend (Components & Pages)

4. **`components/payment-form.tsx`**
   - Reusable payment form component
   - Handles payment initiation
   
5. **`app/payment/success/page.tsx`**
   - Payment success page
   - Shows transaction details

---

## 🧪 Testing

### Test in Sandbox Mode

1. Set `INTASEND_TEST_MODE=true`
2. Use test phone numbers:
   - **Success**: 254999999999
   - **Failed**: 254111111111
   - **Pending**: 254222222222
3. Use test card numbers (see IntaSend docs)

### Test Webhook Locally

Use ngrok or similar tool to expose local server:

```bash
# Terminal 1: Start your Next.js app
npm run dev

# Terminal 2: Expose with ngrok
ngrok http 3000

# Update webhook URL in IntaSend to:
# https://your-ngrok-url.ngrok.io/api/intasend/webhook
```

### Test Payment Flow

1. Go to your app
2. Navigate to pricing or any page with payment form
3. Fill in details:
   - Email: test@example.com
   - Phone: 254999999999 (test number for success)
   - Amount: 100
   - Currency: KES
4. Click "Proceed to Payment"
5. You'll be redirected to IntaSend checkout
6. Complete test payment
7. Check webhook is received in your logs
8. Verify payment saved in Firestore (`payments` collection)

---

## 🔒 Security Best Practices

### ✅ Do's

- **Always verify webhook password** before processing
- **Use HTTPS** in production (Vercel provides this)
- **Validate all input** in API routes
- **Use Firebase Admin SDK** for server-side Firestore writes
- **Store sensitive keys** in environment variables only
- **Never commit** `.env.local` to Git

### ❌ Don'ts

- Don't expose secret keys in client-side code
- Don't trust client-side payment status
- Don't skip webhook signature verification
- Don't log sensitive information in production

---

## 🎯 Integration Points

### Where to Add Payment Forms

#### 1. Pricing Page (`app/pricing/page.tsx`)

Replace the current checkout redirect with:

```tsx
import { PaymentForm } from '@/components/payment-form';

// In your component:
<PaymentForm 
  amount={product.price} 
  currency="KES" 
/>
```

#### 2. Product Details Page

Add "Buy Now" button that opens payment form.

#### 3. Checkout Page (`app/checkout/page.tsx`)

Replace placeholder with actual payment integration.

---

## 📊 Firestore Schema

Payments are stored in `payments/{transaction_id}`:

```typescript
{
  transaction_id: string;
  invoice_id: string;
  api_ref: string;
  amount: number;
  currency: string; // "KES", "USD", etc.
  status: string; // "COMPLETE", "PENDING", "FAILED"
  phone: string;
  email: string;
  created_at: string; // ISO timestamp
  updated_at: string;
  charges: number;
  net_amount: number;
  mpesa_reference: string | null;
  card_holder_name: string | null;
  failed_reason: string | null;
  webhook_received_at: string;
  raw_payload: object; // Full webhook data
}
```

---

## 🔄 Payment Flow

```
1. User fills payment form
   ↓
2. Frontend calls /api/payments/initiate
   ↓
3. Backend creates IntaSend checkout
   ↓
4. User redirected to IntaSend page
   ↓
5. User completes payment (M-Pesa/Card)
   ↓
6. IntaSend sends webhook to /api/intasend/webhook
   ↓
7. Webhook saves payment to Firestore
   ↓
8. User redirected to /payment/success
```

---

## 🐛 Troubleshooting

### Webhook Not Received

- Check webhook URL is correct
- Verify webhook password matches
- Check Vercel function logs
- Ensure webhook is active in IntaSend dashboard

### Payment Not Saved to Firestore

- Check Firebase Admin SDK credentials
- Verify Firestore rules allow server writes
- Check Vercel function logs for errors
- Ensure service account has proper permissions

### Test Payments Failing

- Verify `INTASEND_TEST_MODE=true`
- Use correct test phone numbers
- Check API keys are for sandbox

---

## 📞 Support

- **IntaSend Docs**: https://developers.intasend.com
- **IntaSend Support**: support@intasend.com
- **SAFISAANA Support**: support@safisaana.com

---

## ✅ Checklist

Before going live:

- [ ] IntaSend API keys configured
- [ ] Firebase Admin SDK set up
- [ ] Webhook configured in IntaSend
- [ ] All environment variables in Vercel
- [ ] Tested in sandbox mode
- [ ] Payment form integrated
- [ ] Success/failure pages working
- [ ] Firestore saving payments correctly
- [ ] Switch to live mode keys
- [ ] Set `INTASEND_TEST_MODE=false`
- [ ] Test live payment (small amount)

---

## 🚀 Go Live

When ready for production:

1. Get live API keys from IntaSend
2. Update environment variables:
   ```env
   INTASEND_PUBLISHABLE_KEY=ISPubKey_live_xxxxxxxxxx
   INTASEND_SECRET_KEY=ISSecretKey_live_xxxxxxxxxx
   INTASEND_TEST_MODE=false
   ```
3. Update webhook URL to production domain
4. Test with small real payment
5. Monitor webhook logs
6. You're live! 🎉

---

**Need help?** Check the code comments or reach out to the development team.
