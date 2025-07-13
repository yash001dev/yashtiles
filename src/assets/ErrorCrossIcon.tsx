import React from "react";
const ErrorCrossIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} className={`w-8 h-8 text-red-600 ${props.className ?? ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
export default ErrorCrossIcon;