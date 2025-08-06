import { createClient } from 'contentful';
import { Document } from '@contentful/rich-text-types';

// Helper function to extract category value from linked entry or string
function getCategoryValue(category: string | { fields: { options: string } } | undefined): string | null {
  if (!category) return null;
  
  if (typeof category === 'string') {
    return category;
  }
  
  if (typeof category === 'object' && category.fields && category.fields.options) {
    return category.fields.options;
  }
  
  return null;
}

// Helper function to convert stock status to boolean
function getStockStatus(stockStatus: boolean | string | undefined): boolean {
  if (typeof stockStatus === 'boolean') {
    return stockStatus;
  }
  
  if (typeof stockStatus === 'string') {
    // Convert string to boolean - any non-zero number or 'true' is considered in stock
    return stockStatus !== '0' && stockStatus.toLowerCase() !== 'false';
  }
  
  return false;
}

// Transform raw Contentful product data to normalized format
function transformProduct(rawProduct: any): Product {
  return {
    sys: rawProduct.sys,
    fields: {
      productTitle: rawProduct.fields.productTitle || '',
      description: rawProduct.fields.description || { nodeType: 'document', content: [] },
      price: rawProduct.fields.price || 0,
      images: rawProduct.fields.images || [],
      category: getCategoryValue(rawProduct.fields.category) || 'uncategorized',
      stockStatus: getStockStatus(rawProduct.fields.stockStatus),
      slug: rawProduct.fields.slug,
    },
  };
}

// Contentful client configuration
const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN!,
  environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master',
});

// Product interface based on Contentful content model
export interface Product {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: {
    productTitle: string;
    description: Document;
    price: number;
    images: Array<{
      sys: { id: string };
      fields: {
        title: string;
        file: {
          url: string;
          details: {
            size: number;
            image: {
              width: number;
              height: number;
            };
          };
        };
      };
    }>;
    category: string;
    stockStatus: boolean;
    slug?: string;
  };
}

// Fetch all products with optional filtering and pagination
export async function getProducts(options: {
  limit?: number;
  skip?: number;
  category?: string;
} = {}): Promise<{
  products: Product[];
  total: number;
  categories: string[];
}> {
  try {
    // First, try to get all products without filters to check the content model
    const baseQuery: Record<string, any> = {
      content_type: 'products',
      limit: options.limit || 20,
      skip: options.skip || 0,
    };

    // Only add category filter if provided and not 'all'
    if (options.category && options.category !== 'all') {
      // Try different possible field names for category
      baseQuery['fields.category'] = options.category;
    }

    let response;
    try {
      // Include linked entries to resolve category references
      const queryWithIncludes = {
        ...baseQuery,
        include: 2, // Include linked entries up to 2 levels deep
      };
      response = await client.getEntries<Product['fields']>(queryWithIncludes);
    } catch (filterError) {
      console.warn('Category filter failed, trying without filter:', filterError);
      // If filtering fails, get all products and filter client-side
      const fallbackQuery = {
        content_type: 'products',
        limit: options.limit || 20,
        skip: options.skip || 0,
        include: 2, // Include linked entries
      };
      response = await client.getEntries<Product['fields']>(fallbackQuery);
      
      // Filter client-side if category was specified
      if (options.category && options.category !== 'all') {
        response.items = response.items.filter(item => {
          const categoryValue = getCategoryValue(item.fields.category);
          return categoryValue && categoryValue.toLowerCase() === options.category?.toLowerCase();
        });
        response.total = response.items.length;
      }
    }
    
    // Get all products to extract categories
    let allProductsResponse;
    try {
      allProductsResponse = await client.getEntries<Product['fields']>({
        content_type: 'products',
        limit: 1000, // Get more items to extract all categories
      });
    } catch (error) {
      console.warn('Failed to fetch all products for categories:', error);
      allProductsResponse = response; // Use current response as fallback
    }

    // Extract categories from all products using helper function
    const categories = Array.from(
      new Set(
        allProductsResponse.items
          .map(item => getCategoryValue(item.fields.category))
          .filter(Boolean)
      )
    );

    // Transform products to normalize the data structure
    const transformedProducts = response.items.map(transformProduct);

    return {
      products: transformedProducts,
      total: response.total,
      categories,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Return empty results with helpful error message
    return { 
      products: [], 
      total: 0, 
      categories: [],
    };
  }
}

// Fetch a single product by ID
export async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await client.getEntry<Product['fields']>(id, {
      include: 2, // Include linked entries
    });
    return transformProduct(response);
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Fetch a single product by slug (if slug field exists)
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await client.getEntries<Product['fields']>({
      content_type: 'products',
      'fields.slug': slug,
      limit: 1,
      include: 2, // Include linked entries
    });

    if (response.items.length > 0) {
      return transformProduct(response.items[0]);
    }
    return null;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

// Helper function to get optimized image URL
export function getOptimizedImageUrl(
  imageUrl: string,
  width?: number,
  height?: number,
  quality = 80
): string {
  if (!imageUrl) return '';
  
  // Remove protocol if present
  const cleanUrl = imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl;
  
  const params = new URLSearchParams();
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('q', quality.toString());
  params.append('fm', 'webp');
  
  return `${cleanUrl}?${params.toString()}`;
}

// Diagnostic function to check content model structure
export async function debugContentModel(): Promise<void> {
  try {
    console.log('🔍 Debugging Contentful Content Model...');
    
    // Try to get any entries of type 'products'
    const response = await client.getEntries({
      content_type: 'products',
      limit: 1,
      include: 2, // Include linked entries for debugging
    });

    if (response.items.length === 0) {
      console.log('❌ No products found. Make sure you have:');
      console.log('   1. Created a content type called "products"');
      console.log('   2. Published some product entries');
      console.log('   3. Used the correct Space ID and Access Token');
      return;
    }

    const firstProduct = response.items[0];
    console.log('✅ Found products! First product structure:');
    console.log('📋 Available fields:', Object.keys(firstProduct.fields));
    console.log('📄 Sample product:', {
      id: firstProduct.sys.id,
      fields: firstProduct.fields,
    });

    // Check for required fields
    const requiredFields = ['productTitle', 'price', 'stockStatus'];
    const missingFields = requiredFields.filter(field => !(field in firstProduct.fields));
    
    if (missingFields.length > 0) {
      console.log('⚠️  Missing required fields:', missingFields);
      console.log('   Please add these fields to your Contentful product content model');
    } else {
      console.log('✅ All required fields are present');
    }

    // Check field types
    console.log('🔍 Field type analysis:');
    Object.entries(firstProduct.fields).forEach(([key, value]) => {
      console.log(`   ${key}: ${typeof value} ${Array.isArray(value) ? '(array)' : ''}`);
    });

  } catch (error) {
    console.error('❌ Error debugging content model:', error);
    console.log('💡 Common issues:');
    console.log('   1. Check NEXT_PUBLIC_CONTENTFUL_SPACE_ID');
    console.log('   2. Check NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN');
    console.log('   3. Make sure content type is named "products"');
    console.log('   4. Ensure products are published in Contentful');
  }
}

export default client;