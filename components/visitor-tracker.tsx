'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageVisit } from '@/lib/visitor-tracking';

export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track dashboard visits (only track public pages)
    if (pathname && !pathname.startsWith('/dashboard')) {
      trackPageVisit(pathname);
    }
  }, [pathname]);

  return null; // This component doesn't render anything
}
