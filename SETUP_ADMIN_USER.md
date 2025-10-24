# Setup Admin User - CRITICAL STEP

## 🚨 IMPORTANT: Read This First!

The security rules have been updated to **ONLY allow admin users** access to the dashboard. You MUST add your admin user to Firestore before the rules will work.

---

## 🎯 Step 1: Deploy Updated Rules

### Deploy Firestore Rules
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select: **saafisana-24c97**
3. Click: **Firestore Database** → **Rules** tab
4. Copy content from `firestore.rules` file (in your project root)
5. Paste and click **Publish**

### Deploy Storage Rules
1. Click: **Storage** → **Rules** tab
2. Copy content from `storage.rules` file
3. Paste and click **Publish**

---

## 🎯 Step 2: Add Admin User to Firestore

### Method A: Via Firebase Console (Easiest)

1. **Go to Firestore Database**
   - Firebase Console → Firestore Database
   - Click **Start collection**

2. **Create "admins" collection**
   - Collection ID: `admins`
   - Click **Next**

3. **Add your admin user document**
   - Document ID: `fXwik0D5tzXmHGwloEFYjXTGmY12` (your user ID)
   - Add fields:
     - Field: `email` | Type: `string` | Value: `daigavillalimited@gmail.com`
     - Field: `role` | Type: `string` | Value: `admin`
     - Field: `createdAt` | Type: `timestamp` | Value: (current time)
   - Click **Save**

4. **Verify the document**
   - You should see: `admins/fXwik0D5tzXmHGwloEFYjXTGmY12`
   - With your email and role fields

### Method B: Via Code (After Rules Are Live)

Create a temporary script or use the browser console on the login page:

```javascript
import { doc, setDoc } from 'firebase/firestore';
import { db } from './lib/firebase';

// Run this once to add admin
async function makeAdmin() {
  await setDoc(doc(db, 'admins', 'fXwik0D5tzXmHGwloEFYjXTGmY12'), {
    email: 'daigavillalimited@gmail.com',
    role: 'admin',
    createdAt: new Date()
  });
  console.log('Admin user created!');
}

makeAdmin();
```

---

## 🎯 Step 3: Test Admin Access

1. **Login** with: `daigavillalimited@gmail.com`
2. You should now have access to:
   - Dashboard
   - Upload images
   - Add videos
   - Add team members
3. **Non-admin users** will be blocked from accessing anything

---

## 📋 How the New Rules Work

### ✅ Admin Users Can:
- Access dashboard
- Read all data
- Create/upload files
- Update data
- Delete data

### ❌ Non-Admin Users:
- **Blocked from everything**
- Cannot read data
- Cannot write data
- Cannot access dashboard

### 🔍 Admin Check:
The rules check if a document exists in `admins/{userId}` collection:
- If exists → User is admin → Access granted
- If not exists → User is not admin → Access denied

---

## 🆕 Adding More Admin Users

To add another admin user:

1. **Get their User ID**
   - Firebase Console → Authentication → Users
   - Copy the User UID

2. **Add to admins collection**
   - Firestore Database → admins collection
   - Add document with User UID as document ID
   - Add fields: email, role (admin), createdAt

3. **They can now login** with full admin access

---

## 🚨 Critical Order of Operations

**DO THIS IN ORDER:**

1. ✅ **First**: Add admin user to Firestore (Step 2 above)
2. ✅ **Then**: Deploy the new security rules (Step 1 above)
3. ✅ **Finally**: Test login and access

**If you deploy rules BEFORE adding the admin user document, even you will be locked out!**

---

## 🔓 Emergency: Locked Out?

If you deployed rules before adding the admin user:

### Quick Fix:
1. **Temporarily change Firestore rules** to allow writes:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;  // Temporary!
    }
  }
}
```

2. **Add your admin user** (follow Step 2 above)

3. **Re-deploy the admin-only rules** from `firestore.rules`

---

## ✅ Quick Checklist

Before going live:
- [ ] Admin user document created in Firestore
- [ ] Document ID matches user UID: `fXwik0D5tzXmHGwloEFYjXTGmY12`
- [ ] Email field is correct: `daigavillalimited@gmail.com`
- [ ] Role field set to: `admin`
- [ ] Firestore rules deployed
- [ ] Storage rules deployed
- [ ] Tested login with admin account
- [ ] Verified can upload images
- [ ] Verified can add videos/team

---

## 🎉 Summary

**Your Setup:**
- Admin Email: `daigavillalimited@gmail.com`
- Admin UID: `fXwik0D5tzXmHGwloEFYjXTGmY12`
- Access Level: Full admin (read, write, update, delete)
- Other Users: Blocked unless added to `admins` collection

**Next Steps:**
1. Add admin document to Firestore (Step 2)
2. Deploy rules (Step 1)
3. Login and test!
