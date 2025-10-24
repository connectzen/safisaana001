import { db } from './firebase';
import { collection, doc, getDoc, getDocs, query, where, setDoc, Timestamp } from 'firebase/firestore';

/**
 * Check if a user owns a specific product
 */
export async function checkUserOwnsProduct(userId: string, productId: string): Promise<boolean> {
  if (!userId || !productId) return false;

  try {
    const purchaseRef = doc(db, 'purchases', `${userId}_${productId}`);
    const purchaseDoc = await getDoc(purchaseRef);
    
    return purchaseDoc.exists() && purchaseDoc.data()?.status === 'completed';
  } catch (error) {
    console.error('Error checking product ownership:', error);
    return false;
  }
}

/**
 * Get all products owned by a user
 */
export async function getUserPurchases(userId: string): Promise<string[]> {
  if (!userId) return [];

  try {
    const purchasesQuery = query(
      collection(db, 'purchases'),
      where('userId', '==', userId),
      where('status', '==', 'completed')
    );
    
    const snapshot = await getDocs(purchasesQuery);
    return snapshot.docs.map(doc => doc.data().productId);
  } catch (error) {
    console.error('Error fetching user purchases:', error);
    return [];
  }
}

/**
 * Record a product purchase (called from webhook after successful payment)
 * This should be called server-side only
 */
export async function recordPurchase(
  userId: string,
  productId: string,
  productName: string,
  amount: number,
  transactionId: string
) {
  try {
    const purchaseId = `${userId}_${productId}`;
    const purchaseRef = doc(db, 'purchases', purchaseId);
    
    await setDoc(purchaseRef, {
      userId,
      productId,
      productName,
      amount,
      transactionId,
      status: 'completed',
      purchasedAt: Timestamp.now(),
      createdAt: Timestamp.now(),
    });
    
    console.log(`✅ Purchase recorded: ${productName} for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error recording purchase:', error);
    throw error;
  }
}

/**
 * Get purchase details for a user and product
 */
export async function getPurchaseDetails(userId: string, productId: string) {
  if (!userId || !productId) return null;

  try {
    const purchaseRef = doc(db, 'purchases', `${userId}_${productId}`);
    const purchaseDoc = await getDoc(purchaseRef);
    
    if (purchaseDoc.exists()) {
      return {
        id: purchaseDoc.id,
        ...purchaseDoc.data(),
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching purchase details:', error);
    return null;
  }
}
