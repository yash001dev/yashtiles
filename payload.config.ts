import sharp from "sharp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";

// Import collections
import { Products } from "./src/payload/collections/Products";
import { ProductCategories } from "./src/payload/collections/ProductCategories";
import { FrameSizes } from "./src/payload/collections/FrameSizes";
import { Blogs } from "./src/payload/collections/Blogs";
import { BlogCategories } from "./src/payload/collections/BlogCategories";
import { Media } from "./src/payload/collections/Media";
import { Pages } from "./src/payload/collections/Pages";

export default buildConfig({
  // If you'd like to use Rich Text, pass your editor here
  editor: lexicalEditor(),

  // Define and configure your collections in this array
  collections: [
    Products,
    ProductCategories,
    FrameSizes,
    Blogs,
    BlogCategories,
    Media,
    Pages,
  ],

  // Configure plugins
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
        },
      },
      bucket: process.env.S3_BUCKET || 'photoframix-media',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || 'us-east-1',
      },
    }),
  ],

  // Your Payload secret - should be a complex and secure string, unguessable
  secret: process.env.PAYLOAD_SECRET || "",
  // Whichever Database Adapter you're using should go here
  // Mongoose is shown as an example, but you can also use Postgres
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
      ssl: {
        rejectUnauthorized: false, // This is important for self-signed certificates
      },
    },
  }),
  // If you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // This is optional - if you don't need to do these things,
  // you don't need it!
  sharp,

  // Admin configuration
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- PhotoFramix CMS',
      favicon: '/favicon.ico',
      ogImage: '/og-image.jpg',
    },
  },

  // CORS configuration
  cors: [
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
  ],

  // CSRF configuration
  csrf: [
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
  ],
});
