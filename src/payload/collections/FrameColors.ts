import { CollectionConfig } from 'payload';

export const FrameColors: CollectionConfig = {
  slug: 'frame-colors',
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
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the frame color (e.g., Black, White, Brown)',
      },
    },
    {
      name: 'color',
      type: 'text',
      required: true,
      admin: {
        description: 'CSS class for the color (e.g., bg-gray-900, bg-white)',
      },
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      admin: {
        description: 'Description of the frame color',
      },
    },
    {
      name: 'available',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this frame color is available for selection',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Order in which frame colors should appear in the UI',
      },
    },
  ],
};
