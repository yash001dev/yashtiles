/** @type {import('next-sitemap').IConfig} */
const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';
const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://photoframix.com";

const sitemapExports = {
  siteUrl: siteUrl,
  // Only generate sitemap and robots.txt in production
  generateIndexSitemap: isProduction,
  // Don't generate robots.txt here since we have a custom API route
  generateRobotsTxt: false,
  // Only include pages if in production
  exclude: isProduction ? [] : ['*'],
  // Additional sitemap options for production
  ...(isProduction && {
    changefreq: 'daily',
    priority: 0.7,
    sitemapSize: 5000,
    autoLastmod: true,
  }),
};

export default sitemapExports;
