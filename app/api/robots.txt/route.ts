import { NextResponse } from 'next/server';

export async function GET() {
  const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://photoframix.com';

  if (isProduction) {
    // Allow crawling in production
    const robotsContent = `# Production robots.txt - Site is crawlable
User-agent: *
Allow: /

# Host
Host: ${baseUrl}

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
`;

    return new NextResponse(robotsContent, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } else {
    // Restrict crawling in development/staging
    const robotsContent = `# Development/Staging robots.txt - Site is not crawlable
User-agent: *
Disallow: /

# This site is in development/staging mode and should not be indexed
`;

    return new NextResponse(robotsContent, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache', // Don't cache in dev
      },
    });
  }
}
