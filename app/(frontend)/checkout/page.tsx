'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import CheckoutModal from '@/components/checkout/CheckoutModal';
import FrameItHeader from '@/components/dashboard/FrameItHeader';
import FrameItFooter from '@/components/dashboard/FrameItFooter';

export default function CheckoutPage() {
  const { items } = useCart();
  const router = useRouter();

  React.useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <FrameItHeader />
      <main className="container mx-auto px-4 py-8">
        <CheckoutModal
          isOpen={true}
          onClose={() => router.push('/cart')}
          items={items}
        />
      </main>
      <FrameItFooter />
    </>
  );
}
