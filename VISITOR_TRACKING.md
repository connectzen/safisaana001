# Visitor Tracking System 👁️

## Overview
Implemented a complete visitor tracking system that logs page visits to Firestore and displays analytics on the admin dashboard.

---

## Features Implemented

### ✅ Automatic Tracking
- Tracks every page visit automatically
- Records page URL, timestamp, user agent, and referrer
- Creates unique session IDs for visitor identification
- Only tracks public pages (excludes dashboard)

### ✅ Dashboard Analytics
- **Total Visitors**: All-time page views
- **Unique Visitors**: Unique sessions tracked
- **Last 24h Visits**: Recent activity count
- **Recent Visitors**: Latest 5 page visits with timestamps
- **Popular Pages**: Top 5 most visited pages

---

## How It Works

### 1. **Session Tracking**
```typescript
// Generates unique session ID per browser session
function getSessionId(): string
```
- Stored in `sessionStorage`
- Persists during browser session
- New ID created when browser is closed and reopened

### 2. **Page Visit Logging**
```typescript
// Tracks page visit to Firestore
function trackPageVisit(page: string)
```
**Data Stored:**
- `page`: URL path (e.g., "/", "/pricing")
- `timestamp`: Visit date/time
- `userAgent`: Browser information
- `referrer`: Where visitor came from
- `sessionId`: Unique session identifier

### 3. **Analytics Functions**
```typescript
getTotalVisits()        // Total page views
getUniqueVisitors()     // Unique sessions
getVisitsLast24Hours()  // Recent visits
getRecentVisits(limit)  // Latest visits with details
getPageViewsBreakdown() // Page popularity ranking
```

---

## Dashboard Display

### **Stats Cards (Top Row):**
```
┌─────────────────────────────────────────────┐
│  Total       Total        Unique    Last    │
│ Products    Visitors    Visitors   24h      │
│    5          127          45       12       │
└─────────────────────────────────────────────┘
```

### **Recent Visitors Card:**
```
┌────────────────────────────────────┐
│ 👁️ Recent Visitors                │
├────────────────────────────────────┤
│ 👁️ /pricing                       │
│    Oct 16, 2025, 11:15 PM         │
├────────────────────────────────────┤
│ 👁️ /                              │
│    Oct 16, 2025, 11:10 PM         │
├────────────────────────────────────┤
│ 👁️ /products                      │
│    Oct 16, 2025, 11:05 PM         │
└────────────────────────────────────┘
```

### **Popular Pages Card:**
```
┌────────────────────────────────────┐
│ 📊 Popular Pages                   │
├────────────────────────────────────┤
│ 1  /                    45 views   │
│ 2  /pricing             32 views   │
│ 3  /products            28 views   │
│ 4  /about               15 views   │
│ 5  /support             12 views   │
└────────────────────────────────────┘
```

---

## Firestore Structure

### Collection: `visits`
```javascript
{
  page: "/pricing",
  timestamp: Timestamp,
  userAgent: "Mozilla/5.0...",
  referrer: "https://google.com",
  sessionId: "session_1697568000_abc123"
}
```

### Indexes Needed:
Firestore will auto-create these when you first run queries:
- `timestamp` (for recent visits)
- `sessionId` (for unique visitors)

---

## Files Created/Modified

### New Files:
1. **`lib/visitor-tracking.ts`**
   - Core tracking functions
   - Analytics calculations
   - Firestore queries

2. **`components/visitor-tracker.tsx`**
   - Auto-tracking component
   - Monitors route changes
   - Logs visits to Firestore

### Modified Files:
1. **`app/layout.tsx`**
   - Added `<VisitorTracker />` component
   - Tracks all page visits automatically

2. **`app/dashboard/page.tsx`**
   - Display visitor statistics
   - Show recent visitors
   - Show popular pages

---

## Privacy & Data

### What We Track:
✅ Page URLs visited  
✅ Visit timestamps  
✅ Browser user agent  
✅ Referrer source  
✅ Session IDs (anonymous)  

### What We DON'T Track:
❌ Personal information  
❌ IP addresses  
❌ User names/emails  
❌ Dashboard activity  
❌ Form data  
❌ Passwords  

---

## Usage Examples

### Track a Custom Event:
```typescript
import { trackPageVisit } from '@/lib/visitor-tracking';

// Track custom page
await trackPageVisit('/custom-page');
```

### Get Stats in Component:
```typescript
import { getTotalVisits, getUniqueVisitors } from '@/lib/visitor-tracking';

const [stats, setStats] = useState({ total: 0, unique: 0 });

useEffect(() => {
  async function loadStats() {
    const total = await getTotalVisits();
    const unique = await getUniqueVisitors();
    setStats({ total, unique });
  }
  loadStats();
}, []);
```

---

## Performance

### Optimization:
- ✅ Async tracking (doesn't block page load)
- ✅ Session-based (reduces duplicate tracking)
- ✅ Batch queries with `Promise.all()`
- ✅ Limited recent visits (only fetch 5-10)

### Firestore Usage:
- **Reads**: ~6 per dashboard load
- **Writes**: 1 per page visit
- **Storage**: ~200 bytes per visit

---

## Future Enhancements

### Phase 1: Advanced Analytics
- 📊 Visit charts (daily/weekly/monthly)
- 🌍 Geographic location (country/city)
- 📱 Device breakdown (mobile/desktop)
- ⏱️ Time on page tracking

### Phase 2: Real-time Updates
- 🔴 Live visitor count
- ⚡ Real-time dashboard updates
- 🔔 Visitor notifications

### Phase 3: Conversion Tracking
- 🛒 Track product views → purchases
- 📈 Conversion funnel analysis
- 💰 Revenue per visitor
- 🎯 A/B testing support

---

## Testing

### Check If Tracking Works:
1. Visit your homepage as a regular user
2. Navigate to a few pages (pricing, products, etc.)
3. Go to Dashboard as admin
4. Check the stats cards for visitor counts
5. Look at "Recent Visitors" section

### Verify in Firebase Console:
1. Open Firebase Console
2. Go to Firestore Database
3. Check `visits` collection
4. You should see documents for each page visit

---

## Troubleshooting

### No visitors showing?
- ✅ Check Firebase rules allow writes to `visits` collection
- ✅ Verify `<VisitorTracker />` is in layout.tsx
- ✅ Visit public pages (not dashboard)
- ✅ Check browser console for errors

### Counts seem wrong?
- Session IDs reset when browser closes
- Clear sessionStorage to test fresh session
- Check Firestore for duplicate entries

### Dashboard loading slow?
- Limit recent visits query (currently 5)
- Add Firestore indexes if prompted
- Consider caching stats data

---

## Security

### Firestore Rules:
Make sure your Firestore rules allow writes to `visits`:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /visits/{visitId} {
      allow create: if true; // Anyone can track visits
      allow read: if request.auth != null; // Only authenticated users can read
    }
  }
}
```

---

## Summary

✅ **Automatic tracking** on all public pages  
✅ **Dashboard analytics** with real data  
✅ **Recent visitors** list with timestamps  
✅ **Popular pages** ranking  
✅ **Privacy-friendly** (no personal data)  
✅ **Production-ready** and scalable  

Your dashboard now tracks every visitor and displays comprehensive analytics! 🎉
