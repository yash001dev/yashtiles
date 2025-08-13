import { CollectionConfig } from 'payload';

export const FrameSizes: CollectionConfig = {
  slug: 'frame-sizes',
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'dimensions', 'price', 'status'],
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
      unique: true,
      admin: {
        description: 'Size identifier (e.g., "8x10", "12x16")',
      },
    },
    {
      name: 'displayName',
      type: 'text',
      required: true,
      admin: {
        description: 'Display name (e.g., "8″ × 10″")',
      },
    },
    {
      name: 'dimensions',
      type: 'group',
      fields: [
        {
          name: 'width',
          type: 'number',
          required: true,
          admin: {
            description: 'Width in inches',
          },
        },
        {
          name: 'height',
          type: 'number',
          required: true,
          admin: {
            description: 'Height in inches',
          },
        },
        {
          name: 'aspectRatio',
          type: 'number',
          required: true,
          admin: {
            description: 'Calculated aspect ratio (width/height)',
          },
        },
      ],
    },
    {
      name: 'basePrice',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Base price for this size in INR',
      },
    },
    {
      name: 'colors',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Color name (e.g., "Classic Black", "Pure White")',
          },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: {
            description: 'Color code or identifier (e.g., "black", "white", "#000000")',
          },
        },
        {
          name: 'hexCode',
          type: 'text',
          admin: {
            description: 'Hex color code for display',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Color swatch or frame sample image',
          },
        },
        {
          name: 'priceModifier',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Price adjustment for this color (+ or -)',
          },
        },
        {
          name: 'stock',
          type: 'number',
          defaultValue: 0,
          min: 0,
          admin: {
            description: 'Available stock for this color',
          },
        },
        {
          name: 'isDefault',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Default color for this size',
          },
        },
      ],
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
        { label: 'Extra Large', value: 'extra-large' },
      ],
      required: true,
    },
    {
      name: 'isPopular',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark as popular size',
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
        description: 'Display order (lower numbers appear first)',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Calculate aspect ratio
        if (data.dimensions?.width && data.dimensions?.height) {
          data.dimensions.aspectRatio = data.dimensions.width / data.dimensions.height;
        }
        
        // Ensure only one default color per size
        if (data.colors) {
          let hasDefault = false;
          data.colors = data.colors.map((color: any) => {
            if (color.isDefault && !hasDefault) {
              hasDefault = true;
              return color;
            } else if (color.isDefault && hasDefault) {
              return { ...color, isDefault: false };
            }
            return color;
          });
          
          // If no default is set, make the first color default
          if (!hasDefault && data.colors.length > 0) {
            data.colors[0].isDefault = true;
          }
        }
        
        return data;
      },
    ],
  },
};