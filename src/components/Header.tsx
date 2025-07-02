import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import UserMenu from './auth/UserMenu';
import AuthModal from './auth/AuthModal';

interface HeaderProps {
  onOpenAuthModal?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenAuthModal }) => {
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
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              YashTiles
              </h1>
            </div>
              <div className="flex items-center space-x-4">
              <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200 flex items-center space-x-2">
                <ShoppingCart size={18} />
                <span className="hidden sm:inline">₹399</span>
                <span className="sm:hidden">₹399</span>
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