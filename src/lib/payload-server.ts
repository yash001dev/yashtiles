import { getPayloadHMR } from "@payloadcms/next/utilities";
import config from "@payload-config";
import { Product, ProductCategory, Media } from "../../payload-types";

export interface FormattedProduct {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  liveViewImage: {
    id: number;
    url: string;
    alt: string;
    caption?: string;
    filename: string;
    mimeType: string;
    filesize: number;
    width: number;
    height: number;
  };
  images: Array<{
    image: {
      url: string;
      alt: string;
    };
    alt: string;
  }>;
  categories: Array<{
    name: string;
    slug: string;
  }>;
  featured: boolean;
  status: string;
}

export async function getProducts(): Promise<FormattedProduct[]> {
  try {
    const payload = await getPayloadHMR({ config });

    const products = await payload.find({
      collection: "products",
      where: {
        status: {
          equals: "published",
        },
      },
      limit: 50,
      depth: 2, // This will populate related fields
    });
    // Transform the products to match our interface
    const formattedProducts: FormattedProduct[] = products.docs.map(
      (product: Product) => ({
        id: product.id.toString(),
        name: product.name,
        slug: product.slug,
        shortDescription: product.shortDescription || "",
        price:
          product.basePrice +
          Math.min(
            ...(Array.isArray(product.availableSizes)
              ? product.availableSizes.map((size: any) =>
                  typeof size === "object" && typeof size.price === "number"
                    ? size.price
                    : 0
                )
              : [0])
          ),
        compareAtPrice: product.compareAtPrice || undefined,
        liveViewImage:
          typeof product.liveViewImage === "object"
            ? {
                id: (product.liveViewImage as Media).id,
                url: (product.liveViewImage as Media).url || "",
                alt: (product.liveViewImage as Media).alt || product.name,
                caption: (product.liveViewImage as Media).caption || undefined,
                filename: (product.liveViewImage as Media).filename || "",
                mimeType: (product.liveViewImage as Media).mimeType || "",
                filesize: (product.liveViewImage as Media).filesize || 0,
                width: (product.liveViewImage as Media).width || 0,
                height: (product.liveViewImage as Media).height || 0,
              }
            : {
                id: 0,
                url: "",
                alt: product.name,
                filename: "",
                mimeType: "",
                filesize: 0,
                width: 0,
                height: 0,
              },
        images: product.images.map((img: any) => ({
          image: {
            url:
              typeof img.image === "object"
                ? (img.image as Media).url || ""
                : "",
            alt:
              (typeof img.image === "object"
                ? (img.image as Media).alt
                : img.alt) || img.alt,
          },
          alt: img.alt,
        })),
        categories: product.categories.map((cat: any) => ({
          name: typeof cat === "object" ? (cat as ProductCategory).name : "",
          slug: typeof cat === "object" ? (cat as ProductCategory).slug : "",
        })),
        featured: product.featured || false,
        status: product.status,
      })
    );

    return formattedProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const payload = await getPayloadHMR({ config });

    // Try to find product with the given slug
    let products = await payload.find({
      collection: "products",
      where: {
        slug: {
          equals: slug,
        },
        status: {
          equals: "published",
        },
      },
      limit: 1,
      depth: 3, // Deep populate for all relations
    });

    // If not found, try with leading slash
    if (!products.docs.length) {
      products = await payload.find({
        collection: "products",
        where: {
          slug: {
            equals: `/${slug}`,
          },
          status: {
            equals: "published",
          },
        },
        limit: 1,
        depth: 3,
      });
    }

    return products.docs[0] || null;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}

export async function getPageContent(pageType: string) {
  try {
    const payload = await getPayloadHMR({ config });

    const pages = await payload.find({
      collection: "pages",
      where: {
        pageType: {
          equals: pageType,
        },
        status: {
          equals: "published",
        },
      },
      limit: 1,
      depth: 2,
    });

    return pages.docs[0] || null;
  } catch (error) {
    console.error("Error fetching page content:", error);
    return null;
  }
}

export async function getSizes() {
  try {
    const payload = await getPayloadHMR({ config });

    const sizes = await payload.find({
      collection: "sizes",
      where: {
        available: {
          equals: true,
        },
      },
      sort: "sortOrder",
      limit: 100,
    });

    return sizes.docs || [];
  } catch (error) {
    console.error("Error fetching sizes:", error);
    return [];
  }
}

export async function getProductsByCategory(
  categorySlug: string,
  limit = 8,
  excludeId?: string
) {
  try {
    const payload = await getPayloadHMR({ config });

    const products = await payload.find({
      collection: "products",
      where: {
        "categories.slug": {
          equals: categorySlug,
        },
        status: {
          equals: "published",
        },
        ...(excludeId && {
          id: {
            not_equals: excludeId,
          },
        }),
      },
      limit,
      depth: 2,
    });

    return products.docs || [];
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
}

export async function getProductCategories() {
  try {
    const payload = await getPayloadHMR({ config });

    const categories = await payload.find({
      collection: "product-categories",
      limit: 100,
    });

    return categories.docs || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
