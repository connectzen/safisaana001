# Firebase Admin Setup for Vercel (Production)

## 🎯 Quick Setup for Vercel

Since you have **live/production Firebase keys**, follow these steps:

---

## Step 1: Get Firebase Service Account Credentials

### Option A: Download Service Account JSON

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **daigavilla**
3. Click **⚙️ (Settings)** → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Click **Generate Key** → Downloads a JSON file
7. Open the JSON file - you'll see something like:

```json
{
  "type": "service_account",
  "project_id": "daigavilla",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBg...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@daigavilla.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

---

## Step 2: Add to Vercel (Recommended Method)

### ✅ Method 1: Individual Fields (Easiest for Vercel)

From the JSON file above, extract these 3 values:

1. **Go to Vercel Dashboard**:
   - https://vercel.com/connectzens-projects/safisaana001
   - Settings → Environment Variables

2. **Add these 3 variables** (one by one):

**Variable 1:**
```
Name: FIREBASE_CLIENT_EMAIL
Value: firebase-adminsdk-xxxxx@daigavilla.iam.gserviceaccount.com
```
(Copy from `client_email` in JSON)

**Variable 2:**
```
Name: FIREBASE_PRIVATE_KEY
Value: -----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASC...
...your full private key here...
-----END PRIVATE KEY-----
```
(Copy from `private_key` in JSON - **keep the newlines as-is**)

**Variable 3:**
```
Name: NEXT_PUBLIC_FIREBASE_PROJECT_ID
Value: daigavilla
```
(You already have this one)

3. **Select environments**:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. Click **Save** for each

---

### 🔄 Method 2: Single JSON (Alternative)

If Method 1 doesn't work, use the full JSON:

1. Minify the JSON to a single line (remove all line breaks):
   
   **Before:**
   ```json
   {
     "type": "service_account",
     "project_id": "daigavilla",
     ...
   }
   ```
   
   **After (single line):**
   ```
   {"type":"service_account","project_id":"daigavilla","private_key":"-----BEGIN PRIVATE KEY-----\\nMIIE...\\n-----END PRIVATE KEY-----\\n","client_email":"..."}
   ```
   
   **Important**: Replace actual newlines in `private_key` with `\\n`

2. Add to Vercel:
   ```
   Name: FIREBASE_SERVICE_ACCOUNT_KEY
   Value: {"type":"service_account",...} (paste minified JSON)
   ```

---

## Step 3: Verify Your Environment Variables

Your Vercel project should have these environment variables:

### IntaSend (Payment)
```
✅ INTASEND_PUBLISHABLE_KEY=ISPubKey_test_xxxxxxxxxx
✅ INTASEND_SECRET_KEY=ISSecretKey_test_xxxxxxxxxx
✅ INTASEND_TEST_MODE=true
✅ INTASEND_WEBHOOK_PASSWORD=create_secure_password_here
✅ NEXT_PUBLIC_APP_URL=https://safisaana.com
```

### Firebase Client (Frontend)
```
✅ NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDQQdfVRTLI_5mwrmdgHMbyZlmTrzrBmOQ
✅ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=daigavilla.firebaseapp.com
✅ NEXT_PUBLIC_FIREBASE_PROJECT_ID=daigavilla
✅ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=daigavilla.firebasestorage.app
✅ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1026035795349
✅ NEXT_PUBLIC_FIREBASE_APP_ID=1:1026035795349:web:051d3b7bc5367de48d629c
```

### Firebase Admin (Backend/Webhook) - Choose ONE method:

**Method 1 (Recommended):**
```
✅ FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@daigavilla.iam.gserviceaccount.com
✅ FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
✅ NEXT_PUBLIC_FIREBASE_PROJECT_ID=daigavilla (already added above)
```

**OR Method 2:**
```
✅ FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

---

## Step 4: Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click **⋯ (three dots)** → **Redeploy**
4. Select **Use existing Build Cache** → **Redeploy**

---

## 🧪 Test the Setup

### Test Webhook Locally

1. Create a test payment
2. Check Vercel function logs:
   - Vercel Dashboard → Deployments → Latest → Functions
   - Look for `/api/intasend/webhook` logs
3. Should see: "Initializing Firebase Admin with project: daigavilla"
4. Should see: "✅ Payment {id} marked as SUCCESS in Firestore"

### Verify in Firestore

1. Go to Firebase Console → Firestore Database
2. Check `payments` collection
3. Should see payment documents with transaction data

---

## 🚨 Troubleshooting

### Error: "Firebase Admin credentials not found"
- Make sure you added the environment variables in Vercel
- Verify variable names are EXACT (case-sensitive)
- Redeploy after adding variables

### Error: "Invalid private key"
- Check that `FIREBASE_PRIVATE_KEY` includes the full key
- Make sure it has `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Newlines should be actual newlines (not `\n` text)
- In Vercel, paste the key directly with line breaks

### Error: "Permission denied"
- Verify service account has proper permissions in Firebase
- Go to Firebase → Project Settings → Service Accounts
- Make sure the service account has "Editor" or "Firebase Admin" role

### Webhook not saving to Firestore
- Check Vercel function logs for errors
- Verify Firebase Admin initialized successfully
- Check Firestore security rules allow server writes

---

## ✅ Checklist

Before testing:

- [ ] Downloaded Firebase service account JSON
- [ ] Added Firebase Admin credentials to Vercel (Method 1 or 2)
- [ ] All IntaSend variables are in Vercel
- [ ] Redeployed the app after adding variables
- [ ] Webhook URL configured in IntaSend dashboard
- [ ] Tested a payment and checked logs
- [ ] Verified payment saved in Firestore

---

## 📞 Need Help?

If you're still having issues:

1. Check Vercel function logs for specific errors
2. Verify all environment variables are set correctly
3. Make sure Firebase service account has proper permissions
4. Test with a small payment amount first

---

**You're all set!** 🚀 Your Firebase Admin should now work correctly on Vercel for processing IntaSend webhooks.
