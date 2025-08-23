import React, { useState } from 'react';
import { User, LogOut, Settings, Package, Shield, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';

interface UserMenuProps {
  onOpenAuthModal?: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ onOpenAuthModal }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { addNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      addNotification({
        type: 'success',
        title: 'Signed out successfully',
        message: 'You have been logged out of your account.'
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLogin = () => {
    setIsOpen(false);
    onOpenAuthModal?.();
  };

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  const isAdmin = user?.role === 'admin';

  if (!isAuthenticated) {
    return (
      <button
        onClick={handleLogin}
        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
      >
        <User size={18} />
        <span className="hidden sm:inline">Sign In</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      >
        {/* {user?.avatar ? (
          <img
            src={user.avatar}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) :  */}
        
          <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
        
        <span className="hidden md:block text-sm font-medium text-gray-700">
          {user?.firstName} {user?.lastName}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />          
          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>

            <div className="py-1">
              <button
                onClick={() => handleNavigation('/orders')}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <Package size={16} className="mr-3" />
                My Orders
              </button>
              
              {/* <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <Settings size={16} className="mr-3" />
                Account Settings
              </button> */}
            </div>

            {/* Admin Section - Only visible for admin users */}
            {isAdmin && (
              <div className="border-t border-gray-100 py-1">
                <div className="px-4 py-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Admin
                  </p>
                </div>
                
                <button
                  onClick={() => handleNavigation('/admin')}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                >
                  <BarChart3 size={16} className="mr-3 text-blue-600" />
                  Dashboard
                </button>
                
                <button
                  onClick={() => handleNavigation('/admin/orders')}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                >
                  <Shield size={16} className="mr-3 text-blue-600" />
                  Manage Orders
                </button>
              </div>
            )}

            <div className="border-t border-gray-100 py-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <LogOut size={16} className="mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
