'use client';

import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import { Document } from '@contentful/rich-text-types';

interface ProductDescriptionProps {
  description: Document;
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  // Rich text rendering options
  const options = {
    renderMark: {
      [MARKS.BOLD]: (text: React.ReactNode) => <strong className="font-semibold">{text}</strong>,
      [MARKS.ITALIC]: (text: React.ReactNode) => <em className="italic">{text}</em>,
      [MARKS.UNDERLINE]: (text: React.ReactNode) => <u className="underline">{text}</u>,
      [MARKS.CODE]: (text: React.ReactNode) => (
        <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{text}</code>
      ),
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (_node: any, children: React.ReactNode) => (
        <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
      ),
      [BLOCKS.HEADING_1]: (_node: any, children: React.ReactNode) => (
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{children}</h1>
      ),
      [BLOCKS.HEADING_2]: (_node: any, children: React.ReactNode) => (
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (_node: any, children: React.ReactNode) => (
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{children}</h3>
      ),
      [BLOCKS.HEADING_4]: (_node: any, children: React.ReactNode) => (
        <h4 className="text-lg font-semibold text-gray-900 mb-2">{children}</h4>
      ),
      [BLOCKS.HEADING_5]: (_node: any, children: React.ReactNode) => (
        <h5 className="text-base font-semibold text-gray-900 mb-2">{children}</h5>
      ),
      [BLOCKS.HEADING_6]: (_node: any, children: React.ReactNode) => (
        <h6 className="text-sm font-semibold text-gray-900 mb-2">{children}</h6>
      ),
      [BLOCKS.UL_LIST]: (_node: any, children: React.ReactNode) => (
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (_node: any, children: React.ReactNode) => (
        <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (_node: any, children: React.ReactNode) => (
        <li className="ml-4">{children}</li>
      ),
      [BLOCKS.QUOTE]: (_node: any, children: React.ReactNode) => (
        <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 italic text-gray-600 bg-gray-50">
          {children}
        </blockquote>
      ),
      [BLOCKS.HR]: () => <hr className="my-6 border-gray-300" />,
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        const { title, file } = node.data.target.fields;
        const imageUrl = file?.url;
        
        if (imageUrl) {
          return (
            <div className="my-6">
              <img
                src={`https:${imageUrl}`}
                alt={title || 'Embedded image'}
                className="w-full h-auto rounded-lg shadow-sm"
              />
              {title && (
                <p className="text-sm text-gray-600 text-center mt-2 italic">{title}</p>
              )}
            </div>
          );
        }
        return null;
      },
      [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => (
        <a
          href={node.data.uri}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {children}
        </a>
      ),
    },
  };

  if (!description) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h2>
      <div className="prose prose-gray max-w-none">
        {documentToReactComponents(description, options)}
      </div>
    </div>
  );
}