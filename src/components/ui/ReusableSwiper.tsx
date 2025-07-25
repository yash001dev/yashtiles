import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

interface ReusableSwiperProps {
  children: React.ReactNode;
  swiperProps?: any;
  prevButton?: React.RefObject<HTMLButtonElement>;
  nextButton?: React.RefObject<HTMLButtonElement>;
  onSwiperInit?: (swiper: any) => void;
}

const ReusableSwiper: React.FC<ReusableSwiperProps> = ({
  children,
  swiperProps = {},
  prevButton,
  nextButton,
  onSwiperInit,
}) => {
  const swiperRef = useRef<any>(null);

  return (
    <Swiper
      ref={swiperRef}
      navigation={{
        prevEl: prevButton?.current,
        nextEl: nextButton?.current,
      }}
      onInit={(swiper) => {
        swiperRef.current = swiper;
        // Type guard for navigation params
        if (swiper.params.navigation && typeof swiper.params.navigation === 'object') {
          if (prevButton?.current) (swiper.params.navigation as any).prevEl = prevButton.current;
          if (nextButton?.current) (swiper.params.navigation as any).nextEl = nextButton.current;
        }
        swiper.navigation.init();
        swiper.navigation.update();
        onSwiperInit && onSwiperInit(swiper);
      }}
      modules={[Autoplay, EffectCoverflow, Pagination, Navigation]}
      {...swiperProps}
    >
      {children}
    </Swiper>
  );
};

export { SwiperSlide };
export default ReusableSwiper; 