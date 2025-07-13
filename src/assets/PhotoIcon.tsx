import React from "react";
const PhotoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} className={`w-8 h-8 text-slate-200 ${props.className ?? ""}`} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
  </svg>
);
export default PhotoIcon;