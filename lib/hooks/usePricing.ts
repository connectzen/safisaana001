import { useState } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type PricingType = 'product' | 'bundle';

export interface PricingItem {
  id: string;
  name: string;
  type: PricingType;
  productType?: 'plugin' | 'ebook' | 'course';
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  includes?: string[];
  paymentLink?: string;
  popular: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PricingFormData {
  name: string;
  type: PricingType;
  productType?: 'plugin' | 'ebook' | 'course';
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  includes?: string[];
  paymentLink?: string;
  popular: boolean;
  active: boolean;
}

export function usePricing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPricing = async (data: PricingFormData): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      // Remove undefined fields to avoid Firestore errors
      const cleanData: any = {
        name: data.name,
        type: data.type,
        price: data.price,
        description: data.description,
        features: data.features || [],
        popular: data.popular || false,
        active: data.active !== undefined ? data.active : true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      // Only add optional fields if they have values
      if (data.productType) {
        cleanData.productType = data.productType;
      }
      if (data.originalPrice !== undefined && data.originalPrice !== null) {
        cleanData.originalPrice = data.originalPrice;
      }
      if (data.includes && data.includes.length > 0) {
        cleanData.includes = data.includes;
      }
      if (data.paymentLink) {
        cleanData.paymentLink = data.paymentLink;
      }

      const docRef = await addDoc(collection(db, 'pricing'), cleanData);
      setLoading(false);
      return docRef.id;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add pricing';
      setError(message);
      setLoading(false);
      throw err;
    }
  };

  const getPricing = async (): Promise<PricingItem[]> => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, 'pricing'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const pricing: PricingItem[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          type: data.type,
          productType: data.productType,
          price: data.price,
          originalPrice: data.originalPrice,
          description: data.description,
          features: data.features || [],
          includes: data.includes,
          paymentLink: data.paymentLink,
          popular: data.popular || false,
          active: data.active !== undefined ? data.active : true,
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
        };
      });
      setLoading(false);
      return pricing;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch pricing';
      setError(message);
      setLoading(false);
      throw err;
    }
  };

  const getActivePricing = async (): Promise<PricingItem[]> => {
    const allPricing = await getPricing();
    return allPricing.filter(item => item.active);
  };

  const updatePricing = async (id: string, data: Partial<PricingFormData>): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      // Remove undefined fields to avoid Firestore errors
      const cleanData: any = {
        updatedAt: Timestamp.now(),
      };

      // Only add fields that are defined
      if (data.name !== undefined) cleanData.name = data.name;
      if (data.type !== undefined) cleanData.type = data.type;
      if (data.price !== undefined) cleanData.price = data.price;
      if (data.description !== undefined) cleanData.description = data.description;
      if (data.features !== undefined) cleanData.features = data.features;
      if (data.popular !== undefined) cleanData.popular = data.popular;
      if (data.active !== undefined) cleanData.active = data.active;
      if (data.productType !== undefined) cleanData.productType = data.productType;
      if (data.originalPrice !== undefined && data.originalPrice !== null) {
        cleanData.originalPrice = data.originalPrice;
      }
      if (data.includes !== undefined) {
        if (data.includes && data.includes.length > 0) {
          cleanData.includes = data.includes;
        } else {
          // Remove the includes field if it's empty
          cleanData.includes = [];
        }
      }
      if (data.paymentLink !== undefined) {
        cleanData.paymentLink = data.paymentLink || null;
      }

      const docRef = doc(db, 'pricing', id);
      await updateDoc(docRef, cleanData);
      setLoading(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update pricing';
      setError(message);
      setLoading(false);
      throw err;
    }
  };

  const deletePricing = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, 'pricing', id));
      setLoading(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete pricing';
      setError(message);
      setLoading(false);
      throw err;
    }
  };

  return {
    loading,
    error,
    addPricing,
    getPricing,
    getActivePricing,
    updatePricing,
    deletePricing,
  };
}
