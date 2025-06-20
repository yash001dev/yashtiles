import React from 'react';
import { ShoppingCart } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-100">
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
              <span className="hidden sm:inline">US$25</span>
              <span className="sm:hidden">$25</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;