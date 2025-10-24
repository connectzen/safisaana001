# Admin Setup Guide

## Making a User an Admin

To grant admin privileges to a user, follow these steps:

### 1. User Signs Up
The user must first create an account through the signup page at `/login`.

### 2. Add User to Admins Collection in Firestore

1. Go to your Firebase Console
2. Navigate to **Firestore Database**
3. Create a collection named `admins` (if it doesn't exist)
4. Add a new document with the user's UID as the document ID:
   - Document ID: `[User's UID]` (you can find this in Firebase Authentication)
   - Fields: You can leave it empty or add metadata like:
     ```
     role: "admin"
     createdAt: [timestamp]
     ```

### 3. User Gets Admin Access

Once added to the `admins` collection:
- The **Dashboard** button will appear in the header when they're logged in
- They can access the dashboard at `/dashboard`
- They can manage products, pricing, and other admin features

## Admin Features

Admins have access to:
- **Products Management**: Create, edit, and delete products
- **Pricing Management**: Create pricing plans and bundles
- **Dashboard Analytics**: View product statistics

## Non-Admin Users

Regular users (not in `admins` collection):
- Can browse products
- Can view pricing
- Can purchase products
- **Cannot** access the dashboard
- **Cannot** see the dashboard button in header

## User Header States

### Not Logged In:
```
[New here? Join thousands of creators!] [Sign In] [Get Started]
```

### Logged In (Non-Admin):
```
[username] ▼
  └─ Sign Out
```

### Logged In (Admin):
```
[username] ▼
  ├─ Dashboard
  └─ Sign Out
```

## Security Notes

- Admin status is checked server-side through Firestore
- Dashboard routes are protected
- Non-admin users cannot access dashboard even if they try the URL directly
