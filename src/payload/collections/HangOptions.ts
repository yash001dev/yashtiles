import { CollectionConfig } from 'payload';

export const HangOptions: CollectionConfig = {
  slug: 'hang-options',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'description', 'price', 'available'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  // upload: {
  //   staticDir: 'hang-options',
  //   staticURL: '/hang-options',
  //   mimeTypes: ['image/*'],
  //   adminThumbnail: 'thumbnail',
  //   imageSizes: [
  //     {
  //       name: 'thumbnail',
  //       width: 200,
  //       height: 200,
  //       position: 'centre',
  //     },
  //   ],
  // },
  fields: [
    {
      name: 'image',
      type: 'text',
      required: true,
      admin: {
        description: 'Image URL from Imagekit',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the hang option (e.g., Stickable Tape, Standard Hook)',
      },
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      admin: {
        description: 'Price display text (e.g., ₹0)',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      admin: {
        description: 'Detailed content/description for tooltips',
      },
    },
    {
      name: 'price',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Price in rupees for this hang option',
      },
    },
    {
      name: 'available',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this hang option is available for selection',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Order in which hang options should appear in the UI',
      },
    },
  ],
};
