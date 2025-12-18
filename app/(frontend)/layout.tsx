import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./frontend.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Providers } from "@/components/providers/Providers";
import StructuredData from "@/components/StructuredData";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { isCrawlable, getCanonicalUrl } from "@/utils/seo";
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
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.svg',
  },
  other: {
    'theme-color': '#166534',
    'color-scheme': 'light dark',
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
  robots: isCrawlable() ? {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  } : {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
      noimageindex: true,
      nocache: true,
    },
  },
  alternates: {
    canonical: getCanonicalUrl(),
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
        <GoogleAnalytics />
      </head>
      <body className="font-sans" suppressHydrationWarning={true}>
        <Providers>
          {children}
          <Toaster />
          <Sonner />
        </Providers>
        <StructuredData />
      </body>
    </html>
  );
}
