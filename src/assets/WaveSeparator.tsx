import React from "react";
const WaveSeparator = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} className={`w-full h-20 text-wood-600/30 ${props.className ?? ""}`} viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
    <path d="M1200 120L0 16.48V120z" fill="currentColor"></path>
  </svg>
);
export default WaveSeparator;