'use client';

import { useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Button } from '@/components/ui/button';

/**
 * Example component demonstrating how to use the analytics hook
 * This is for demonstration purposes only and should not be used in production
 */
export default function ExampleUsage() {
  const { trackPageView, trackEvent, trackEcommerceEvent } = useAnalytics();
  
  // Track page view when component mounts
  useEffect(() => {
    trackPageView('Example Page');
  }, []);
  
  // Example event tracking
  const handleButtonClick = () => {
    trackEvent('Engagement', 'Button Click', 'Example Button');
    alert('Event tracked!');
  };
  
  // Example ecommerce tracking
  const handleAddToCart = () => {
    trackEcommerceEvent('add_to_cart', {
      currency: 'INR',
      value: 1999,
      items: [{
        item_id: 'FRAME-123',
        item_name: 'Custom Photo Frame',
        price: 1999,
        quantity: 1
      }]
    });
    alert('Ecommerce event tracked!');
  };
  
  return (
    <div className="p-4 border rounded-lg max-w-md mx-auto my-8">
      <h2 className="text-xl font-bold mb-4">Analytics Example</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Track Event</h3>
          <Button onClick={handleButtonClick}>
            Track Example Event
          </Button>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Track Ecommerce</h3>
          <Button onClick={handleAddToCart} variant="outline">
            Track Add to Cart
          </Button>
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        <p>Open your browser console and check <code>window.dataLayer</code> to see tracked events.</p>
      </div>
    </div>
  );
}