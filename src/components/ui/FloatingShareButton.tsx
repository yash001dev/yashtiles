"use client";

import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import SocialShareModal from './SocialShareModal';

interface FloatingShareButtonProps {
  url: string;
  title: string;
  description: string;
  imageUrl?: string;
  className?: string;
}

const FloatingShareButton: React.FC<FloatingShareButtonProps> = ({
  url,
  title,
  description,
  imageUrl,
  className = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-pink-600 text-white p-4 rounded-full shadow-lg hover:bg-pink-700 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-pink-300 md:hidden ${className}`}
        aria-label="Share this product"
      >
        <Share2 className="w-6 h-6" />
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

export default FloatingShareButton;