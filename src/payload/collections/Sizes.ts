import { CollectionConfig } from 'payload';

export const Sizes: CollectionConfig = {
  slug: 'sizes',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'dimensions', 'price', 'available'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Display name for the size (e.g., 8" × 8")',
      },
    },
    {
      name: 'dimensions',
      type: 'text',
      required: true,
      admin: {
        description: 'Description of the format (e.g., Square format, Portrait format)',
      },
    },
    {
      name: 'aspectRatio',
      type: 'number',
      required: true,
      admin: {
        description: 'Aspect ratio of the size (width/height)',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: {
        description: 'Price in rupees for this size',
      },
    },
    {
      name: 'available',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this size is available for selection',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Order in which sizes should appear in the UI',
      },
    },
  ],
};
