'use client';

import { useEffect, useState } from 'react';
import GoogleTagManager from './GoogleTagManager';

export default function Analytics() {
  const [mounted, setMounted] = useState(false);
  
  // Get environment variables
  const enableAnalytics = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true';
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;
  
  // Only run on client-side
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Don't render anything on server-side
  if (!mounted) return null;
  
  // Don't load analytics if disabled or GTM ID is missing
  if (!enableAnalytics || !gtmId) return null;
  
  // Don't load analytics in development unless explicitly enabled
  if (environment === 'development' && process.env.NEXT_PUBLIC_ENABLE_ANALYTICS_IN_DEV !== 'true') {
    console.log('Analytics disabled in development. Set NEXT_PUBLIC_ENABLE_ANALYTICS_IN_DEV=true to enable.');
    return null;
  }
  
  return <GoogleTagManager gtmId={gtmId} />;
}