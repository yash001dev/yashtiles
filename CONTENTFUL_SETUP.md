# Contentful E-commerce Setup Guide

This guide will help you set up the Contentful integration for the Product Listing Page (PLP), Product Detail Page (PDP), and Buy Page.

## Prerequisites

1. A Contentful account (free tier available at [contentful.com](https://www.contentful.com))
2. Node.js and npm installed
3. This Next.js project set up and running

## Step 1: Create Contentful Space and Content Model

### 1.1 Create a new Contentful Space
1. Log in to your Contentful account
2. Create a new space for your e-commerce project
3. Note down your Space ID (you'll need this later)

### 1.2 Create the Product Content Model
1. Go to **Content model** in your Contentful space
2. Click **Add content type**
3. Name it "Product" with API identifier "product"
4. Add the following fields:

#### Required Fields:
- **Product Title** (`productTitle`)
  - Type: Short text
  - Required: Yes
  - Help text: "The name of the product"

- **Description** (`description`)
  - Type: Rich text
  - Required: No
  - Help text: "Detailed product description"

- **Price** (`price`)
  - Type: Number
  - Required: Yes
  - Format: Decimal
  - Help text: "Product price in USD"

- **Images** (`images`)
  - Type: Media
  - Required: No
  - Many files: Yes
  - Help text: "Product images (first image will be used as primary)"

- **Category** (`category`)
  - Type: Short text
  - Required: Yes
  - Help text: "Product category (e.g., frames, wall-art, canvas)"

- **Stock Status** (`stockStatus`)
  - Type: Boolean
  - Required: Yes
  - Help text: "Whether the product is in stock"

#### Optional Fields:
- **Slug** (`slug`)
  - Type: Short text
  - Required: No
  - Help text: "URL-friendly version of the product name"

### 1.3 Save and Publish the Content Model

## Step 2: Add Sample Products

### 2.1 Create Product Entries
1. Go to **Content** in your Contentful space
2. Click **Add entry** and select **Product**
3. Create at least 5-10 sample products with:
   - Varied categories (frames, canvas, wall-art, etc.)
   - Different price points
   - High-quality images
   - Rich text descriptions
   - Mix of in-stock and out-of-stock items

### Example Product Data:
```
Product Title: Classic Black Frame 8x10
Description: Premium quality black frame perfect for photos and artwork. Made with museum-quality materials.
Price: 29.99
Category: frames
Stock Status: true
Images: [Upload 2-3 high-quality frame images]
```

## Step 3: Get API Credentials

### 3.1 Generate Access Token
1. Go to **Settings** > **API keys** in your Contentful space
2. Click **Add API key**
3. Name it "E-commerce Frontend"
4. Copy the **Space ID** and **Content Delivery API - access token**

## Step 4: Configure Environment Variables

### 4.1 Create Environment File
Create a `.env.local` file in your project root with:

```bash
# Contentful Configuration
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=your_space_id_here
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=your_access_token_here
NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT=master

# Existing environment variables...
NEXT_PUBLIC_BASE_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=PhotoFramix
NEXT_PUBLIC_ENVIRONMENT=development
```

### 4.2 Replace Placeholder Values
- Replace `your_space_id_here` with your actual Space ID
- Replace `your_access_token_here` with your Content Delivery API access token

## Step 5: Test the Integration

### 5.1 Start the Development Server
```bash
npm run dev
```

### 5.2 Test the Pages
1. **Products Page**: Visit `http://localhost:3001/products`
   - Should display your product grid
   - Test category filtering
   - Test pagination (if you have many products)

2. **Product Detail Page**: Click on any product
   - Should show product details, images, and description
   - Test the "Buy Now" button

3. **Buy Page**: Click "Buy Now" on any product
   - Should show checkout form
   - Test the complete flow (demo only)

## Step 6: Customization Options

### 6.1 Content Model Extensions
You can extend the product model with additional fields:
- **SEO Title** and **SEO Description**
- **Product Variants** (sizes, colors)
- **Related Products** (references to other products)
- **Product Reviews** (number field for rating)
- **Sale Price** (for discounts)

### 6.2 Styling Customization
- Update colors in `tailwind.config.js`
- Modify component styles in the respective component files
- Add your brand logo and colors

### 6.3 Feature Extensions
- Add shopping cart functionality
- Integrate with payment processors (Stripe, PayPal)
- Add user accounts and order history
- Implement product search
- Add product reviews and ratings

## Troubleshooting

### Common Issues:

1. **"No products found" message**
   - Check your Space ID and Access Token
   - Ensure products are published in Contentful
   - Check browser console for API errors

2. **Images not loading**
   - Verify images are uploaded to Contentful
   - Check that Next.js image domains are configured
   - Images should be published in Contentful

3. **Rich text not rendering**
   - Ensure description field is set to "Rich text" type
   - Check that content is properly formatted in Contentful

### Debug Steps:
1. Check browser console for errors
2. Verify API calls in Network tab
3. Test Contentful API directly: `https://cdn.contentful.com/spaces/YOUR_SPACE_ID/entries?access_token=YOUR_TOKEN&content_type=product`

## Production Deployment

### Environment Variables for Production:
Set the same environment variables in your production environment (Vercel, Netlify, etc.):
- `NEXT_PUBLIC_CONTENTFUL_SPACE_ID`
- `NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN`
- `NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT`

### Content Management:
- Use Contentful's web interface to manage products
- Set up webhooks for automatic rebuilds when content changes
- Consider using Contentful's Preview API for draft content

## Support

For issues with this implementation:
1. Check the component files in `/src/components/products/`
2. Review the Contentful integration in `/src/lib/contentful.ts`
3. Verify your content model matches the expected structure

For Contentful-specific issues, refer to the [Contentful Documentation](https://www.contentful.com/developers/docs/).