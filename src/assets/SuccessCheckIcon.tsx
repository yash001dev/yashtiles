import React from "react";
const SuccessCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} className={`w-8 h-8 text-green-600 ${props.className ?? ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);
export default SuccessCheckIcon;