import { Block } from 'payload';

export const CustomHTMLBlock: Block = {
  slug: 'custom-html',
  labels: {
    singular: 'Custom HTML',
    plural: 'Custom HTML Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Internal title for identification',
      },
    },
    {
      name: 'html',
      type: 'code',
      required: true,
      admin: {
        language: 'html',
        description: 'Custom HTML content',
      },
    },
    {
      name: 'css',
      type: 'code',
      admin: {
        language: 'css',
        description: 'Optional custom CSS styles',
      },
    },
    {
      name: 'javascript',
      type: 'code',
      admin: {
        language: 'javascript',
        description: 'Optional custom JavaScript',
      },
    },
    {
      name: 'wrapperClass',
      type: 'text',
      admin: {
        description: 'CSS class for the wrapper div',
      },
    },
    {
      name: 'isFullWidth',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Remove container padding for full-width content',
      },
    },
  ],
};