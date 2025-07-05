import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

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
  metadataBase: new URL("https://frameit.com"),
  title: "FrameIt - Transform Your Memories Into Stunning Wall Art",
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
  authors: [{ name: "FrameIt" }],
  creator: "FrameIt",
  publisher: "FrameIt",
  openGraph: {
    title: "FrameIt - Transform Your Memories Into Stunning Wall Art",
    description:
      "Upload your favorite photos and get them delivered as beautifully framed art.",
    url: "https://frameit.com",
    siteName: "FrameIt",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FrameIt - Custom Photo Framing",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FrameIt - Transform Your Memories Into Stunning Wall Art",
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
    canonical: "https://frameit.com",
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
        <meta name="theme-color" content="#166534" />
        <meta name="color-scheme" content="light dark" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "FrameIt",
              "url": "https://frameit.com",
              "logo": "https://frameit.com/logo.png",
              "description": "Transform your memories into stunning wall art with premium quality, handcrafted frames.",
              "sameAs": [
                "https://facebook.com/frameit",
                "https://instagram.com/frameit",
                "https://twitter.com/frameit"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-555-FRAMEIT",
                "contactType": "customer service"
              }
            })
          }}
        />
      </head>
      <body className="font-sans" suppressHydrationWarning={true}>
        <TooltipProvider>
          {children}
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </body>
    </html>
  );
}
