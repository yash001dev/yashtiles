import { Block } from 'payload';

export const BannerBlock: Block = {
  slug: 'banner',
  labels: {
    singular: 'Banner',
    plural: 'Banners',
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Hero Banner', value: 'hero' },
        { label: 'Promotional Banner', value: 'promo' },
        { label: 'Info Banner', value: 'info' },
        { label: 'CTA Banner', value: 'cta' },
      ],
      defaultValue: 'hero',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'backgroundColor',
      type: 'text',
      admin: {
        description: 'Hex color code (e.g., #ffffff)',
      },
    },
    {
      name: 'textColor',
      type: 'text',
      admin: {
        description: 'Hex color code for text',
      },
    },
    {
      name: 'buttons',
      type: 'array',
      maxRows: 2,
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'style',
          type: 'select',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
          ],
          defaultValue: 'primary',
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'alignment',
      type: 'select',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
      defaultValue: 'center',
    },
    {
      name: 'height',
      type: 'select',
      options: [
        { label: 'Small (300px)', value: 'small' },
        { label: 'Medium (500px)', value: 'medium' },
        { label: 'Large (700px)', value: 'large' },
        { label: 'Full Screen', value: 'full' },
      ],
      defaultValue: 'medium',
    },
  ],
};