import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { SlateToLexicalFeature } from "@payloadcms/richtext-lexical/migrate";
import { CollectionConfig } from "payload";

export const ProductFAQs: CollectionConfig = {
  slug: "product-faqs",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "product"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "product",
      type: "relationship",
      relationTo: "products",
      required: true,
    },
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "subtitle",
      type: "text",
    },
    {
      name: "style",
      type: "select",
      options: [
        { label: "Accordion", value: "accordion" },
        { label: "Tabs", value: "tabs" },
        { label: "Cards", value: "cards" },
      ],
      defaultValue: "accordion",
    },
    {
      name: "showCategories",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "faqs",
      type: "array",
      required: true,
      minRows: 1,
      fields: [
        {
          name: "question",
          type: "text",
          required: true,
        },
        {
          name: "answer",
          type: "richText",
          required: true,
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [
              ...defaultFeatures,
              SlateToLexicalFeature({}),
            ],
          }),
        },
        {
          name: "category",
          type: "select",
          options: [
            { label: "General", value: "general" },
            { label: "Shipping", value: "shipping" },
            { label: "Returns", value: "returns" },
            { label: "Product Care", value: "care" },
            { label: "Installation", value: "installation" },
          ],
          defaultValue: "general",
        },
        {
          name: "sortOrder",
          type: "number",
          defaultValue: 0,
        },
      ],
    },
  ],
};
