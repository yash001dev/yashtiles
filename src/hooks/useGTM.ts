import { useEffect } from 'react';
import { initDataLayer, trackPageView, trackEvent, trackEcommerceEvent } from '../utils/gtm';
import type { ProductItem } from '../types/ecommerce';

/**
 * Hook for using Google Tag Manager in components
 */
export const useGTM = () => {
  // Initialize dataLayer on component mount
  useEffect(() => {
    initDataLayer();
  }, []);

  return {
    /**
     * Track a page view
     */
    trackPageView: (pageTitle: string, pagePath?: string) => {
      trackPageView(pageTitle, pagePath);
    },

    /**
     * Track a button click or user interaction
     */
    trackEvent: (eventName: string, eventCategory: string, eventLabel?: string, eventValue?: number) => {
      trackEvent(eventName, eventCategory, eventLabel, eventValue);
    },

    /**
     * Track an ecommerce event (add to cart, purchase, etc.)
     */
    trackEcommerceEvent: (
      eventType: 'add_to_cart' | 'remove_from_cart' | 'view_item' | 'begin_checkout' | 'purchase',
      items: ProductItem[],
      transactionId?: string,
      value?: number
    ) => {
      trackEcommerceEvent(eventType, items, transactionId, value);
    },
  };
};