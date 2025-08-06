# E-commerce Pages Usage Guide

This document provides examples and usage instructions for the newly implemented e-commerce pages using Contentful as a headless CMS.

## Overview

The implementation includes three main pages:
1. **Product Listing Page (PLP)** - `/products`
2. **Product Detail Page (PDP)** - `/products/[id]`
3. **Buy/Checkout Page** - `/buy`

## Page Features

### 1. Product Listing Page (`/products`)

**Features:**
- Grid layout displaying all products
- Category-based filtering
- Pagination (12 products per page)
- Product cards with images, titles, prices, and stock status
- Responsive design

**Key Components:**
- `ProductListingPage` - Main container
- `ProductCard` - Individual product display
- `ProductFilters` - Category filtering
- `ProductPagination` - Page navigation

**Usage:**
```tsx
// Access the page
http://localhost:3001/products

// Filter by category (automatic via UI)
// Products are fetched from Contentful with real-time filtering
```

### 2. Product Detail Page (`/products/[id]`)

**Features:**
- Two-column layout (image gallery + product info)
- Image gallery with thumbnails and zoom
- Rich text description rendering
- Product specifications and features
- Buy Now and Add to Cart buttons
- Breadcrumb navigation
- SEO optimized with dynamic metadata

**Key Components:**
- `ProductDetailPage` - Main container
- `ProductImageGallery` - Image display with zoom
- `ProductInfo` - Product details and pricing
- `ProductDescription` - Rich text content
- `BuyButton` - Purchase actions

**Usage:**
```tsx
// Access via product ID
http://localhost:3001/products/[contentful-product-id]

// Example with real ID
http://localhost:3001/products/6KntaYXaHSyIw8M6eoGOqY
```

### 3. Buy/Checkout Page (`/buy`)

**Features:**
- Two-step checkout process (Shipping → Payment)
- Order summary with pricing breakdown
- Form validation
- Responsive design
- Security badges and trust indicators
- Session-based purchase data

**Key Components:**
- `BuyPage` - Main checkout container
- `ShippingForm` - Customer information
- `PaymentForm` - Payment details (demo)
- `OrderSummary` - Purchase overview

**Usage:**
```tsx
// Accessed via "Buy Now" button from PDP
// Purchase data is stored in sessionStorage
// Includes shipping cost calculation and tax
```

## Data Flow

### 1. Content Management
```
Contentful CMS → Content Delivery API → Next.js Application
```

### 2. Product Display Flow
```
User visits /products → 
Fetch products from Contentful → 
Display in grid with filtering → 
User clicks product → 
Navigate to /products/[id] → 
Fetch single product → 
Display detailed view
```

### 3. Purchase Flow
```
User clicks "Buy Now" → 
Store product data in sessionStorage → 
Navigate to /buy → 
Shipping form → 
Payment form → 
Process order (demo) → 
Redirect to success page
```

## Content Model Structure

### Product Content Type
```json
{
  "productTitle": "String",
  "description": "Rich Text",
  "price": "Number",
  "images": "Array of Media",
  "category": "String",
  "stockStatus": "Boolean",
  "slug": "String (optional)"
}
```

### Example Product Data
```json
{
  "productTitle": "Premium Canvas Frame 12x16",
  "description": {
    "nodeType": "document",
    "content": [
      {
        "nodeType": "paragraph",
        "content": [
          {
            "nodeType": "text",
            "value": "High-quality canvas frame perfect for artwork and photography."
          }
        ]
      }
    ]
  },
  "price": 45.99,
  "category": "canvas",
  "stockStatus": true,
  "images": [
    {
      "fields": {
        "title": "Canvas Frame Front View",
        "file": {
          "url": "//images.ctfassets.net/space/asset-id/image.jpg"
        }
      }
    }
  ]
}
```

## API Integration

### Contentful Client Configuration
```typescript
// src/lib/contentful.ts
import { createClient } from 'contentful';

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN!,
  environment: 'master'
});
```

### Key Functions
```typescript
// Fetch all products with filtering and pagination
getProducts({ limit: 12, skip: 0, category: 'frames' })

// Fetch single product
getProduct(productId)

// Get optimized image URL
getOptimizedImageUrl(imageUrl, width, height, quality)
```

## Styling and Theming

### Design System
- **Color Scheme**: Blue primary (#2563eb), Gray neutrals
- **Typography**: System fonts with proper hierarchy
- **Spacing**: Consistent padding and margins
- **Components**: Rounded corners, subtle shadows, hover effects

### Responsive Breakpoints
```css
/* Mobile First */
grid-cols-1          /* Mobile */
sm:grid-cols-2       /* Small tablets */
lg:grid-cols-3       /* Tablets */
xl:grid-cols-4       /* Desktop */
```

## Performance Optimizations

### Image Optimization
- Next.js Image component with lazy loading
- Contentful image transformations
- WebP format support
- Responsive sizing

### Data Fetching
- Server-side rendering for SEO
- Client-side filtering for better UX
- Pagination to limit data transfer
- Error handling and loading states

## Testing the Implementation

### 1. Local Development
```bash
# Install dependencies
npm install

# Set up environment variables
# Create .env.local with Contentful credentials

# Start development server
npm run dev

# Visit pages
http://localhost:3001/products
```

### 2. Test Scenarios

**Product Listing:**
- [ ] Products load correctly
- [ ] Category filtering works
- [ ] Pagination functions
- [ ] Product cards display properly
- [ ] Links navigate to correct PDPs

**Product Detail:**
- [ ] Product details display
- [ ] Image gallery works
- [ ] Rich text renders correctly
- [ ] Buy button functions
- [ ] Breadcrumbs navigate properly

**Checkout Process:**
- [ ] Buy button stores data correctly
- [ ] Shipping form validates
- [ ] Payment form validates
- [ ] Order summary calculates correctly
- [ ] Success flow completes

## Customization Examples

### Adding New Product Fields
```typescript
// Update types in src/types/index.ts
export interface ProductFields {
  // ... existing fields
  salePrice?: number;
  brand?: string;
  tags?: string[];
}

// Update Contentful queries in src/lib/contentful.ts
// Add fields to content model in Contentful
```

### Custom Styling
```tsx
// Update component styles
<div className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg">
  Custom styled component
</div>
```

### Adding Payment Integration
```typescript
// In BuyButton component
const handlePayment = async () => {
  // Integrate with Stripe, PayPal, etc.
  const paymentIntent = await createPaymentIntent({
    amount: product.price * 100, // cents
    currency: 'usd'
  });
};
```

## Deployment Considerations

### Environment Variables
```bash
# Production environment
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=production_space_id
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=production_token
NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT=master
```

### Build Optimization
```bash
# Build for production
npm run build

# Verify static generation
npm run start
```

### SEO Configuration
- Dynamic metadata for each product
- Structured data for rich snippets
- Optimized images with alt text
- Proper heading hierarchy

This implementation provides a solid foundation for an e-commerce site with Contentful as the content management system. The modular structure makes it easy to extend and customize based on specific business requirements.