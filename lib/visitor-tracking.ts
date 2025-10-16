import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';

interface VisitorData {
  page: string;
  timestamp: Date;
  userAgent: string;
  referrer: string;
  sessionId: string;
}

// Generate a session ID for tracking unique visitors
export function getSessionId(): string {
  let sessionId = sessionStorage.getItem('visitor_session_id');
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem('visitor_session_id', sessionId);
  }
  
  return sessionId;
}

// Track a page visit
export async function trackPageVisit(page: string) {
  try {
    const sessionId = getSessionId();
    
    const visitData: VisitorData = {
      page,
      timestamp: new Date(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      referrer: typeof document !== 'undefined' ? document.referrer : 'direct',
      sessionId,
    };

    await addDoc(collection(db, 'visits'), visitData);
  } catch (error) {
    console.error('Error tracking visit:', error);
  }
}

// Get total visits count
export async function getTotalVisits(): Promise<number> {
  try {
    const visitsRef = collection(db, 'visits');
    const snapshot = await getDocs(visitsRef);
    return snapshot.size;
  } catch (error) {
    console.error('Error getting total visits:', error);
    return 0;
  }
}

// Get unique visitors count
export async function getUniqueVisitors(): Promise<number> {
  try {
    const visitsRef = collection(db, 'visits');
    const snapshot = await getDocs(visitsRef);
    
    const uniqueSessions = new Set();
    snapshot.forEach(doc => {
      uniqueSessions.add(doc.data().sessionId);
    });
    
    return uniqueSessions.size;
  } catch (error) {
    console.error('Error getting unique visitors:', error);
    return 0;
  }
}

// Get visits from last 24 hours
export async function getVisitsLast24Hours(): Promise<number> {
  try {
    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);
    
    const visitsRef = collection(db, 'visits');
    const q = query(
      visitsRef,
      where('timestamp', '>', Timestamp.fromDate(yesterday))
    );
    
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Error getting recent visits:', error);
    return 0;
  }
}

// Get recent visits with details
export async function getRecentVisits(limitCount: number = 10) {
  try {
    const visitsRef = collection(db, 'visits');
    const q = query(
      visitsRef,
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || new Date(),
    }));
  } catch (error) {
    console.error('Error getting recent visits:', error);
    return [];
  }
}

// Get page views breakdown
export async function getPageViewsBreakdown() {
  try {
    const visitsRef = collection(db, 'visits');
    const snapshot = await getDocs(visitsRef);
    
    const pageViews: { [key: string]: number } = {};
    
    snapshot.forEach(doc => {
      const page = doc.data().page || 'unknown';
      pageViews[page] = (pageViews[page] || 0) + 1;
    });
    
    return Object.entries(pageViews)
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error getting page views:', error);
    return [];
  }
}
