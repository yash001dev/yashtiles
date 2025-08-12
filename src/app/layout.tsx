import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'YashTiles - Premium Custom Frames',
  description: 'Transform your memories into beautiful custom frames with YashTiles. Premium quality, fast delivery.',
  keywords: 'custom frames, photo frames, wall art, home decor, personalized gifts',
  authors: [{ name: 'YashTiles' }],
  creator: 'YashTiles',
  publisher: 'YashTiles',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yashtiles.com',
    siteName: 'YashTiles',
    title: 'YashTiles - Premium Custom Frames',
    description: 'Transform your memories into beautiful custom frames with YashTiles. Premium quality, fast delivery.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'YashTiles - Premium Custom Frames',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YashTiles - Premium Custom Frames',
    description: 'Transform your memories into beautiful custom frames with YashTiles. Premium quality, fast delivery.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}