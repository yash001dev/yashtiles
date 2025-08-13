import { CollectionConfig } from 'payload';
import { FAQBlock } from '../blocks/FAQBlock';
import { FrameSpecificationsBlock } from '../blocks/FrameSpecificationsBlock';
import { BannerBlock } from '../blocks/BannerBlock';
import { SliderBlock } from '../blocks/SliderBlock';
import { CustomHTMLBlock } from '../blocks/CustomHTMLBlock';

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true;
      return {
        status: { equals: 'published' },
      };
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
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
      name: 'pageType',
      type: 'select',
      options: [
        { label: 'Product Listing Page', value: 'plp' },
        { label: 'Product Detail Page', value: 'pdp' },
        { label: 'Custom Page', value: 'custom' },
      ],
      required: true,
      defaultValue: 'custom',
    },
    {
      name: 'content',
      type: 'blocks',
      blocks: [
        FAQBlock,
        FrameSpecificationsBlock,
        BannerBlock,
        SliderBlock,
        CustomHTMLBlock,
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
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
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
  ],
};