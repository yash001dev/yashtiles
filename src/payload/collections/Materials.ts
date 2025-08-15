import { CollectionConfig } from 'payload';

export const Materials: CollectionConfig = {
  slug: 'materials',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'description', 'available'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  // upload: {
  //   staticDir: 'materials',
  //   staticURL: '/materials',
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
        description: 'Name of the material (e.g., Classic Frame, Frameless)',
      },
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      admin: {
        description: 'Short description of the material',
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
      name: 'link',
      type: 'text',
      admin: {
        description: 'External link for more information',
      },
    },
    {
      name: 'available',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this material is available for selection',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Order in which materials should appear in the UI',
      },
    },
  ],
};
