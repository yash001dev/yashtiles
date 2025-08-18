import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Types
interface MaterialData {
  id: string;
  name: string;
  description: string;
  content: string;
  link: string;
  available: boolean;
  sortOrder: number;
  image?: {
    url: string;
  };
}

interface FrameColorData {
  id: string;
  name: string;
  color: string;
  description: string;
  available: boolean;
  sortOrder: number;
}

interface HangOptionData {
  id: string;
  name: string;
  description: string;
  content: string;
  price: number;
  available: boolean;
  sortOrder: number;
  image?: {
    url: string;
  };
}

interface SizeData {
  id: string;
  name: string;
  dimensions: string;
  aspectRatio: number;
  price: number;
  available: boolean;
  sortOrder: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: any;
  shortDescription: string;
  price: number;
  basePrice: number;
  compareAtPrice?: number;
  template?: {
    id: string;
    name: string;
    slug: string;
    blocks: Array<{
      blockType: string;
      [key: string]: any;
    }>;
  };
  images: Array<{
    image: {
      url: string;
      alt: string;
    };
    alt: string;
    caption?: string;
  }>;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  availableSizes: Array<{
    id: string;
    name: string;
    dimensions: string;
    aspectRatio: number;
    price: number;
  }>;
  defaultColors: Array<{
    id: string;
    name: string;
    color: string;
    description: string;
  }>;
  additionalColors?: Array<{
    id: string;
    name: string;
    color: string;
    description: string;
  }>;
  defaultMaterials: Array<{
    id: string;
    name: string;
    description: string;
    content: string;
  }>;
  additionalMaterials?: Array<{
    id: string;
    name: string;
    description: string;
    content: string;
  }>;
  variantPricing?: Array<{
    size: { id: string; name: string; price: number };
    color: { id: string; name: string };
    material: { id: string; name: string };
    priceModifier: number;
    stock: number;
    isAvailable: boolean;
  }>;
  features: Array<{
    feature: string;
  }>;
  specifications: {
    weight?: string;
    dimensions?: string;
    mounting: string;
  };
  stock: number;
  sku: string;
  featured?: boolean;
  status: string;
}

interface PageContent {
  content: Array<{
    blockType: string;
    [key: string]: any;
  }>;
}

interface PayloadResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

// Create the resources API slice
export const resourcesApi = createApi({
  reducerPath: "resourcesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
  }),
  tagTypes: [
    "Materials",
    "FrameColors",
    "HangOptions",
    "Sizes",
    "Products",
    "Pages",
  ],
  endpoints: (builder) => ({
    // Materials endpoints
    getMaterials: builder.query<MaterialData[], void>({
      query: () => "materials?where[available][equals]=true&sort=sortOrder",
      transformResponse: (response: PayloadResponse<any>) =>
        response.docs.map((material: any) => ({
          id: material.id,
          name: material.name,
          description: material.description,
          content: material.content || "",
          link: material.link || "",
          available: material.available,
          sortOrder: material.sortOrder,
          image: material.image,
        })),
      providesTags: ["Materials"],
    }),

    // Frame Colors endpoints
    getFrameColors: builder.query<FrameColorData[], void>({
      query: () => "frame-colors?where[available][equals]=true&sort=sortOrder",
      transformResponse: (response: PayloadResponse<any>) =>
        response.docs.map((color: any) => ({
          id: color.id,
          name: color.name,
          color: color.color,
          description: color.description,
          available: color.available,
          sortOrder: color.sortOrder,
        })),
      providesTags: ["FrameColors"],
    }),

    // Hang Options endpoints
    getHangOptions: builder.query<HangOptionData[], void>({
      query: () => "hang-options?where[available][equals]=true&sort=sortOrder",
      transformResponse: (response: PayloadResponse<any>) =>
        response.docs.map((option: any) => ({
          id: option.id,
          name: option.name,
          description: option.description,
          content: option.content || "",
          price: option.price,
          available: option.available,
          sortOrder: option.sortOrder,
          image: option.image,
        })),
      providesTags: ["HangOptions"],
    }),

    // Sizes endpoints
    getSizes: builder.query<SizeData[], void>({
      query: () => "sizes?where[available][equals]=true&sort=sortOrder",
      transformResponse: (response: PayloadResponse<any>) =>
        response.docs.map((size: any) => ({
          id: size.id,
          name: size.name,
          dimensions: size.dimensions,
          aspectRatio: size.aspectRatio,
          price: size.price,
          available: size.available,
          sortOrder: size.sortOrder,
        })),
      providesTags: ["Sizes"],
    }),

    // Products endpoints
    getProductBySlug: builder.query<Product | null, string>({
      query: (slug) => {
        // Try with slug as is first, then with leading slash
        return `products?where[slug][equals]=${slug}&status=published&populate=template`;
      },
      transformResponse: (response: PayloadResponse<any>, meta, arg) => {
        if (response.docs && response.docs.length > 0) {
          return response.docs[0];
        }
        return null;
      },
      providesTags: ["Products"],
    }),

    // Fallback query for products with leading slash
    getProductBySlugWithSlash: builder.query<Product | null, string>({
      query: (slug) => `products?where[slug][equals]=/${slug}&status=published&populate=template`,
      transformResponse: (response: PayloadResponse<any>) => {
        if (response.docs && response.docs.length > 0) {
          return response.docs[0];
        }
        return null;
      },
      providesTags: ["Products"],
    }),

    // Products by category
    getProductsByCategory: builder.query<
      Product[],
      { categorySlug: string; limit?: number; excludeId?: string }
    >({
      query: ({ categorySlug, limit = 8, excludeId }) =>
        `products?where[categories.slug][equals]=${categorySlug}&status=published&limit=${limit}`,
      transformResponse: (response: PayloadResponse<any>, meta, arg) => {
        let products = response.docs || [];
        if (arg.excludeId) {
          products = products.filter((p: any) => p.id !== arg.excludeId);
        }
        return products;
      },
      providesTags: ["Products"],
    }),

    // Pages endpoints
    getPageContent: builder.query<PageContent | null, string>({
      query: (pageType) =>
        `pages?where[pageType][equals]=${pageType}&status=published`,
      transformResponse: (response: PayloadResponse<any>) => {
        if (response.docs && response.docs.length > 0) {
          return response.docs[0];
        }
        return null;
      },
      providesTags: ["Pages"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetMaterialsQuery,
  useGetFrameColorsQuery,
  useGetHangOptionsQuery,
  useGetSizesQuery,
  useGetProductBySlugQuery,
  useGetProductBySlugWithSlashQuery,
  useGetProductsByCategoryQuery,
  useGetPageContentQuery,
} = resourcesApi;
