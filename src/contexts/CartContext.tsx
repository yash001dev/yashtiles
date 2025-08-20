'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  size: string;
  color: string;
  material: string;
  quantity: number;
  customization: {
    size: string;
    color: string;
    material: string;
    price: {
      base: number;
      size: number;
      total: number;
    }
  };
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  proceedToCheckout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: CartItem) => {
    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(item => item.id === newItem.id);

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = {
          ...newItem,
          quantity: newItem.quantity
        };
        return updatedItems;
      }

      // Add new item if it doesn't exist
      return [...currentItems, newItem];
    });
  };

  const removeItem = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  const getTotalAmount = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const proceedToCheckout = () => {
    router.push('/checkout');
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalAmount,
      proceedToCheckout,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
