# 🔒 Security Rules - Admin Only Access

## ✅ What's Been Created

I've created Firebase security rules that give **ONLY admin users access**. Non-admin users are blocked from everything.

## 🚨 CRITICAL: Must Add Admin User First!

**⚠️ READ [SETUP_ADMIN_USER.md](SETUP_ADMIN_USER.md) BEFORE DEPLOYING RULES!**

You MUST add your admin user to Firestore BEFORE deploying these rules, or you'll be locked out!

### Files Created:
1. **`firestore.rules`** - Database security rules
2. **`storage.rules`** - File storage security rules
3. **`APPLY_SECURITY_RULES.md`** - Detailed deployment guide

---

## 🚀 Quick Deploy (5 Minutes)

### Step 1: Open Firebase Console
Go to: https://console.firebase.google.com/
Select: **saafisana-24c97**

### Step 2: Add Your Admin User to Firestore

**⚠️ DO THIS FIRST OR YOU'LL BE LOCKED OUT!**

1. **Go to Firestore Database** in Firebase Console
2. **Create collection**: `admins`
3. **Add document** with ID: `fXwik0D5tzXmHGwloEFYjXTGmY12`
4. **Add fields**:
   - `email`: `daigavillalimited@gmail.com`
   - `role`: `admin`
   - `createdAt`: (current timestamp)
5. **Save the document**

**See [SETUP_ADMIN_USER.md](SETUP_ADMIN_USER.md) for detailed instructions.**

### Step 3: Deploy Firestore Rules

1. Click **Firestore Database** → **Rules** tab
2. Delete existing rules
3. Copy and paste from your `firestore.rules` file OR paste this:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Admin users collection - admins can manage, users can read their own
    match /admins/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if isAdmin();
    }
    
    // All other collections - only admins have access
    match /{document=**} {
      allow read, write, update, delete: if isAdmin();
    }
  }
}
```

4. Click **Publish** ✅

### Step 4: Deploy Storage Rules

1. Click **Storage** → **Rules** tab
2. Delete existing rules
3. Copy and paste from your `storage.rules` file OR paste this:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             firestore.get(/databases/(default)/documents/admins/$(request.auth.uid)).data != null;
    }
    
    // Only admins can upload, read, or delete files
    match /{allPaths=**} {
      allow read, write, delete: if isAdmin();
    }
  }
}
```

4. Click **Publish** ✅

---

## 🎯 What These Rules Allow

### For Admin Users Only
✅ **Full Admin Access:**
- Access dashboard
- Create documents/files
- Read all data
- Update any document
- Delete any document/file

Admin status is checked by looking for a document in `admins/{userId}` collection.

### For Non-Admin Users (Even if Logged In)
❌ **No Access:**
- Blocked from dashboard
- Cannot read data
- Cannot write data
- Cannot upload files
- Login will fail with "Access denied" message

---

## ✨ Your Admin Setup

**Admin User:**
- Email: `daigavillalimited@gmail.com`
- User ID: `fXwik0D5tzXmHGwloEFYjXTGmY12`
- Role: `admin`
- Access: Full (read, write, update, delete)

**Adding More Admins:**
Just add more documents to the `admins` collection with their User UID as the document ID.

---

## 🧪 Test After Deploying

1. **Login with admin account**: `daigavillalimited@gmail.com`
2. **Upload an image** - Should work ✅
3. **Add a video** - Should work ✅
4. **Add a team member** - Should work ✅
5. **Logout and try with non-admin** - Should show "Access denied" ❌

---

## 📚 More Info

- Full instructions: [APPLY_SECURITY_RULES.md](APPLY_SECURITY_RULES.md)
- Setup guide: [SETUP_COMPLETE.md](SETUP_COMPLETE.md)
- Quick reference: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

---

## 🎉 You're All Set!

**Critical order:**
1. ✅ **First**: Add admin user document to Firestore
2. ✅ **Then**: Deploy Firestore rules
3. ✅ **Finally**: Deploy Storage rules
4. ✅ **Test**: Login with admin account

**⚠️ If you skip Step 1, you'll be locked out!**

See [SETUP_ADMIN_USER.md](SETUP_ADMIN_USER.md) for complete instructions.
