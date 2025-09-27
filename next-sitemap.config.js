/** @type {import('next-sitemap').IConfig} */
const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === "production";
const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://photoframix.com";

const sitemapExports = {
  siteUrl: siteUrl,
  generateIndexSitemap: true,
  generateRobotsTxt: false, // We have a custom robots.txt
  exclude: [
    "/admin-manage/*",
    "/api/*",
    "/_next/*",
    "/payment-success",
    "/payment-failure",
    "/reset-password",
    "/verify-email",
    "/checkout",
    "/cart",
    "/orders",
    "/admin/*",
  ],
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,
  autoLastmod: true,
  transform: async (config, path) => {
    // Custom priority and changefreq for different page types
    if (path === "/") {
      return {
        loc: path,
        changefreq: "daily",
        priority: 1.0,
        lastmod: new Date().toISOString(),
      };
    }

    if (path.startsWith("/products/")) {
      return {
        loc: path,
        changefreq: "weekly",
        priority: 0.9,
        lastmod: new Date().toISOString(),
      };
    }

    if (path === "/products") {
      return {
        loc: path,
        changefreq: "daily",
        priority: 0.9,
        lastmod: new Date().toISOString(),
      };
    }

    if (path.startsWith("/blogs/")) {
      return {
        loc: path,
        changefreq: "weekly",
        priority: 0.8,
        lastmod: new Date().toISOString(),
      };
    }

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },
  additionalPaths: async (config) => {
    const additionalPaths = [];

    // Add dynamic product pages (you'll need to fetch from your API)
    try {
      // You can add logic here to fetch products from your API
      // const products = await fetch(`${config.siteUrl}/api/products`).then(res => res.json());
      // products.forEach(product => {
      //   additionalPaths.push({
      //     loc: `/products/${product.slug}`,
      //     changefreq: 'weekly',
      //     priority: 0.9,
      //     lastmod: new Date(product.updatedAt).toISOString(),
      //   });
      // });
    } catch (error) {
      console.log("Error fetching dynamic pages for sitemap:", error);
    }

    return additionalPaths;
  },
};

export default sitemapExports;
