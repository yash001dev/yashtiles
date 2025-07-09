'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { GoogleOAuthProvider } from '@react-oauth/google';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <NotificationProvider>
      <AuthProvider>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </GoogleOAuthProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}
