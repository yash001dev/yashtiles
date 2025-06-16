import React from 'react';
import { X } from 'lucide-react';

interface DesktopPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  anchorPosition?: { x: number; y: number };
}

const DesktopPopover: React.FC<DesktopPopoverProps> = ({
  isOpen,
  onClose,
  title,
  children,
  anchorPosition = { x: 50, y: 50 }
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-20 z-40"
        onClick={onClose}
      />
      
      {/* Popover */}
      <div
        className="fixed z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full mx-4"
        style={{
          left: '50%',
          bottom: '120px',
          transform: 'translateX(-50%)',
          animation: 'slideUpPopover 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="text-pink-500 hover:text-pink-600 font-medium transition-colors duration-200 text-sm"
            >
              Done
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X size={16} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-h-80 overflow-y-auto">
          {children}
        </div>

        {/* Arrow */}
        <div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full"
        >
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
          <div className="w-0 h-0 border-l-9 border-r-9 border-t-9 border-l-transparent border-r-transparent border-t-gray-200 absolute -top-px left-1/2 transform -translate-x-1/2"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUpPopover {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default DesktopPopover;