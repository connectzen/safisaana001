# Firebase Storage Rules Deployment Guide

## Important: Storage Rules Must Be Deployed!

The image upload functionality requires Firebase Storage rules to be deployed. Without deployed rules, uploads will fail.

## How to Deploy Storage Rules

### Option 1: Using Firebase CLI

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project** (if not done already):
   ```bash
   firebase init storage
   ```
   Select your Firebase project when prompted.

4. **Deploy Storage Rules**:
   ```bash
   firebase deploy --only storage
   ```

### Option 2: Using Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Storage** in the left sidebar
4. Click on **Rules** tab
5. Copy the contents of `storage.rules` file
6. Paste into the rules editor in Firebase Console
7. Click **Publish** to deploy the rules

## Current Storage Rules

The storage rules allow:
- **Public read access** to product images (in the `products/` folder)
- **Admin-only write/delete access** to product images

This ensures:
- ✅ Customers can view product images
- ✅ Only admins can upload/delete images
- ✅ Security is maintained

## Verification

After deploying rules, verify by:

1. Opening your app's developer console (F12)
2. Attempting to upload an image
3. Watching for console logs that show the upload progress

If you see errors in the console, the rules may not be deployed correctly.

## Common Issues

### "Permission denied" error
- **Solution**: Deploy the storage rules using one of the methods above

### "Storage not configured" error
- **Solution**: Check your `.env.local` file has `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` set correctly

### Upload hanging/never completing
- **Solution**: Check browser console for errors and verify storage rules are deployed

## Need Help?

Check the browser console for detailed error messages. The upload function now includes comprehensive logging to help diagnose issues.

