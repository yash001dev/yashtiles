/**
 * Utility functions for working with Google Tag Manager
 */

// Define the window dataLayer property
declare global {
  interface Window {
    dataLayer: any[];
  }
}

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
 * @param event The event object to push to the dataLayer
 */
export const pushEvent = (event: Record<string, any>): void => {
  if (typeof window === 'undefined') return;
  
  // Initialize dataLayer if it doesn't exist
  initDataLayer();
  
  // Push the event to the dataLayer
  window.dataLayer.push(event);
};

/**
 * Track a page view
 * @param pageTitle The title of the page
 * @param pagePath The path of the page (defaults to current path)
 */
export const trackPageView = (pageTitle: string, pagePath?: string): void => {
  const path = pagePath || (typeof window !== 'undefined' ? window.location.pathname : '');
  
  pushEvent({
    event: 'pageview',
    page: {
      title: pageTitle,
      path,
    },
  });
};

/**
 * Track a user event
 * @param category Event category (e.g., 'Engagement', 'Ecommerce')
 * @param action Event action (e.g., 'Click', 'Submit')
 * @param label Optional label for the event
 * @param value Optional numeric value for the event
 */
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
): void => {
  pushEvent({
    event: 'user_event',
    event_category: category,
    event_action: action,
    event_label: label,
    event_value: value,
  });
};

/**
 * Track an ecommerce event
 * @param eventType The type of ecommerce event (e.g., 'add_to_cart', 'purchase')
 * @param payload The ecommerce event payload
 */
export const trackEcommerceEvent = (
  eventType: string,
  payload: Record<string, any>
): void => {
  pushEvent({
    event: eventType,
    ecommerce: payload,
  });
};