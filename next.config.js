/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is now stable in Next.js 14

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
        ],
      },
    ];
  },
};

module.exports = nextConfig;
