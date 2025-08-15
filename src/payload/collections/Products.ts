import { CollectionConfig } from 'payload';

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'status', 'categories'],
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
        description: 'Product name (e.g., "Classic Black Frame")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of the name',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            }
            return value;
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      admin: {
        description: 'Detailed product description',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      maxLength: 200,
      admin: {
        description: 'Brief description for product cards',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Base price in INR',
      },
    },
    {
      name: 'compareAtPrice',
      type: 'number',
      min: 0,
      admin: {
        description: 'Original price for discount display',
      },
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'product-categories',
      hasMany: true,
      required: true,
      admin: {
        description: 'Product categories',
      },
    },
    {
      name: 'variants',
      type: 'relationship',
      relationTo: 'sizes' as any,
      hasMany: true,
      required: true,
      admin: {
        description: 'Available frame sizes',
      },
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Key product features',
      },
    },
    {
      name: 'specifications',
      type: 'group',
      fields: [
        {
          name: 'material',
          type: 'text',
          required: true,
        },
        {
          name: 'weight',
          type: 'text',
        },
        {
          name: 'dimensions',
          type: 'text',
        },
        {
          name: 'mounting',
          type: 'select',
          options: [
            { label: 'Stickable Tape', value: 'stickable_tape' },
            { label: 'Standard Hook', value: 'standard_hook' },
            { label: 'Both Options', value: 'both' },
          ],
          defaultValue: 'stickable_tape',
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          maxLength: 60,
        },
        {
          name: 'description',
          type: 'textarea',
          maxLength: 160,
        },
        {
          name: 'keywords',
          type: 'text',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'draft',
      required: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Feature this product on homepage',
      },
    },
    {
      name: 'stock',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Available stock quantity',
      },
    },
    {
      name: 'sku',
      type: 'text',
      unique: true,
      admin: {
        description: 'Stock Keeping Unit',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-generate SKU if not provided
        if (!data.sku && data.name) {
          data.sku = `FRAME-${data.name.toUpperCase().replace(/[^A-Z0-9]/g, '')}-${Date.now()}`;
        }
        return data;
      },
    ],
  },
};