"use client";

import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail, 
  MessageCircle,
  Instagram,
  Copy,
  Check
} from 'lucide-react';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  description: string;
  imageUrl?: string;
}

const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  url,
  title,
  description,
  imageUrl
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedImage = imageUrl ? encodeURIComponent(imageUrl) : '';

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&t=${encodedTitle}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=photoframix`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${url}`,
    instagram: `https://www.instagram.com/`, // Instagram doesn't support direct sharing, opens app
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: shareLinks.facebook,
      color: 'bg-social-facebook hover:bg-social-facebook-hover',
      textColor: 'text-white'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: shareLinks.twitter,
      color: 'bg-social-twitter hover:bg-social-twitter-hover',
      textColor: 'text-white'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: shareLinks.linkedin,
      color: 'bg-social-linkedin hover:bg-social-linkedin-hover',
      textColor: 'text-white'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: shareLinks.whatsapp,
      color: 'bg-social-whatsapp hover:bg-social-whatsapp-hover',
      textColor: 'text-white'
    },
    {
      name: 'Email',
      icon: Mail,
      url: shareLinks.email,
      color: 'bg-social-email hover:bg-social-email-hover',
      textColor: 'text-white'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: shareLinks.instagram,
      color: 'bg-gradient-to-br from-social-instagram-purple via-social-instagram-pink to-social-instagram-orange hover:from-purple-700 hover:via-pink-600 hover:to-orange-500',
      textColor: 'text-white'
    }
  ];

  const openShareLink = (url: string, platform: string) => {
    if (platform === 'Email') {
      window.location.href = url;
    } else if (platform === 'Instagram') {
      // For Instagram, just open the app/website
      window.open(url, '_blank');
    } else {
      window.open(url, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-xl">
              <Share2 className="w-5 h-5 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Share this product</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="pt-0 px-6 pb-6">
          {/* Product Preview */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-start gap-3">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                  {title}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {description}
                </p>
              </div>
            </div>
          </div>

          {/* Social Platforms Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {socialPlatforms.map((platform) => {
              const IconComponent = platform.icon;
              return (
                <button
                  key={platform.name}
                  onClick={() => openShareLink(platform.url, platform.name)}
                  className={`${platform.color} ${platform.textColor} p-4 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-3 font-medium`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="text-sm">{platform.name}</span>
                </button>
              );
            })}
          </div>

          {/* Copy Link */}
          <div className="border-t border-gray-100 pt-6">
            <p className="text-sm font-medium text-gray-900 mb-3">Or copy link</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <input
                  type="text"
                  value={url}
                  readOnly
                  className="w-full bg-transparent text-sm text-gray-600 outline-none"
                />
              </div>
              <button
                onClick={copyToClipboard}
                className={`px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                  copied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-pink-600 text-white hover:bg-pink-700'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialShareModal;