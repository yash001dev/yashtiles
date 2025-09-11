"use client";

import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import SocialShareModal from './SocialShareModal';

interface ShareButtonProps {
  url: string;
  title: string;
  description: string;
  imageUrl?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const ShareButton: React.FC<ShareButtonProps> = ({
  url,
  title,
  description,
  imageUrl,
  className = '',
  variant = 'outline',
  size = 'md'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const baseClasses = "inline-flex items-center gap-2 font-medium transition-all duration-200 rounded-xl";
  
  const variantClasses = {
    primary: "bg-pink-600 text-white hover:bg-pink-700 shadow-md hover:shadow-lg",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    outline: "border-2 border-gray-200 text-gray-700 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700"
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-sm",
    lg: "px-6 py-4 text-base"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      >
        <Share2 className={iconSizes[size]} />
        Share
      </button>

      <SocialShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        url={url}
        title={title}
        description={description}
        imageUrl={imageUrl}
      />
    </>
  );
};

export default ShareButton;