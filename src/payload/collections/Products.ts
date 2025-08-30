import { CollectionConfig } from "payload";
import { FAQBlock } from "../blocks/FAQBlock";
import { defaultFaqsData } from "@/lib/faq-data";
import { FeatureBlock } from "../blocks/FeaturedBlock";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "price", "status", "categories"],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    // Basic Information Tab
    {
      type: "tabs",
      tabs: [
        {
          label: "Basic Information",
          fields: [
            {
              name: "name",
              type: "text",
              required: true,
              admin: {
                description: 'Product name (e.g., "Classic Black Frame")',
              },
            },
            {
              name: "slug",
              type: "text",
              required: true,
              unique: true,
              admin: {
                description: "URL-friendly version of the name",
              },
              hooks: {
                beforeValidate: [
                  ({ value, data }) => {
                    if (!value && data?.name) {
                      return data.name
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "");
                    }
                    return value;
                  },
                ],
              },
            },
            {
              name: "description",
              type: "richText",
              required: true,
              admin: {
                description: "Detailed product description",
              },
            },
            {
              name: "shortDescription",
              type: "textarea",
              maxLength: 200,
              admin: {
                description: "Brief description for product cards",
              },
            },
            {
              name: "categories",
              type: "relationship",
              relationTo: "product-categories",
              hasMany: true,
              required: true,
              admin: {
                description: "Product categories",
              },
            },
            {
              name: "status",
              type: "select",
              options: [
                { label: "Draft", value: "draft" },
                { label: "Published", value: "published" },
                { label: "Archived", value: "archived" },
              ],
              defaultValue: "draft",
              required: true,
            },
            {
              name: "featured",
              type: "checkbox",
              defaultValue: false,
              admin: {
                description: "Feature this product on homepage",
              },
            },
          ],
        },
        {
          label: "Media & Images",
          fields: [
            {
              name: "images",
              type: "array",
              required: true,
              minRows: 1,
              maxRows: 10,
              fields: [
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media",
                  required: true,
                },
                {
                  name: "alt",
                  type: "text",
                  required: true,
                },
                {
                  name: "caption",
                  type: "text",
                },
              ],
            },
          ],
        },
        {
          label: "Variants & Options",
          fields: [
            {
              name: "basePrice",
              type: "number",
              required: true,
              min: 0,
              admin: {
                description:
                  "Base price in INR (before size/color/material modifiers)",
              },
            },
            {
              name: "compareAtPrice",
              type: "number",
              min: 0,
              admin: {
                description: "Original price for discount display",
              },
            },
            {
              name: "availableSizes",
              type: "relationship",
              relationTo: "sizes",
              hasMany: true,
              required: true,
              admin: {
                description: "Available frame sizes (default 6 will be shown)",
              },
            },
            {
              name: "defaultColors",
              type: "relationship",
              relationTo: "frame-colors",
              hasMany: true,
              maxRows: 3,
              required: true,
              admin: {
                description: "Default colors to show (first 3)",
              },
            },
            {
              name: "additionalColors",
              type: "relationship",
              relationTo: "frame-colors",
              hasMany: true,
              admin: {
                description: "Additional colors user can select",
              },
            },
            {
              name: "defaultMaterials",
              type: "relationship",
              relationTo: "materials",
              hasMany: true,
              maxRows: 3,
              required: true,
              admin: {
                description: "Default materials to show (first 3)",
              },
            },
            {
              name: "additionalMaterials",
              type: "relationship",
              relationTo: "materials",
              hasMany: true,
              admin: {
                description: "Additional materials user can select",
              },
            },
            {
              name: "variantPricing",
              type: "array",
              admin: {
                description: "Price modifiers for specific combinations",
              },
              fields: [
                {
                  name: "size",
                  type: "relationship",
                  relationTo: "sizes",
                  required: true,
                },
                {
                  name: "color",
                  type: "relationship",
                  relationTo: "frame-colors",
                  required: true,
                },
                {
                  name: "material",
                  type: "relationship",
                  relationTo: "materials",
                  required: true,
                },
                {
                  name: "priceModifier",
                  type: "number",
                  defaultValue: 0,
                  admin: {
                    description:
                      "Price adjustment (+ or -) for this combination",
                  },
                },
                {
                  name: "stock",
                  type: "number",
                  min: 0,
                  defaultValue: 0,
                  admin: {
                    description: "Stock for this specific variant",
                  },
                },
                {
                  name: "isAvailable",
                  type: "checkbox",
                  defaultValue: true,
                },
              ],
            },
          ],
        },
        {
          label: "Product Details",
          fields: [
            {
              name: "features",
              type: "array",
              fields: [
                {
                  name: "feature",
                  type: "text",
                  required: true,
                },
              ],
              admin: {
                description: "Key product features",
              },
            },
            {
              name: "specifications",
              type: "group",
              fields: [
                {
                  name: "weight",
                  type: "text",
                },
                {
                  name: "dimensions",
                  type: "text",
                },
                {
                  name: "mounting",
                  type: "select",
                  options: [
                    { label: "Stickable Tape", value: "stickable_tape" },
                    { label: "Standard Hook", value: "standard_hook" },
                    { label: "Both Options", value: "both" },
                  ],
                  defaultValue: "stickable_tape",
                },
              ],
            },
          ],
        },
        {
          label: "Inventory & SKU",
          fields: [
            {
              name: "stock",
              type: "number",
              min: 0,
              defaultValue: 0,
              admin: {
                description:
                  "General stock quantity (individual variant stock in Variants tab)",
              },
            },
            {
              name: "sku",
              type: "text",
              unique: true,
              admin: {
                description: "Stock Keeping Unit",
              },
            },
            {
              name: "trackInventory",
              type: "checkbox",
              defaultValue: true,
              admin: {
                description: "Track inventory for this product",
              },
            },
          ],
        },
        {
          label: "SEO & Meta",
          fields: [
            {
              name: "seo",
              type: "group",
              fields: [
                {
                  name: "title",
                  type: "text",
                  maxLength: 60,
                },
                {
                  name: "description",
                  type: "textarea",
                  maxLength: 160,
                },
                {
                  name: "keywords",
                  type: "text",
                },
              ],
            },
          ],
        },
      ],
    },
    // Keep compatibility with existing price field (computed from basePrice)
    {
      name: "price",
      type: "number",
      admin: {
        readOnly: true,
        description: "Computed from base price (read-only)",
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            // Set price to basePrice for backward compatibility
            return data?.basePrice || 0;
          },
        ],
      },
    },
    {
      name: 'pageLayout',
      type: 'blocks',
      labels: {
        singular: 'Block',
        plural: 'Blocks',
      },
      blocks: [
        FAQBlock,
        FeatureBlock
        // Add other blocks here if you have them (e.g., ImageBlock, CallToActionBlock)
      ],
      // This is the key part to set the default FAQ block
      defaultValue: [
        {
          blockType: 'faq',
          title: 'Frequently Asked Questions',
          faqs: defaultFaqsData, // Use the prepared default data
          style: 'accordion',
          showCategories: false,
        },
        {
          blockType: 'featureBlock',

          items: [
            {
              image:9,
              title: "We've got you covered",
              description:
                'With our hassle-free return policy, we guarantee quick replacements or instant refunds for damaged products or in case of incorrect product delivered.',
            },
            {
              image:10,
              title: 'Multiple Sizes',
              description:
                'Our versatile and diverse range of products, available in multiple sizes. From Basic to Luxury—whatever your needs may be.',
            },
            {
              image:11,
              title: 'Customer Satisfaction',
              description:
                'Crafted with care and attention to detail, our products deliver beyond expectations—every single time.',
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-generate SKU if not provided
        if (!data.sku && data.name) {
          data.sku = `FRAME-${data.name.toUpperCase().replace(/[^A-Z0-9]/g, "")}-${Date.now()}`;
        }

        // Set price from basePrice for compatibility
        if (data.basePrice) {
          data.price = data.basePrice;
        }

        return data;
      },
    ],
  },
};
