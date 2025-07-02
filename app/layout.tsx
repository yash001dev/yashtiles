import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'YashTiles Photo Frame Customizer',
  description: 'Customize your photo frames with YashTiles',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  )
} 