import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Providers } from "@/components/providers/Providers";
const prompt = Prompt({
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900"
  ],
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  variable: '--font-prompt',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://photoframix.com"),
  title: process.env.NEXT_PUBLIC_APP_NAME + " - Transform Your Memories Into Stunning Wall Art",
  description:
    "Upload your favorite photos and get them delivered as beautifully framed art. Premium quality, handcrafted frames that turn your memories into masterpieces.",
  keywords: [
    "photo framing",
    "wall art",
    "custom frames",
    "photo printing",
    "home decor",
    "picture frames",
    "photo gifts",
    "wall decoration",
  ],
  authors: [{ name: process.env.NEXT_PUBLIC_APP_NAME }],
  creator: process.env.NEXT_PUBLIC_APP_NAME,
  publisher: process.env.NEXT_PUBLIC_APP_NAME,
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: process.env.NEXT_PUBLIC_APP_NAME + " - Transform Your Memories Into Stunning Wall Art",
    description:
      "Upload your favorite photos and get them delivered as beautifully framed art.",
    url: "https://photoframix.com",
    siteName: process.env.NEXT_PUBLIC_APP_NAME,
    images: [
      {
        url: "/favicon.svg",
        width: 1200,
        height: 630,
        alt: process.env.NEXT_PUBLIC_APP_NAME + " - Custom Photo Framing",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: process.env.NEXT_PUBLIC_APP_NAME + " - Transform Your Memories Into Stunning Wall Art",
    description:
      "Upload your favorite photos and get them delivered as beautifully framed art.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://" + process.env.NEXT_PUBLIC_APP_NAME + ".com",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={prompt.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="icon" href="../src/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#166534" />
        <meta name="color-scheme" content="light dark" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "PhotoFramix",
              "url": "https://" + process.env.NEXT_PUBLIC_APP_NAME + ".com",
              "logo": "https://" + process.env.NEXT_PUBLIC_APP_NAME + ".com/logo.png",
              "description": "Transform your memories into stunning wall art with premium quality, handcrafted frames.",
              "sameAs": [
                "https://facebook.com/" + process.env.NEXT_PUBLIC_APP_NAME,
                "https://instagram.com/" + process.env.NEXT_PUBLIC_APP_NAME,
                "https://twitter.com/" + process.env.NEXT_PUBLIC_APP_NAME
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-555-PhotoFramix",
                "contactType": "customer service"
              }
            })
          }}
        />
      </head>
      <body className="font-sans" suppressHydrationWarning={true}>
        <Providers>
          {children}
          <Toaster />
          <Sonner />
        </Providers>
      </body>
    </html>
  );
}
