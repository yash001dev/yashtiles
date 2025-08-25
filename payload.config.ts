import sharp from "sharp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";

// Import collections
import { Products } from "./src/payload/collections/Products";
import { ProductCategories } from "./src/payload/collections/ProductCategories";
import { Sizes } from "./src/payload/collections/Sizes";
import { Materials } from "./src/payload/collections/Materials";
import { FrameColors } from "./src/payload/collections/FrameColors";
import { HangOptions } from "./src/payload/collections/HangOptions";
import { Blogs } from "./src/payload/collections/Blogs";
import { BlogCategories } from "./src/payload/collections/BlogCategories";
import { Media } from "./src/payload/collections/Media";
import { Pages } from "./src/payload/collections/Pages";
import { Users } from "./src/payload/collections/Users";

export default buildConfig({
  // If you'd like to use Rich Text, pass your editor here
  editor: lexicalEditor(),

  // Define and configure your collections in this array
  collections: [
    Users,
    Products,
    ProductCategories,
    Sizes,
    Materials,
    FrameColors,
    HangOptions,
    Blogs,
    BlogCategories,
    Media,
    Pages,
  ],

  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: "media",
        },
      },
      bucket: process.env.NEXT_S3_BUCKET || "",
      config: {
        credentials: {
          accessKeyId: process.env.NEXT_S3_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.NEXT_S3_SECRET_ACCESS_KEY || "",
        },
        region: process.env.NEXT_S3_REGION || "",
        // endpoint: process.env.NEXT_S3_ENDPOINT || "",
      },
    }),
  ], // Your Payload secret - should be a complex and secure string, unguessable
  secret: "f9fc26b1a2045a6f5c3c79a5",
  // Whichever Database Adapter you're using should go here
  // Mongoose is shown as an example, but you can also use Postgres
  db: postgresAdapter({
    pool: {
      connectionString: process.env.NEXT_DATABASE_URI || "",
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
    user: "users",
    meta: {
      titleSuffix: "- PhotoFramix CMS",
    },
  },

  // CORS configuration
  cors: [
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    process.env.NEXT_PAYLOAD_PUBLIC_SERVER_URL || "http://localhost:3001",
  ],

  // CSRF configuration
  csrf: [
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    process.env.NEXT_PAYLOAD_PUBLIC_SERVER_URL || "http://localhost:3001",
  ],
});
