import { Metadata } from 'next';
import FrameItHeader from '@/components/dashboard/FrameItHeader';
import FrameItFooter from '@/components/dashboard/FrameItFooter';
import WishlistPage from '@/components/wishlist/WishlistPage';

export const metadata: Metadata = {
  title: 'My Wishlist | photoframix - Premium Photo Frames',
  description: 'View and manage your wishlist of favorite photo frames. Keep track of products you love and add them to cart when ready.',
  keywords: [
    'wishlist',
    'photo frames',
    'saved products',
    'favorites',
    'photoframix'
  ],
  openGraph: {
    title: 'My Wishlist | photoframix',
    description: 'View and manage your wishlist of favorite photo frames. Keep track of products you love and add them to cart when ready.',
    url: 'https://photoframix.com/wishlist',
    siteName: 'photoframix',
    images: [
      {
        url: 'https://photoframix.com/og-wishlist.jpg',
        width: 1200,
        height: 630,
        alt: 'My Wishlist - photoframix',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Wishlist | photoframix',
    description: 'View and manage your wishlist of favorite photo frames.',
    images: ['https://photoframix.com/og-wishlist.jpg'],
    site: '@photoframix',
    creator: '@photoframix',
  },
  robots: {
    index: false, // Wishlist is personal, no need to index
    follow: true,
  },
  alternates: {
    canonical: 'https://photoframix.com/wishlist',
  },
};

export default function WishlistPageRoute() {
  return (
    <>
      <FrameItHeader />
      <WishlistPage />
      <FrameItFooter />
    </>
  );
}