# Quick Reference Card

## 🚀 Getting Started in 3 Steps

### Step 1: Create Admin User
1. Go to: https://console.firebase.google.com/
2. Select: **saafisana-24c97**
3. Click: **Authentication** → **Users** → **Add User**
4. Email: `admin@daigavilla.com`
5. Password: (choose a strong password)

### Step 2: Set Firestore Collections
1. In Firebase Console → **Firestore Database**
2. Create these collections:
   - `images`
   - `videos`
   - `team`
   - `settings` (optional)

### Step 3: Start & Test
```bash
npm run dev
```
Go to: `http://localhost:3000/login`

---

## 📍 Important URLs

| Page | URL |
|------|-----|
| Homepage | `http://localhost:3000/` |
| Login | `http://localhost:3000/login` |
| Dashboard | `http://localhost:3000/dashboard` |
| Add Image | `http://localhost:3000/dashboard/images/new` |
| Add Video | `http://localhost:3000/dashboard/videos/new` |
| Add Team Member | `http://localhost:3000/dashboard/team/new` |

---

## 🔑 Key Features

### ✅ Authentication
- Login required for dashboard access
- No signup page (create users in Firebase Console)
- Auto-redirect to login if not authenticated
- Logout button in dashboard sidebar

### ✅ Image Upload
- File upload to Firebase Storage
- Metadata saved to Firestore
- Categories: hero-background, ongoing-project, gallery, etc.
- Preview before upload

### ✅ Video Management
- YouTube URL integration
- Video preview in form
- Description and categorization
- Saved to Firestore

### ✅ Team Management
- Photo upload optional
- Bio, email, phone fields
- Role selection
- Profile saved to Firestore

---

## 🎯 Common Tasks

### Add a New Admin User
**Firebase Console** → Authentication → Users → Add User

### Upload an Image
**Dashboard** → Images → Add New Image → Select file → Choose category → Upload

### Add a Video
**Dashboard** → Videos → Add New Video → Paste YouTube URL → Add details → Save

### Add Team Member
**Dashboard** → Team Members → Add Team Member → Upload photo → Fill details → Save

### Logout
**Dashboard Sidebar** → Logout button (red, bottom of sidebar)

---

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
Key Files:
├── app/
│   ├── login/page.tsx              # Login page
│   ├── dashboard/
│   │   ├── layout.tsx              # Protected routes
│   │   ├── images/new/page.tsx     # Add image form
│   │   ├── videos/new/page.tsx     # Add video form
│   │   └── team/new/page.tsx       # Add team member form
│   └── layout.tsx                  # Root with AuthProvider
│
├── lib/
│   ├── firebase.ts                 # Firebase config
│   ├── auth-context.tsx            # Authentication
│   └── hooks/                      # Custom hooks
│       ├── useImages.ts
│       ├── useVideos.ts
│       └── useTeam.ts
│
└── components/
    ├── protected-route.tsx         # Route protection
    └── dashboard/
        └── dashboard-layout.tsx    # Dashboard UI + logout
```

---

## 🔒 Security Rules (Must Set!)

**Rule files are already created in your project:**
- `firestore.rules` - Firestore Database rules
- `storage.rules` - Firebase Storage rules

**See [APPLY_SECURITY_RULES.md](APPLY_SECURITY_RULES.md) for step-by-step instructions.**

### Quick Apply (via Firebase Console)

**Firestore Rules:**
1. Go to Firebase Console → Firestore Database → Rules
2. Copy content from `firestore.rules` file
3. Paste and click Publish

**Storage Rules:**
1. Go to Firebase Console → Storage → Rules
2. Copy content from `storage.rules` file
3. Paste and click Publish

✅ These rules give **any logged-in user full admin access**

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't login | Verify user exists in Firebase Console → Authentication → Users |
| Upload fails | Check you're logged in & Storage rules are set |
| Redirect loop | Clear browser cache/cookies, check AuthProvider in layout |
| Data not saving | Verify Firestore rules allow authenticated writes |
| Image not uploading | Check file size (<5MB recommended) & Storage rules |

---

## 📚 Full Documentation

- **[SETUP_COMPLETE.md](SETUP_COMPLETE.md)** - Complete setup guide
- **[AUTHENTICATION_SETUP.md](AUTHENTICATION_SETUP.md)** - User management
- **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** - Firebase details
- **[INTEGRATION_EXAMPLE.md](INTEGRATION_EXAMPLE.md)** - Code examples

---

## 🎉 You're Ready!

1. ✅ Create your first admin user
2. ✅ Set up Firestore collections  
3. ✅ Configure security rules
4. ✅ Start the dev server
5. ✅ Login and start uploading!
