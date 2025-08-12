import { buildConfig } from 'payload/config'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { slateEditor } from '@payloadcms/richtext-slate'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { cloudStorage } from '@payloadcms/plugin-cloud-storage'
import { s3Adapter } from '@payloadcms/plugin-cloud-storage/s3'
import path from 'path'

// Collections
import { Users } from './collections/Users'
import { Collections } from './collections/Collections'
import { Products } from './collections/Products'
import { Media } from './collections/Media'
import { Orders } from './collections/Orders'

const adapter = s3Adapter({
  config: {
    endpoint: process.env.AWS_ENDPOINT,
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  },
  bucket: process.env.AWS_BUCKET!,
})

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '- YashTiles Admin',
      favicon: '/favicon.ico',
      ogImage: '/og-image.jpg',
    },
  },
  editor: slateEditor({}),
  collections: [Users, Collections, Products, Media, Orders],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [
    seoPlugin({
      collections: ['products', 'collections'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `YashTiles - ${doc.title?.value || doc.name?.value}`,
      generateDescription: ({ doc }) => doc.description?.value || 'Premium custom frames for your memories',
    }),
    cloudStorage({
      collections: {
        media: {
          adapter,
          disablePayloadAccessControl: true,
        },
      },
    }),
  ],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI!,
  }),
  secret: process.env.PAYLOAD_SECRET!,
  cors: [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'],
  csrf: [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'],
})