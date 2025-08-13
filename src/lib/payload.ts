import { config } from './config';

// Payload CMS API client
class PayloadAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || config.apiUrl;
  }

  // Generic fetch method
  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Payload API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Products
  async getProducts(params?: {
    where?: any;
    limit?: number;
    page?: number;
    sort?: string;
    populate?: string[];
  }) {
    const searchParams = new URLSearchParams();
    
    if (params?.where) {
      Object.entries(params.where).forEach(([key, value]) => {
        searchParams.append(`where[${key}]`, String(value));
      });
    }
    
    if (params?.limit) searchParams.append('limit', String(params.limit));
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.sort) searchParams.append('sort', params.sort);
    if (params?.populate) {
      params.populate.forEach(field => {
        searchParams.append('populate', field);
      });
    }

    const queryString = searchParams.toString();
    return this.fetch(`/api/products${queryString ? `?${queryString}` : ''}`);
  }

  async getProductBySlug(slug: string) {
    return this.fetch(`/api/products?where[slug][equals]=${slug}&limit=1&populate=categories,variants`);
  }

  // Product Categories
  async getProductCategories(params?: {
    where?: any;
    limit?: number;
    sort?: string;
  }) {
    const searchParams = new URLSearchParams();
    
    if (params?.where) {
      Object.entries(params.where).forEach(([key, value]) => {
        searchParams.append(`where[${key}]`, String(value));
      });
    }
    
    if (params?.limit) searchParams.append('limit', String(params.limit));
    if (params?.sort) searchParams.append('sort', params.sort);

    const queryString = searchParams.toString();
    return this.fetch(`/api/product-categories${queryString ? `?${queryString}` : ''}`);
  }

  // Frame Sizes
  async getFrameSizes(params?: {
    where?: any;
    limit?: number;
    sort?: string;
  }) {
    const searchParams = new URLSearchParams();
    
    if (params?.where) {
      Object.entries(params.where).forEach(([key, value]) => {
        searchParams.append(`where[${key}]`, String(value));
      });
    }
    
    if (params?.limit) searchParams.append('limit', String(params.limit));
    if (params?.sort) searchParams.append('sort', params.sort);

    const queryString = searchParams.toString();
    return this.fetch(`/api/frame-sizes${queryString ? `?${queryString}` : ''}`);
  }

  // Blogs
  async getBlogs(params?: {
    where?: any;
    limit?: number;
    page?: number;
    sort?: string;
    populate?: string[];
  }) {
    const searchParams = new URLSearchParams();
    
    if (params?.where) {
      Object.entries(params.where).forEach(([key, value]) => {
        searchParams.append(`where[${key}]`, String(value));
      });
    }
    
    if (params?.limit) searchParams.append('limit', String(params.limit));
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.sort) searchParams.append('sort', params.sort);
    if (params?.populate) {
      params.populate.forEach(field => {
        searchParams.append('populate', field);
      });
    }

    const queryString = searchParams.toString();
    return this.fetch(`/api/blogs${queryString ? `?${queryString}` : ''}`);
  }

  async getBlogBySlug(slug: string) {
    return this.fetch(`/api/blogs?where[slug][equals]=${slug}&limit=1&populate=categories,featuredImage`);
  }

  // Pages
  async getPages(params?: {
    where?: any;
    limit?: number;
    populate?: string[];
  }) {
    const searchParams = new URLSearchParams();
    
    if (params?.where) {
      Object.entries(params.where).forEach(([key, value]) => {
        searchParams.append(`where[${key}]`, String(value));
      });
    }
    
    if (params?.limit) searchParams.append('limit', String(params.limit));
    if (params?.populate) {
      params.populate.forEach(field => {
        searchParams.append('populate', field);
      });
    }

    const queryString = searchParams.toString();
    return this.fetch(`/api/pages${queryString ? `?${queryString}` : ''}`);
  }

  async getPageBySlug(slug: string) {
    return this.fetch(`/api/pages?where[slug][equals]=${slug}&limit=1`);
  }
}

// Export singleton instance
export const payloadAPI = new PayloadAPI();

// Export utility functions
export const formatPrice = (price: number, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(price);
};

export const calculateDiscount = (price: number, comparePrice?: number) => {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
};

export const getImageUrl = (image: any, size?: string) => {
  if (!image) return '';
  
  if (typeof image === 'string') return image;
  
  if (image.sizes && size && image.sizes[size]) {
    return image.sizes[size].url;
  }
  
  return image.url || '';
};

// SEO utilities
export const generateProductSchema = (product: any) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description,
    image: product.images?.map((img: any) => img.image.url) || [],
    brand: {
      '@type': 'Brand',
      name: 'PhotoFramix',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'INR',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
    },
  };
};