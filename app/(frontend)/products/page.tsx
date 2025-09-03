import ProductListingPageClient from './ProductListingPageClient';

interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  images: Array<{ image: { url: string; alt: string }; alt: string }>;
  categories: Array<{ name: string; slug: string }>;
  featured: boolean;
  status: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image: { url: string; alt: string };
}

export default async function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  let products: Product[] = [];
  let categories: Category[] = [];
 console.log(baseUrl);
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch(`${baseUrl}/api/products?status=published&limit=50`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/product-categories?status=active`, { cache: 'no-store' }),
    ]);

    const [productsData, categoriesData] = await Promise.all([
      productsRes.json(),
      categoriesRes.json(),
    ]);

    products = productsData?.docs || [];
    categories = categoriesData?.docs || [];
  } catch (error) {
    console.error('Error fetching data on server:', error);
  }

  return <ProductListingPageClient products={products} categories={categories} />;
}


