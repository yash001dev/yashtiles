'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Minus, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import FrameItHeader from '@/components/dashboard/FrameItHeader';
import FrameItFooter from '@/components/dashboard/FrameItFooter';
import { formatPrice } from '@/lib/utils';
import CheckoutModal from '@/components/checkout/CheckoutModal';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotalAmount } = useCart();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const handleQuantityChange = (id: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <>
      <FrameItHeader />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-8">Your Cart ({items.length} Items)</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-xl mb-4">Your cart is empty</h2>
            <Button onClick={() => router.push('/products')}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b py-4">
                  <div className="w-24 h-24 relative">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-cover rounded-md"
                        priority
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                    <p className="text-sm text-gray-500">Material: {item.material}</p>
                    <p className="text-sm text-gray-500">Color: {item.color}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                          className="p-2"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                          className="p-2"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="md:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
                <h2 className="text-lg font-semibold mb-4">Price Details</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sub Total</span>
                    <span>{formatPrice(getTotalAmount())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹59</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Grand Total</span>
                      <span>{formatPrice(getTotalAmount() + 59)}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  className="w-full mt-6"
                  onClick={() => setIsCheckoutModalOpen(true)}
                >
                  Continue to Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        items={items}
      />

      <FrameItFooter />
    </>
  );
}
