/**
 * Utility functions for SEO and crawling controls
 */

/**
 * Check if the site should be crawlable by search engines
 * @returns {boolean} True if the site is in production and should be crawled
 */
export function isCrawlable(): boolean {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';
}

/**
 * Get robots meta tag content based on environment
 * @returns {string} Robots meta tag content
 */
export function getRobotsMetaTag(): string {
  if (isCrawlable()) {
    return 'index, follow';
  }
  return 'noindex, nofollow, noarchive, nosnippet, noimageindex, nocache';
}

/**
 * Get environment-specific canonical URL
 * @param path {string} The path to append to the base URL
 * @returns {string} Full canonical URL
 */
export function getCanonicalUrl(path: string = ''): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://photoframix.com';
  return `${baseUrl}${path}`;
}

/**
 * Check if the current environment is production
 * @returns {boolean} True if in production environment
 */
export function isProduction(): boolean {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';
}

/**
 * Get environment-specific sitemap URL
 * @returns {string} Sitemap URL or undefined if not crawlable
 */
export function getSitemapUrl(): string | undefined {
  if (!isCrawlable()) {
    return undefined;
  }
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://photoframix.com';
  return `${baseUrl}/sitemap.xml`;
}
