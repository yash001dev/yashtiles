import { useEffect } from 'react';
import { trackPageView, trackEvent, trackEcommerceEvent, initDataLayer } from '@/utils/analytics';

/**
 * Custom hook for using analytics in components
 */
export function useAnalytics() {
  // Initialize dataLayer when the hook is first used
  useEffect(() => {
    initDataLayer();
  }, []);

  return {
    /**
     * Track a page view
     * @param pageTitle The title of the page
     * @param pagePath The path of the page (defaults to current path)
     */
    trackPageView: (pageTitle: string, pagePath?: string) => {
      trackPageView(pageTitle, pagePath);
    },

    /**
     * Track a user event
     * @param category Event category (e.g., 'Engagement', 'Ecommerce')
     * @param action Event action (e.g., 'Click', 'Submit')
     * @param label Optional label for the event
     * @param value Optional numeric value for the event
     */
    trackEvent: (category: string, action: string, label?: string, value?: number) => {
      trackEvent(category, action, label, value);
    },

    /**
     * Track an ecommerce event
     * @param eventType The type of ecommerce event (e.g., 'add_to_cart', 'purchase')
     * @param payload The ecommerce event payload
     */
    trackEcommerceEvent: (eventType: string, payload: Record<string, any>) => {
      trackEcommerceEvent(eventType, payload);
    },
  };
}