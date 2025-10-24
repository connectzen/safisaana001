import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product, ProductFormData } from '@/types';

// Update the hook to be the default export
export function useProducts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      
      return { id: docRef.id, ...productData };
    } catch (err) {
      console.error('Error adding product:', err);
      setError('Failed to add product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProducts = async (): Promise<Product[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const q = query(
        collection(db, 'products'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate().toISOString(),
      } as Product));
    } catch (err) {
      console.error('Error getting products:', err);
      setError('Failed to load products');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, productData: Partial<ProductFormData>) => {
    try {
      setLoading(true);
      setError(null);
      
      await updateDoc(doc(db, 'products', id), {
        ...productData,
        updatedAt: Timestamp.now(),
      });
      
      return { id, ...productData };
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    addProduct,
    getProducts,
    updateProduct,
    deleteProduct,
  };
}
