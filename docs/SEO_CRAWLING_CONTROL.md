# SEO and Crawling Control Implementation

This document explains how the site's crawling behavior is controlled based on the environment.

## Overview

The site implements environment-based crawling control where:
- **Production**: Site is fully crawlable by search engines
- **Development/Staging**: Site is completely blocked from search engines

## Implementation Components

### 1. Environment Detection

The system uses `NEXT_PUBLIC_ENVIRONMENT` environment variable to determine the current environment:
- `production` = Allow crawling
- Any other value = Block crawling

### 2. Dynamic Robots.txt (`/app/api/robots.txt/route.ts`)

- **Production**: Returns standard robots.txt with `Allow: /` and sitemap reference
- **Development/Staging**: Returns robots.txt with `Disallow: /` to block all crawlers

### 3. Meta Tags (`/app/(frontend)/layout.tsx`)

- **Production**: Standard meta tags with `index, follow`
- **Development/Staging**: Restrictive meta tags with `noindex, nofollow, noarchive, etc.`

### 4. HTTP Headers (`/next.config.js` and `/middleware.ts`)

- **Development/Staging**: Adds `X-Robots-Tag` header with restrictive directives
- **Production**: No additional blocking headers

### 5. Sitemap Configuration (`/next-sitemap.config.js`)

- **Production**: Generates sitemaps normally
- **Development/Staging**: Excludes all pages from sitemap generation

### 6. Utility Functions (`/src/utils/seo.ts`)

Provides helper functions:
- `isCrawlable()`: Check if current environment allows crawling
- `getRobotsMetaTag()`: Get appropriate robots meta tag content
- `getCanonicalUrl(path)`: Generate environment-appropriate canonical URLs
- `isProduction()`: Check if in production environment
- `getSitemapUrl()`: Get sitemap URL (only in production)

## Usage Examples

### Check if crawlable
```typescript
import { isCrawlable } from '@/utils/seo';

if (isCrawlable()) {
  // Add structured data, sitemaps, etc.
}
```

### Get robots meta tag
```typescript
import { getRobotsMetaTag } from '@/utils/seo';

const robotsContent = getRobotsMetaTag();
// Returns: "index, follow" or "noindex, nofollow, ..."
```

### Generate canonical URL
```typescript
import { getCanonicalUrl } from '@/utils/seo';

const canonical = getCanonicalUrl('/products');
// Returns: "https://photoframix.com/products"
```

## Environment Variables

Make sure to set the following environment variables:

```env
# Required: Controls crawling behavior
NEXT_PUBLIC_ENVIRONMENT=production  # or development/staging

# Optional: Used for canonical URLs and sitemaps
NEXT_PUBLIC_BASE_URL=https://photoframix.com
NEXT_PUBLIC_APP_NAME=YashTiles
```

## Testing

### Production Environment
1. Set `NEXT_PUBLIC_ENVIRONMENT=production`
2. Visit `/robots.txt` - should show `Allow: /`
3. Check page source - should have `index, follow` meta tags
4. Verify no `X-Robots-Tag` headers

### Development/Staging Environment
1. Set `NEXT_PUBLIC_ENVIRONMENT=development` (or any non-production value)
2. Visit `/robots.txt` - should show `Disallow: /`
3. Check page source - should have `noindex, nofollow` meta tags
4. Verify `X-Robots-Tag` headers present with restrictive directives

## Benefits

1. **Complete Protection**: Multiple layers prevent accidental indexing
2. **Environment Awareness**: Automatically adapts to deployment environment
3. **Developer Friendly**: Simple utility functions for consistent behavior
4. **Performance**: Minimal overhead with smart caching
5. **SEO Safe**: Proper handling of canonical URLs and sitemaps

## Files Modified/Created

- ✅ `/app/api/robots.txt/route.ts` - Dynamic robots.txt generation
- ✅ `/app/(frontend)/layout.tsx` - Meta tags based on environment
- ✅ `/next.config.js` - HTTP headers configuration
- ✅ `/next-sitemap.config.js` - Environment-aware sitemap generation
- ✅ `/middleware.ts` - Additional header protection
- ✅ `/src/utils/seo.ts` - SEO utility functions
- ✅ `/docs/SEO_CRAWLING_CONTROL.md` - This documentation

All components work together to ensure complete crawling control based on the environment setting.
