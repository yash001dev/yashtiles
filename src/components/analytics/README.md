# Google Tag Manager Integration

This directory contains components and utilities for integrating Google Tag Manager (GTM) with the PhotoFramix application. GTM allows for easy tracking of user interactions, page views, and ecommerce events without modifying the core application code.

## Setup

1. The integration uses `@next/third-parties/google` for the GTM component
2. The GTM component is added to the root layout (`app/layout.tsx`)
3. Environment variables control the GTM configuration:
   - `NEXT_PUBLIC_ENABLE_ANALYTICS`: Enable/disable analytics tracking
   - `NEXT_PUBLIC_GTM_ID`: Your Google Tag Manager container ID (e.g., GTM-XXXXXXX)

## Environment Variables

Add the following to your `.env` files:

```
# Analytics
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

For development environments, you may want to set `NEXT_PUBLIC_ENABLE_ANALYTICS=false` to avoid tracking during development.

## Usage

### Tracking Page Views

Page views are automatically tracked when using the `useGTM` hook in your page components:

```tsx
import { useGTM } from '@/hooks/useGTM';

function MyPage() {
  const { trackPageView } = useGTM();
  
  // Track page view on component mount
  useEffect(() => {
    trackPageView('My Page Title');
  }, [trackPageView]);
  
  // Rest of your component
}
```

### Tracking Events

Track user interactions like button clicks:

```tsx
import { useGTM } from '@/hooks/useGTM';

function MyComponent() {
  const { trackEvent } = useGTM();
  
  const handleButtonClick = () => {
    trackEvent('button_click', 'user_interaction', 'Submit Button');
    // Your button click logic
  };
  
  return (
    <button onClick={handleButtonClick}>Click Me</button>
  );
}
```

### Tracking Ecommerce Events

Track ecommerce events like adding to cart or purchases:

```tsx
import { useGTM } from '@/hooks/useGTM';

function ProductComponent({ product }) {
  const { trackEcommerceEvent } = useGTM();
  
  const handleAddToCart = () => {
    trackEcommerceEvent('add_to_cart', [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: 1,
        item_category: product.category,
      },
    ]);
    // Your add to cart logic
  };
  
  return (
    <button onClick={handleAddToCart}>Add to Cart</button>
  );
}
```

## Implementation Details

### Components

- `GoogleTagManager.tsx`: Renders the GTM script and noscript iframe
- `ExampleUsage.tsx`: Example component demonstrating how to use the GTM hooks

### Hooks

- `useGTM.ts`: React hook for using GTM in components

### Utilities

- `gtm.ts`: Utility functions for GTM tracking

## Testing

To test the GTM integration:

1. Set up a GTM container and add your container ID to the environment variables
2. Use the GTM Preview mode to verify that events are being tracked correctly
3. Check the browser console for any errors related to GTM
4. Verify that the dataLayer is being populated with the correct events

## Resources

- [Next.js Third-Party Libraries](https://nextjs.org/docs/app/guides/third-party-libraries)
- [Google Tag Manager Documentation](https://developers.google.com/tag-manager)