'use client';

import React, { useState } from "react";
import { Frame, ShoppingCart } from "lucide-react";
import UserMenu from "./auth/UserMenu";
import AuthModal from "./auth/AuthModal";
import Link from "next/link";

interface HeaderProps {
  onOpenAuthModal?: () => void;
  onCartClick?: () => void;
  cartTotal?: number;
}

const Header: React.FC<HeaderProps> = ({
  onOpenAuthModal,
  onCartClick,
  cartTotal = 0,
}) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleOpenAuthModal = () => {
    if (onOpenAuthModal) {
      onOpenAuthModal();
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <header className="w-full bg-white shadow-sm border-b border-gray-100 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-8 md:gap-0">
            <div className="flex items-center space-x-2">
              <Frame className="h-8 w-8 text-primary" />
              <span className="text-xl md:text-2xl font-bold text-foreground">
                <Link href="/">{process.env.NEXT_PUBLIC_APP_NAME}</Link>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={onCartClick}
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <ShoppingCart size={18} />
                <span className="hidden sm:inline">₹{cartTotal}</span>
              </button>

              <UserMenu onOpenAuthModal={handleOpenAuthModal} />
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Header;
