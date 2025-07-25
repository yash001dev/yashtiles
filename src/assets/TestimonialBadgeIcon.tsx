import React from "react";
import { Image } from "@imagekit/next";
const TestimonialBadgeIcon = ({img}: {img: string}) => (
  <Image
  urlEndpoint={`${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}`}
  src={img}
  alt="Testimonial Badge"
  width={100}
  height={100}
  className="w-30 h-30"
/>  
);
export default TestimonialBadgeIcon;