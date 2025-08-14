/** @type {import('next').NextConfig} */
import { withPayload } from "@payloadcms/next/withPayload";
const nextConfig = {
  // App directory is now stable in Next.js 14
  
  // CSS configuration for Payload compatibility
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
    // Ensure CSS modules work properly with Payload
    cssChunking: 'strict',
  },
  
  // Webpack configuration to handle CSS conflicts
  webpack: (config, { isServer }) => {
    // Ensure Payload CSS is loaded with higher specificity
    config.module.rules.push({
      test: /\.scss$/,
      include: /app\/\(payload\)/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: false,
            importLoaders: 2,
          },
        },
        'sass-loader',
      ],
    });
    
    return config;
  },
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
  // Environment-specific configuration
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Public runtime configuration
  publicRuntimeConfig: {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
  },

  // Redirects based on environment
  async redirects() {
    const redirects = [];

    // Only add redirects in production
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === "production") {
      redirects.push({
        source: "/home",
        destination: "/",
        permanent: true,
      });
    }

    return redirects;
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Environment",
            value: process.env.NEXT_PUBLIC_ENVIRONMENT || "development",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/fonts/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default withPayload(nextConfig);
