# How to Apply Firebase Security Rules

## ✅ Rules Created
Two rule files have been created in your project root:
- **firestore.rules** - For Firestore Database
- **storage.rules** - For Firebase Storage

Both rules allow **any authenticated user full admin access** (read, write, update, delete).

---

## 📋 Method 1: Apply via Firebase Console (Recommended)

### Firestore Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **saafisana-24c97**
3. Click **Firestore Database** in the left menu
4. Click the **Rules** tab at the top
5. **Delete all existing rules** and paste this:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow any authenticated user full access to all documents
    match /{document=**} {
      allow read, write, update, delete: if request.auth != null;
    }
  }
}
```

6. Click **Publish**

### Storage Rules

1. In Firebase Console, click **Storage** in the left menu
2. Click the **Rules** tab at the top
3. **Delete all existing rules** and paste this:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Allow any authenticated user full access to all files
    match /{allPaths=**} {
      allow read, write, delete: if request.auth != null;
    }
  }
}
```

4. Click **Publish**

---

## 📋 Method 2: Apply via Firebase CLI

If you have Firebase CLI installed:

### 1. Install Firebase CLI (if not installed)
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Initialize Firebase (if not already done)
```bash
firebase init
```
- Select: **Firestore** and **Storage**
- Choose: **Use an existing project**
- Select: **saafisana-24c97**
- Use existing rule files: **firestore.rules** and **storage.rules**

### 4. Deploy Rules
```bash
firebase deploy --only firestore:rules,storage:rules
```

---

## 🔍 Verify Rules Are Active

### Check Firestore Rules
1. Go to Firebase Console → Firestore Database → Rules
2. You should see the new rules published
3. Check the timestamp to confirm they're recent

### Check Storage Rules
1. Go to Firebase Console → Storage → Rules
2. You should see the new rules published
3. Check the timestamp to confirm they're recent

### Test in Your App
1. Login to your dashboard
2. Try uploading an image
3. Try adding a video
4. Try adding a team member
5. All operations should work without permission errors

---

## 🔒 What These Rules Do

### ✅ Allow (for authenticated users)
- **Read** - View all data
- **Write** - Create new documents/files
- **Update** - Modify existing documents
- **Delete** - Remove documents/files

### ❌ Deny (for non-authenticated users)
- All operations blocked if not logged in

---

## 🛡️ Security Note

These rules give **full admin access** to any logged-in user. This is appropriate when:
- ✅ You control who can create accounts (no public signup)
- ✅ All users should have admin privileges
- ✅ You create users manually in Firebase Console

If you need more granular permissions in the future, you can:
- Add role-based access control (admin, editor, viewer)
- Restrict certain collections to specific users
- Add user-specific document access

---

## 🚨 Troubleshooting

### "Permission Denied" Error
- **Cause**: Rules not deployed or user not authenticated
- **Fix**: 
  1. Verify rules are published in Firebase Console
  2. Check user is logged in (check dashboard sidebar for email)
  3. Try logging out and back in

### Rules Not Updating
- **Cause**: Browser cache or rules not published
- **Fix**:
  1. Hard refresh browser (Ctrl + Shift + R)
  2. Check Firebase Console shows latest rules
  3. Wait 1-2 minutes for rules to propagate

### Upload Still Failing
- **Cause**: May need to check authentication
- **Fix**:
  1. Open browser console (F12)
  2. Look for specific error messages
  3. Verify Firebase Authentication is enabled
  4. Check you're using the correct Firebase project

---

## ✅ Quick Checklist

- [ ] Open Firebase Console
- [ ] Go to Firestore Database → Rules
- [ ] Paste and publish Firestore rules
- [ ] Go to Storage → Rules
- [ ] Paste and publish Storage rules
- [ ] Verify timestamp shows rules are recent
- [ ] Test upload in dashboard
- [ ] Confirm no permission errors

---

## 📞 Need Help?

If you continue to have issues:
1. Check browser console for specific error messages
2. Verify you're logged in (email shows in dashboard sidebar)
3. Confirm rules are published (check timestamp in Console)
4. Try clearing browser cache
5. Test with a fresh incognito/private window

**Your rules are ready to deploy! Follow Method 1 above to apply them in Firebase Console.**
