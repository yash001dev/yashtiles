import React from "react";

interface CMSContentRendererProps {
  content: any[];
}

export default function CMSContentRenderer({ content }: CMSContentRendererProps) {
  if (!content || content.length === 0) return null;

  return (
    <div className="space-y-12">
      {content.map((block, index) => (
        <div key={index}>
          {/* Placeholder for CMS content blocks */}
          <div className="text-center py-8 text-gray-500">
            CMS Block: {block.blockType}
          </div>
        </div>
      ))}
    </div>
  );
}
