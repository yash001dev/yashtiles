# Google Tag Manager Integration

This directory contains components and utilities for integrating Google Tag Manager (GTM) into the application.

## Setup

1. Create a Google Tag Manager account and container at [tagmanager.google.com](https://tagmanager.google.com/)
2. Get your GTM container ID (format: `GTM-XXXXXXX`)
3. Add the GTM ID to your environment variables:

```
# .env.local or appropriate environment file
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|--------|
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Enable/disable analytics globally | `false` |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container ID | - |
| `NEXT_PUBLIC_ENABLE_ANALYTICS_IN_DEV` | Enable analytics in development environment | `false` |

## Usage

### Tracking Page Views

Page views are automatically tracked when using the Next.js App Router, but you can also manually track page views:

```tsx
import { useAnalytics } from '@/hooks/useAnalytics';

export default function MyPage() {
  const { trackPageView } = useAnalytics();
  
  useEffect(() => {
    trackPageView('My Page Title');
  }, []);
  
  return <div>My Page Content</div>;
}
```

### Tracking Events

```tsx
import { useAnalytics } from '@/hooks/useAnalytics';

export default function MyComponent() {
  const { trackEvent } = useAnalytics();
  
  const handleButtonClick = () => {
    trackEvent('Engagement', 'Button Click', 'Submit Form');
    // Do something...
  };
  
  return <button onClick={handleButtonClick}>Submit</button>;
}
```

### Tracking E-commerce Events

```tsx
import { useAnalytics } from '@/hooks/useAnalytics';

export default function ProductPage({ product }) {
  const { trackEcommerceEvent } = useAnalytics();
  
  const handleAddToCart = () => {
    trackEcommerceEvent('add_to_cart', {
      currency: 'INR',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: 1
      }]
    });
    // Add to cart logic...
  };
  
  return <button onClick={handleAddToCart}>Add to Cart</button>;
}
```

## Implementation Details

- `GoogleTagManager.tsx`: Core component that injects GTM scripts
- `Analytics.tsx`: Wrapper component that conditionally loads GTM based on environment variables
- `analytics.ts`: Utility functions for working with the dataLayer
- `useAnalytics.ts`: Custom hook for using analytics in components

## Testing

To verify that GTM is working correctly:

1. Set `NEXT_PUBLIC_ENABLE_ANALYTICS=true` and `NEXT_PUBLIC_ENABLE_ANALYTICS_IN_DEV=true` in your development environment
2. Open your site in development mode
3. Open the browser console and type `window.dataLayer` - you should see an array with at least one entry
4. Use the [Google Tag Assistant](https://tagassistant.google.com/) to verify that GTM is loading correctly