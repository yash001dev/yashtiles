// utils/renderPayloadRichText.tsx
import React from "react";

type Node = {
  type: string;
  text?: string;
  tag?: string;
  format?: number;
  children?: Node[];
  fields?: any;
  listType?: string;
};

function renderText(node: Node, key: number) {
  let content: React.ReactNode = node.text;

  // Apply inline formatting (Payload uses bitmask)
  if (node.format) {
    if (node.format & 1) content = <strong key={key}>{content}</strong>; // Bold
    if (node.format & 2) content = <em key={key}>{content}</em>; // Italic
    if (node.format & 4) content = <u key={key}>{content}</u>; // Underline
    if (node.format & 8) content = <code key={key}>{content}</code>; // Code
  }

  return content;
}

function renderNode(node: Node, key: number): React.ReactNode {
  switch (node.type) {
    case "paragraph":
      return (
        <p key={key} className="mb-4 leading-relaxed">
          {node.children?.map((child, i) => renderNode(child, i))}
        </p>
      );

    case "text":
      return <React.Fragment key={key}>{renderText(node, key)}</React.Fragment>;

    case "list":
      return node.listType === "number" ? (
        <ol key={key} className="list-decimal list-inside mb-4 pl-4">
          {node.children?.map((child, i) => renderNode(child, i))}
        </ol>
      ) : (
        <ul key={key} className="list-disc list-inside mb-4 pl-4">
          {node.children?.map((child, i) => renderNode(child, i))}
        </ul>
      );

    case "listitem":
      return <li key={key}>{node.children?.map((child, i) => renderNode(child, i))}</li>;

    case "quote":
      return (
        <blockquote key={key} className="border-l-4 pl-4 italic text-gray-600 my-4">
          {node.children?.map((child, i) => renderNode(child, i))}
        </blockquote>
      );

    case "link":
      return (
        <a
          key={key}
          href={node.fields?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {node.children?.map((child, i) => renderNode(child, i))}
        </a>
      );

    case "heading":
      const Tag = (node.tag as keyof React.JSX.IntrinsicElements) || "h2";
      return (
        <Tag
          key={key}
          className="font-semibold mt-6 mb-2 text-gray-900 first:mt-0"
        >
          {node.children?.map((child, i) => renderNode(child, i))}
        </Tag>
      );

    default:
      return node.children?.map((child, i) => renderNode(child, i)) || null;
  }
}

export function renderPayloadRichText(content: any) {
  if (!content?.root) return null;
  return content.root.children?.map((child: Node, i: number) =>
    renderNode(child, i)
  );
}
