type EventNames =
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'begin_checkout'
  | 'purchase'
  | 'view_item'
  | 'view_item_list'
  | string;

interface AnalyticsEvent {
  action: EventNames;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

export const trackEvent = ({ action, ...params }: AnalyticsEvent) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      ...params,
    });
  }
};

export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-8F5155H1BD', {
      page_path: url,
    });
  }
};

// Navigation and interaction events
export const trackNavigation = (buttonName: string, destination: string) => {
  trackEvent({
    action: 'navigation_click',
    category: 'Navigation',
    label: buttonName,
    destination,
  });
};

export const trackStartFraming = () => {
  trackEvent({
    action: 'start_framing_click',
    category: 'User Journey',
    label: 'Start Framing Button',
  });
};

export const trackFaqClick = (questionId: string, questionText: string) => {
  trackEvent({
    action: 'faq_interaction',
    category: 'Content',
    label: 'FAQ Click',
    question_id: questionId,
    question_text: questionText,
  });
};

export const trackCartButtonClick = () => {
  trackEvent({
    action: 'cart_button_click',
    category: 'Navigation',
    label: 'Cart Button',
  });
};

// E-commerce specific events
export const trackAddToCart = (item: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) => {
  trackEvent({
    action: 'add_to_cart',
    currency: 'INR',
    value: item.price * item.quantity,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      },
    ],
  });
};

export const trackRemoveFromCart = (item: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) => {
  trackEvent({
    action: 'remove_from_cart',
    currency: 'INR',
    value: item.price * item.quantity,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      },
    ],
  });
};

export const trackBeginCheckout = (items: Array<{
  id: string;
  name: string;
  price: number;
  quantity: number;
}>) => {
  trackEvent({
    action: 'begin_checkout',
    currency: 'INR',
    value: items.reduce((total, item) => total + item.price * item.quantity, 0),
    items: items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
};
