'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function TrafficTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const track = async () => {
      if (typeof window === 'undefined') return;
      if (localStorage.getItem('disable_tracking') === 'true') return;

      const sessionKey = `tracked_${pathname}`;
      if (sessionStorage.getItem(sessionKey)) return;

      try {
        await fetch('/api/traffic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: pathname,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          })
        });
        sessionStorage.setItem(sessionKey, 'true');
      } catch (e) {
        // Silent failure for analytics
      }
    };

    track();
  }, [pathname]);

  return null;
}
