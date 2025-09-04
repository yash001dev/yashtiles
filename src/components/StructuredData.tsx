import Script from 'next/script';

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PhotoFramix",
    "url": "https://" + process.env.NEXT_PUBLIC_APP_NAME + ".com",
    "logo": "https://" + process.env.NEXT_PUBLIC_APP_NAME + ".com/logo.png",
    "description": "Transform your memories into stunning wall art with premium quality, handcrafted frames.",
    "sameAs": [
      "https://facebook.com/" + process.env.NEXT_PUBLIC_APP_NAME,
      "https://instagram.com/" + process.env.NEXT_PUBLIC_APP_NAME,
      "https://twitter.com/" + process.env.NEXT_PUBLIC_APP_NAME
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-PhotoFramix",
      "contactType": "customer service"
    }
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
}
