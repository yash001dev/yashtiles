import React from "react";
const TestimonialBadgeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} className={`w-8 h-8 ${props.className ?? ""}`} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    {/* Insert the path(s) from your testimonial badge SVG here */}
  </svg>
);
export default TestimonialBadgeIcon;