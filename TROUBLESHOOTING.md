# Troubleshooting Guide

This guide helps you resolve common issues with the Contentful e-commerce integration.

## 🚨 Common Error: "The query you sent was invalid"

This error occurs when there's a mismatch between your Contentful content model and what the code expects.

### Quick Fix Steps:

1. **Visit the Debug Page**
   ```
   http://localhost:3001/debug-contentful
   ```
   This will show you exactly what's wrong with your setup.

2. **Check Your Content Model**
   Make sure your Contentful "product" content type has these fields:

   | Field Name | Field ID | Type | Required |
   |------------|----------|------|----------|
   | Product Title | `productTitle` | Short text | Yes |
   | Price | `price` | Number | Yes |
   | Stock Status | `stockStatus` | Boolean | Yes |
   | Category | `category` | Short text | Yes |
   | Images | `images` | Media (multiple) | No |
   | Description | `description` | Rich text | No |

3. **Verify Field IDs**
   In Contentful, click on each field and check the "Field ID" matches exactly:
   - ✅ `productTitle` (not `product-title` or `ProductTitle`)
   - ✅ `price` (not `Price`)
   - ✅ `stockStatus` (not `stock-status`)
   - ✅ `category` (not `Category`)

## 🔧 Step-by-Step Troubleshooting

### Step 1: Environment Variables
Check your `.env.local` file has:
```bash
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=your_space_id_here
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=your_access_token_here
NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT=master
```

**How to get these values:**
1. Go to Contentful dashboard
2. Settings → API keys
3. Copy "Space ID" and "Content Delivery API - access token"

### Step 2: Content Type Setup
1. Go to Contentful → Content model
2. Create content type called `product` (lowercase)
3. Add fields with exact IDs shown above
4. Save and publish the content type

### Step 3: Create Sample Products
1. Go to Content → Add entry → Product
2. Fill in all required fields:
   - Product Title: "Sample Frame"
   - Price: 29.99
   - Stock Status: true
   - Category: "frames"
   - Upload at least one image
3. **Important:** Click "Publish" (not just save)

### Step 4: Test the Connection
1. Visit `http://localhost:3001/debug-contentful`
2. Check the debug output for errors
3. If successful, visit `http://localhost:3001/products`

## 🐛 Specific Error Solutions

### Error: "No products found"
**Cause:** Products exist but aren't published or content type is wrong.

**Solution:**
1. In Contentful, go to Content
2. Make sure your products show "Published" status (green dot)
3. If they show "Draft", click each one and click "Publish"
4. Verify content type is named exactly `product`

### Error: "Missing required fields"
**Cause:** Your content model doesn't have the expected fields.

**Solution:**
1. Go to Contentful → Content model → product
2. Add missing fields with exact IDs:
   - `productTitle` (Short text)
   - `price` (Number)
   - `stockStatus` (Boolean)
   - `category` (Short text)

### Error: "Filter or ordering specification not applicable"
**Cause:** Field types don't match what's expected for filtering.

**Solution:**
1. Check that `category` field is "Short text" type
2. Make sure it contains simple text values like "frames", "canvas"
3. Avoid using references or complex field types for category

### Error: "Access token invalid"
**Cause:** Wrong API token or expired token.

**Solution:**
1. Go to Contentful → Settings → API keys
2. Make sure you're using the "Content Delivery API" token (not Management API)
3. Copy the token exactly (no extra spaces)
4. Restart your development server after updating .env.local

## 📋 Content Model Template

Here's the exact content model structure that works:

```json
{
  "name": "Product",
  "displayField": "productTitle",
  "fields": [
    {
      "id": "productTitle",
      "name": "Product Title",
      "type": "Symbol",
      "required": true
    },
    {
      "id": "description",
      "name": "Description",
      "type": "RichText",
      "required": false
    },
    {
      "id": "price",
      "name": "Price",
      "type": "Number",
      "required": true
    },
    {
      "id": "images",
      "name": "Images",
      "type": "Array",
      "items": {
        "type": "Link",
        "linkType": "Asset"
      },
      "required": false
    },
    {
      "id": "category",
      "name": "Category",
      "type": "Symbol",
      "required": true
    },
    {
      "id": "stockStatus",
      "name": "Stock Status",
      "type": "Boolean",
      "required": true
    }
  ]
}
```

## 🔍 Debug Checklist

Use this checklist to verify your setup:

- [ ] Environment variables are set correctly
- [ ] Content type is named "product" (lowercase)
- [ ] All required fields exist with correct IDs
- [ ] At least one product entry exists
- [ ] Product entries are published (not draft)
- [ ] Images are uploaded and published
- [ ] Category field contains simple text values
- [ ] Development server was restarted after env changes

## 🆘 Still Having Issues?

### Check Browser Console
1. Open browser dev tools (F12)
2. Go to Console tab
3. Visit `/products` page
4. Look for error messages with details

### Check Network Tab
1. Open dev tools → Network tab
2. Visit `/products` page
3. Look for failed requests to Contentful API
4. Check response details for specific error messages

### Test Contentful API Directly
Try this URL in your browser (replace with your values):
```
https://cdn.contentful.com/spaces/YOUR_SPACE_ID/entries?access_token=YOUR_ACCESS_TOKEN&content_type=product&limit=1
```

This should return JSON data with your products.

## 💡 Pro Tips

1. **Start Simple:** Create just one product with minimal fields first
2. **Use Debug Page:** Always check `/debug-contentful` when things break
3. **Check Field IDs:** The most common issue is incorrect field IDs
4. **Publish Everything:** Draft content won't appear in the API
5. **Restart Server:** Always restart after changing environment variables

## 📞 Getting Help

If you're still stuck:

1. Check the browser console for detailed error messages
2. Visit `/debug-contentful` and share the output
3. Verify your Contentful setup matches the guide exactly
4. Make sure you're using the Content Delivery API (not Management API)

The implementation is robust and will work perfectly once Contentful is configured correctly!