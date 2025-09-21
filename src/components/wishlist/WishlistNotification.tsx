'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Check, X } from 'lucide-react';

interface WishlistNotificationProps {
  show: boolean;
  message: string;
  type: 'added' | 'removed';
  onClose: () => void;
  duration?: number;
}

export default function WishlistNotification({ 
  show, 
  message, 
  type, 
  onClose, 
  duration = 3000 
}: WishlistNotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'added':
        return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
      case 'removed':
        return <X className="w-5 h-5 text-gray-500" />;
      default:
        return <Check className="w-5 h-5 text-green-500" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'added':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'removed':
        return 'bg-gray-50 border-gray-200 text-gray-800';
      default:
        return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full mx-4`}
        >
          <div className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm ${getColors()}`}>
            {getIcon()}
            <span className="flex-1 text-sm font-medium">{message}</span>
            <button
              onClick={onClose}
              className="p-1 hover:bg-black/10 rounded-full transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Custom hook for managing wishlist notifications
export function useWishlistNotification() {
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'added' | 'removed';
  }>({
    show: false,
    message: '',
    type: 'added'
  });

  const showNotification = (message: string, type: 'added' | 'removed') => {
    setNotification({ show: true, message, type });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  return {
    notification,
    showNotification,
    hideNotification
  };
}