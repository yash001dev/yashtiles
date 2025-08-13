import { Block } from 'payload';

export const FrameSpecificationsBlock: Block = {
  slug: 'frame-specifications',
  labels: {
    singular: 'Frame Specifications',
    plural: 'Frame Specifications',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Frame Specifications',
    },
    {
      name: 'subtitle',
      type: 'text',
      admin: {
        description: 'Optional subtitle',
      },
    },
    {
      name: 'layout',
      type: 'select',
      options: [
        { label: 'Image with Text', value: 'image-text' },
        { label: 'Carousel', value: 'carousel' },
        { label: 'Grid', value: 'grid' },
        { label: 'Tabs', value: 'tabs' },
      ],
      defaultValue: 'image-text',
      required: true,
    },
    {
      name: 'specifications',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'richText',
          required: true,
        },
        {
          name: 'images',
          type: 'array',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'caption',
              type: 'text',
            },
          ],
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
            {
              name: 'value',
              type: 'text',
              required: true,
            },
            {
              name: 'icon',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          name: 'sortOrder',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
    {
      name: 'showComparison',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show comparison table',
      },
    },
    {
      name: 'comparisonTable',
      type: 'array',
      admin: {
        condition: (data) => data.showComparison,
      },
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
        {
          name: 'classic',
          type: 'text',
          admin: {
            description: 'Value for Classic frames',
          },
        },
        {
          name: 'frameless',
          type: 'text',
          admin: {
            description: 'Value for Frameless frames',
          },
        },
        {
          name: 'canvas',
          type: 'text',
          admin: {
            description: 'Value for Canvas frames',
          },
        },
      ],
    },
  ],
};