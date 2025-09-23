// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

// import required modules
import { FreeMode, Mousewheel } from 'swiper/modules';

export default function SwiperTimer({ index = 24 }: { index?: number }) {
  return (
    <>
      <Swiper
        direction={'vertical'}
        modules={[FreeMode, Mousewheel]}
        slidesPerView={'auto'}
        spaceBetween={20}
        // mousewheel={true}
        // speed={800}
        freeMode={true} // Enables dynamic movement based on drag
        // freeModeMomentum={true} // Adds momentum for fast swipes
        loop={true}
        // freeMode={true}
        // freeMode={{
        //   //   enabled: true,
        //   momentum: true,
        //   //   momentumRatio: 2, // increase gliding speed
        // }}
        className="bg-primary/[0.05] h-[100px] w-fit rounded-md"
      >
        {Array.from({ length: index }).map((_, index) => (
          <SwiperSlide key={index} className="">
            <div className="w-40 text-center font-serif text-8xl">
              {index === 0 ? '00' : index < 10 ? `0${index}` : index}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
