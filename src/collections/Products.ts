import { CollectionConfig } from 'payload/types'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
    defaultColumns: ['name', 'basePrice', 'featured', 'status', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of the name',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Brief description for product listings',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
        {
          label: 'Archived',
          value: 'archived',
        },
      ],
      defaultValue: 'draft',
      required: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show this product on the homepage',
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
      ],
    },
    {
      name: 'basePrice',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Base price in USD',
      },
    },
    {
      name: 'materials',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'material',
          type: 'select',
          options: [
            {
              label: 'Classic Frame',
              value: 'classic',
            },
            {
              label: 'Frameless',
              value: 'frameless',
            },
            {
              label: 'Canvas',
              value: 'canvas',
            },
          ],
          required: true,
        },
        {
          name: 'priceModifier',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Additional cost for this material (can be negative)',
          },
        },
      ],
    },
    {
      name: 'sizes',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'size',
          type: 'select',
          options: [
            {
              label: '8" × 8"',
              value: '8x8',
            },
            {
              label: '8" × 11"',
              value: '8x11',
            },
            {
              label: '11" × 8"',
              value: '11x8',
            },
            {
              label: '12" × 12"',
              value: '12x12',
            },
            {
              label: '16" × 20"',
              value: '16x20',
            },
          ],
          required: true,
        },
        {
          name: 'priceModifier',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Additional cost for this size (can be negative)',
          },
        },
      ],
    },
    {
      name: 'frameColors',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'color',
          type: 'select',
          options: [
            {
              label: 'Black',
              value: 'black',
            },
            {
              label: 'White',
              value: 'white',
            },
            {
              label: 'Oak',
              value: 'oak',
            },
            {
              label: 'Walnut',
              value: 'walnut',
            },
            {
              label: 'Silver',
              value: 'silver',
            },
          ],
          required: true,
        },
        {
          name: 'priceModifier',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Additional cost for this color (can be negative)',
          },
        },
      ],
    },
    {
      name: 'collections',
      type: 'relationship',
      relationTo: 'collections',
      hasMany: true,
      admin: {
        description: 'Collections this product belongs to',
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Tags for filtering and search',
      },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'SEO title (leave blank to use product name)',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'SEO description (leave blank to use short description)',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          admin: {
            description: 'Comma-separated keywords',
          },
        },
      ],
    },
  ],
}