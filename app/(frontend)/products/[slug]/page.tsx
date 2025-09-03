import ProductDetailPageClient from "./ProductDetailPageClient";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const { slug } = await params;
  let product: any = null;

  try {
    const [res1, res2] = await Promise.all([
      fetch(`${baseUrl}/api/products?where[slug][equals]=${slug}&status=published`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/products?where[slug][equals]=/${slug}&status=published`, { cache: 'no-store' }),
    ]);
    const [data1, data2] = await Promise.all([res1.json(), res2.json()]);
    product = data1?.docs?.[0] || data2?.docs?.[0] || null;
  } catch (error) {
    console.error('Error fetching product on server:', error);
  }
console.log(product);
  return <ProductDetailPageClient initialProduct={product} slugParam={slug} />;
}


