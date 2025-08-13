import { Block } from 'payload';

export const FAQBlock: Block = {
  slug: 'faq',
  labels: {
    singular: 'FAQ Section',
    plural: 'FAQ Sections',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Frequently Asked Questions',
    },
    {
      name: 'subtitle',
      type: 'text',
      admin: {
        description: 'Optional subtitle for the FAQ section',
      },
    },
    {
      name: 'faqs',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'richText',
          required: true,
        },
        {
          name: 'category',
          type: 'select',
          options: [
            { label: 'General', value: 'general' },
            { label: 'Shipping', value: 'shipping' },
            { label: 'Returns', value: 'returns' },
            { label: 'Product Care', value: 'care' },
            { label: 'Installation', value: 'installation' },
          ],
          defaultValue: 'general',
        },
        {
          name: 'sortOrder',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
    {
      name: 'style',
      type: 'select',
      options: [
        { label: 'Accordion', value: 'accordion' },
        { label: 'Tabs', value: 'tabs' },
        { label: 'Cards', value: 'cards' },
      ],
      defaultValue: 'accordion',
    },
    {
      name: 'showCategories',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Group FAQs by category',
      },
    },
  ],
};