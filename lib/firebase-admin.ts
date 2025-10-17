import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let adminApp: App;

/**
 * Initialize Firebase Admin SDK
 * Uses service account credentials from environment variables
 */
export function initAdmin() {
  if (getApps().length === 0) {
    // Parse the service account JSON from environment variable
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      : {
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        };

    adminApp = initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    adminApp = getApps()[0];
  }

  return adminApp;
}

/**
 * Get Firestore instance for server-side operations
 */
export function getAdminFirestore() {
  initAdmin();
  return getFirestore(adminApp);
}
