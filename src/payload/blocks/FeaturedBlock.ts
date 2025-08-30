import type { Block } from 'payload';

export const FeatureBlock: Block = {
  slug: 'featureBlock',
  labels: { singular: 'Feature Block', plural: 'Feature Blocks' },
  fields: [
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Feature Item', plural: 'Feature Items' },
      minRows: 3,
      maxRows: 3, // enforce exactly 3 if you want
      required: true,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
      defaultValue: [
        {
          title: "We've got you covered",
          description:
            'With our hassle-free return policy, we guarantee quick replacements or instant refunds for damaged products or in case of incorrect product delivered.',
        },
        {
          title: 'Multiple Sizes',
          description:
            'Our versatile and diverse range of products, available in multiple sizes. From Basic to Luxury—whatever your needs may be.',
        },
        {
          title: 'Customer Satisfaction',
          description:
            'Crafted with care and attention to detail, our products deliver beyond expectations—every single time.',
        },
      ],
    },
  ],
};
