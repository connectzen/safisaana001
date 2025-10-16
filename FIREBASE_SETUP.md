# Firebase Setup Guide

## Firebase Configuration

Your Firebase project is now connected to the app. The configuration is located in `lib/firebase.ts`.

## Environment Variables (Optional)

For better security in production, create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCKcTfUkH_HB8QyJuCivPwV7VqWNjPzNMM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=saafisana-24c97.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=saafisana-24c97
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=saafisana-24c97.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=888279236481
NEXT_PUBLIC_FIREBASE_APP_ID=1:888279236481:web:94dfa06c0c9e422b04f280
```

## Available Firebase Services

The following Firebase services are initialized and ready to use:

- **Authentication** (`auth`) - For user authentication
- **Firestore** (`db`) - For database operations
- **Storage** (`storage`) - For file uploads (images, videos)

## Usage Example

```typescript
import { auth, db, storage } from '@/lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Example: Add data to Firestore
const addImage = async (imageData) => {
  const docRef = await addDoc(collection(db, 'images'), imageData);
  return docRef.id;
};

// Example: Upload file to Storage
const uploadImage = async (file) => {
  const storageRef = ref(storage, `images/${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);
  return url;
};

// Example: Get data from Firestore
const getImages = async () => {
  const querySnapshot = await getDocs(collection(db, 'images'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
```

## Next Steps

1. Set up Firebase Authentication (if needed)
2. Create Firestore collections for:
   - `images` - Project and gallery images
   - `videos` - Video links
   - `team` - Team member profiles
   - `settings` - Site settings
3. Set up Firebase Storage rules for secure file uploads
4. Implement CRUD operations in your dashboard pages
