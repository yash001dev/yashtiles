# SEO and Crawling Setup Guide

## Current Issues Found:

1. **Domain Mismatch** ❌
   - robots.txt points to `photoframix.com`
   - sitemap.xml points to `yashtiles.com`
   - **FIXED**: Updated sitemap.xml to use consistent domain

2. **Missing Product Pages** ❌
   - Products not included in sitemap
   - **FIXED**: Created dynamic sitemap API for products

## Complete Setup for Next.js SEO & Crawling:

### 1. Required Files ✅
- [x] `robots.txt` (via API route)
- [x] `sitemap.xml` (dynamic generation)
- [x] Meta tags in pages
- [x] Structured data (JSON-LD)

### 2. Verification Steps:

#### A. Check Your Robots.txt:
Visit: `https://photoframix.com/robots.txt`
Should show:
```
User-agent: *
Allow: /
Host: https://photoframix.com
Sitemap: https://photoframix.com/sitemap.xml
```

#### B. Check Your Sitemap:
Visit: `https://photoframix.com/sitemap.xml`
Should include all your pages including products

#### C. Submit to Search Engines:
1. **Google Search Console**:
   - Add property: https://photoframix.com
   - Submit sitemap: https://photoframix.com/sitemap.xml
   - Request indexing for important pages

2. **Bing Webmaster Tools**:
   - Add site and submit sitemap

### 3. Additional SEO Requirements:

#### A. Meta Tags (Already implemented ✅)
- Title, description, keywords
- Open Graph tags
- Twitter Card tags

#### B. Structured Data (Check if implemented)
- Product schema for product pages
- Organization schema for homepage
- Breadcrumb schema

#### C. Performance Optimization
- Core Web Vitals
- Page load speed
- Mobile responsiveness

### 4. Crawling Troubleshooting:

#### Common Issues:
1. **New Domain**: Takes 1-4 weeks for new sites
2. **Noindex Tags**: Check for accidental noindex
3. **Server Errors**: Ensure 200 status codes
4. **Blocked Resources**: CSS/JS should be crawlable
5. **Content Quality**: Unique, valuable content

#### Tools to Check:
1. Google Search Console - Coverage report
2. Google PageSpeed Insights
3. Mobile-Friendly Test
4. Rich Results Test (for structured data)

### 5. Quick Actions:

1. **Regenerate Sitemap**: Run `npm run build` to update sitemap
2. **Submit to Google**: Use Google Search Console
3. **Check Indexing**: Use `site:photoframix.com` in Google
4. **Monitor**: Check Search Console weekly

### 6. Environment Variables Check:

Ensure these are set correctly:
```
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_BASE_URL=https://photoframix.com
```

## Next Steps:
1. Deploy the updated sitemap configuration
2. Submit sitemap to Google Search Console
3. Request indexing for key pages
4. Monitor indexing progress over 2-4 weeks