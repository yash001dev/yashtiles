import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/contentful';
import ProductDetailPage from '@/components/products/ProductDetailPage';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProduct(params.id);
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const primaryImage = product.fields.images?.[0];
  const imageUrl = primaryImage?.fields?.file?.url;

  return {
    title: `${product.fields.productTitle} - PhotoFramix`,
    description: product.fields.description 
      ? `${product.fields.productTitle} - Premium quality photo frame for $${product.fields.price}`
      : `${product.fields.productTitle} - Premium quality photo frame`,
    openGraph: {
      title: product.fields.productTitle,
      description: `Premium quality photo frame for $${product.fields.price}`,
      images: imageUrl ? [`https:${imageUrl}?w=800&h=600&fm=webp`] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return <ProductDetailPage product={product} />;
}