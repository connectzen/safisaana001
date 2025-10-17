import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let adminApp: App;

/**
 * Initialize Firebase Admin SDK for Vercel deployment
 * Supports multiple credential formats for flexibility
 */
export function initAdmin() {
  if (getApps().length === 0) {
    let serviceAccount: any;

    // Option 1: Full service account JSON (single-line)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      } catch (error) {
        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', error);
        throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_KEY format');
      }
    }
    // Option 2: Individual credential fields (recommended for Vercel)
    else if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      serviceAccount = {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Handle both escaped and unescaped newlines
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      };
    }
    // Option 3: Fallback error
    else {
      throw new Error(
        'Firebase Admin credentials not found. Please set either:\n' +
        '1. FIREBASE_SERVICE_ACCOUNT_KEY (full JSON), or\n' +
        '2. FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY + NEXT_PUBLIC_FIREBASE_PROJECT_ID'
      );
    }

    console.log('Initializing Firebase Admin with project:', serviceAccount.projectId);

    adminApp = initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.projectId,
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
