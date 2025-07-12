import React from "react";
const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} className={`h-4 w-4 ${props.className ?? ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
export default CloseIcon;