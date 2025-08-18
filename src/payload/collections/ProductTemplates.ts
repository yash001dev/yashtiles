import { CollectionConfig } from 'payload';
import { FAQBlock } from '../blocks/FAQBlock';
import { FrameSpecificationsBlock } from '../blocks/FrameSpecificationsBlock';
import { BannerBlock } from '../blocks/BannerBlock';
import { SliderBlock } from '../blocks/SliderBlock';
import { CustomHTMLBlock } from '../blocks/CustomHTMLBlock';

export const ProductTemplates: CollectionConfig = {
  slug: 'product-templates',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'isDefault', 'status'],
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
        description: 'Template name (e.g., "Standard Product Template", "Premium Frame Template")',
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
      type: 'textarea',
      admin: {
        description: 'Template description for admin reference',
      },
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Set as default template for new products',
      },
    },
    {
      name: 'blocks',
      type: 'blocks',
      required: true,
      blocks: [
        FAQBlock,
        FrameSpecificationsBlock,
        BannerBlock,
        SliderBlock,
        CustomHTMLBlock,
      ],
      admin: {
        description: 'Drag and drop blocks to design your product template',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      defaultValue: 'active',
      required: true,
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order in template selection',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // If this template is being set as default, unset all other defaults
        if (data.isDefault && operation === 'create') {
          await req.payload.update({
            collection: 'product-templates',
            where: {
              isDefault: { equals: true },
            },
            data: {
              isDefault: false,
            },
          });
        }
        
        if (data.isDefault && operation === 'update') {
          await req.payload.update({
            collection: 'product-templates',
            where: {
              and: [
                { isDefault: { equals: true } },
                { id: { not_equals: req.data?.id } },
              ],
            },
            data: {
              isDefault: false,
            },
          });
        }
        
        return data;
      },
    ],
  },
};