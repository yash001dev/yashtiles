'use client';

import React from 'react';
import { OrdersList } from '@/components/OrdersList';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AuthModal from '@/components/auth/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  const handleViewOrderDetails = (orderId: string) => {
    // Navigate to order details page or open modal
    router.push(`/orders/${orderId}`);
  };

  const handleBackToHome = () => {
    router.push('/frame');
  };

  const AuthFallback = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <ShoppingBag className="h-8 w-8 text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Sign in to View Orders
        </h2>
        
        <p className="text-gray-600 mb-6">
          You need to be logged in to view your order history and track your purchases.
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={() => setShowAuthModal(true)}
            className="w-full"
            size="lg"
          >
            Sign In
          </Button>
          
          <Button 
            onClick={handleBackToHome}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
        
        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            initialMode="login"
          />
        )}
      </div>
    </div>
  );

  return (
    <ProtectedRoute fallback={<AuthFallback />}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={handleBackToHome}
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
                
                <div className="border-l border-gray-300 h-6"></div>
                
                <h1 className="text-xl font-semibold text-gray-900">My Orders</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <OrdersList onViewOrderDetails={handleViewOrderDetails} />
        </main>
      </div>
    </ProtectedRoute>
  );
}
