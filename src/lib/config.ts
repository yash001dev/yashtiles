// Environment configuration
export const config = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  appName: process.env.NEXT_PUBLIC_APP_NAME || "YashTiles",
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || "development",

  // Feature flags
  features: {
    enableDebug: process.env.NEXT_PUBLIC_ENABLE_DEBUG === "true",
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
  },

  // Environment checks
  isDevelopment: process.env.NEXT_PUBLIC_ENVIRONMENT === "development",
  isStaging: process.env.NEXT_PUBLIC_ENVIRONMENT === "staging",
  isProduction: process.env.NEXT_PUBLIC_ENVIRONMENT === "production",

  // URLs for different environments
  urls: {
    development: "http://localhost:3000",
    staging: "https://yashtiles-staging.vercel.app",
    production: "https://yashtiles.com",
  },
};

export default config;
