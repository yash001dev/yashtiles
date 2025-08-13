import { Block } from 'payload';

export const SliderBlock: Block = {
  slug: 'slider',
  labels: {
    singular: 'Slider',
    plural: 'Sliders',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Optional slider title',
      },
    },
    {
      name: 'slides',
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
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'richText',
        },
        {
          name: 'link',
          type: 'group',
          fields: [
            {
              name: 'url',
              type: 'text',
            },
            {
              name: 'text',
              type: 'text',
            },
            {
              name: 'openInNewTab',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
        {
          name: 'overlay',
          type: 'group',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'color',
              type: 'text',
              defaultValue: 'rgba(0,0,0,0.4)',
            },
            {
              name: 'position',
              type: 'select',
              options: [
                { label: 'Center', value: 'center' },
                { label: 'Bottom Left', value: 'bottom-left' },
                { label: 'Bottom Right', value: 'bottom-right' },
                { label: 'Top Left', value: 'top-left' },
                { label: 'Top Right', value: 'top-right' },
              ],
              defaultValue: 'center',
            },
          ],
        },
      ],
    },
    {
      name: 'settings',
      type: 'group',
      fields: [
        {
          name: 'autoplay',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'autoplayDelay',
          type: 'number',
          defaultValue: 5000,
          admin: {
            condition: (data) => data.settings?.autoplay,
            description: 'Delay in milliseconds',
          },
        },
        {
          name: 'showNavigation',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'showPagination',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'loop',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'effect',
          type: 'select',
          options: [
            { label: 'Slide', value: 'slide' },
            { label: 'Fade', value: 'fade' },
            { label: 'Cube', value: 'cube' },
            { label: 'Coverflow', value: 'coverflow' },
          ],
          defaultValue: 'slide',
        },
      ],
    },
    {
      name: 'height',
      type: 'select',
      options: [
        { label: 'Small (300px)', value: 'small' },
        { label: 'Medium (500px)', value: 'medium' },
        { label: 'Large (700px)', value: 'large' },
        { label: 'Auto', value: 'auto' },
      ],
      defaultValue: 'medium',
    },
  ],
};