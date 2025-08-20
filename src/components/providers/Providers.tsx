'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { CartProvider } from '@/contexts/CartContext';



interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
      <Provider store={store}>
        <NotificationProvider>
          <AuthProvider>
            <CartProvider>
              <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
                <TooltipProvider>
                  {children}
                </TooltipProvider>
              </GoogleOAuthProvider>
            </CartProvider>
          </AuthProvider>
        </NotificationProvider>
      </Provider>
  );
}
