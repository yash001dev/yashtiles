/**
 * Google Tag Manager utilities
 */

// Define types for GTM events
type GTMEvent = {
  event: string;
  [key: string]: any;
};

import type { ProductItem } from '../types/ecommerce';

/**
 * Initialize the dataLayer array if it doesn't exist
 */
export const initDataLayer = (): void => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
  }
};

/**
 * Push an event to the dataLayer
 */
export const pushEvent = (event: GTMEvent): void => {
  if (typeof window !== 'undefined') {
    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
  }
};

/**
 * Track a page view
 */
export const trackPageView = (pageTitle: string, pagePath?: string): void => {
  if (typeof window === 'undefined') return;
  
  const path = pagePath || window.location.pathname;
  pushEvent({
    event: 'page_view',
    page_title: pageTitle,
    page_path: path,
  });
};

/**
 * Track a button click or user interaction
 */
export const trackEvent = (eventName: string, eventCategory: string, eventLabel?: string, eventValue?: number): void => {
  pushEvent({
    event: eventName,
    event_category: eventCategory,
    event_label: eventLabel,
    event_value: eventValue,
  });
};

/**
 * Track an ecommerce event (add to cart, purchase, etc.)
 */
export const trackEcommerceEvent = (eventType: 'add_to_cart' | 'remove_from_cart' | 'view_item' | 'begin_checkout' | 'purchase', items: ProductItem[], transactionId?: string, value?: number): void => {
  const ecommerceEvent: GTMEvent = {
    event: eventType,
    ecommerce: {
      items,
    },
  };

  // Add transaction details for purchase events
  if (eventType === 'purchase' && transactionId) {
    ecommerceEvent.ecommerce.transaction_id = transactionId;
    if (value !== undefined) {
      ecommerceEvent.ecommerce.value = value;
    }
    ecommerceEvent.ecommerce.currency = 'INR'; // Default currency
  }

  pushEvent(ecommerceEvent);
};

// Add type definitions for window object
declare global {
  interface Window {
    dataLayer?: Object[];
  }
}