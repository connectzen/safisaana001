# Authentication Setup Guide

## Overview

The dashboard is now protected with Firebase Authentication. Only authenticated users can access the dashboard pages.

## Features

- ✅ Login page at `/login`
- ✅ Protected dashboard routes
- ✅ Automatic redirect to login if not authenticated
- ✅ Logout functionality
- ✅ User email display in sidebar
- ❌ No signup page (users created in backend only)

## Creating Admin Users

Since there's no signup page, you need to create users manually in Firebase Console:

### Method 1: Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **saafisana-24c97**
3. Click on **Authentication** in the left sidebar
4. Click on **Users** tab
5. Click **Add User** button
6. Enter email and password
7. Click **Add User**

### Method 2: Using Firebase Admin SDK (Backend)

If you want to create users programmatically, you can use the Firebase Admin SDK in your backend:

```javascript
const admin = require('firebase-admin');

// Initialize Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey)
});

// Create a new user
admin.auth().createUser({
  email: 'admin@daigavilla.com',
  password: 'securePassword123',
  emailVerified: true,
  disabled: false
})
.then((userRecord) => {
  console.log('Successfully created new user:', userRecord.uid);
})
.catch((error) => {
  console.log('Error creating new user:', error);
});
```

## Login Credentials

After creating a user in Firebase Console, use those credentials to login:

1. Go to: `http://localhost:3000/login`
2. Enter the email and password you created
3. Click **Login**
4. You'll be redirected to `/dashboard`

## Testing the Authentication

1. **Test Login**: Try accessing `/dashboard` - you should be redirected to `/login`
2. **Test Protected Routes**: After logging in, you should have access to all dashboard pages
3. **Test Logout**: Click the logout button in the sidebar - you should be redirected to `/login`

## Security Rules

Make sure to set up Firebase Security Rules for Firestore and Storage:

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Only authenticated users can upload/read files
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Troubleshooting

### "Failed to login" Error

- Check that the user exists in Firebase Console
- Verify the email and password are correct
- Make sure Firebase Authentication is enabled in your project

### Redirect Loop

- Clear browser cache and cookies
- Check that the AuthProvider is properly wrapped around the app
- Verify Firebase configuration is correct

### Upload Not Working

- Ensure you're logged in
- Check Firebase Storage rules allow authenticated writes
- Verify the file size is within limits (default 5MB)

## Default Admin User

Create your first admin user with these steps:

1. Go to Firebase Console → Authentication → Users
2. Click "Add User"
3. Email: `admin@daigavilla.com`
4. Password: Choose a strong password
5. Save and use these credentials to login

## Password Reset

To reset a user's password:

1. Go to Firebase Console → Authentication → Users
2. Find the user
3. Click the three dots menu
4. Select "Reset password"
5. Firebase will send a password reset email

Or implement password reset in the login page if needed.
