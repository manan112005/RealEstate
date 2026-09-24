import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import QuickFilterBar from './QuickFilterBar';
import 'swiper/css';
import 'swiper/css/effect-fade';

const slides = [
  { image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1920', title: 'Find Your Perfect Property in Gujarat', subtitle: 'Explore premium residential, commercial, and bank auction properties.' },
  { image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920', title: 'Invest in Commercial Spaces', subtitle: 'High ROI properties handpicked for your business growth.' },
  { image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1920', title: 'Secure Bank Auctions', subtitle: 'Unbeatable deals below market value, exclusively sourced.' },
];

const HeroBanner = () => {
  return (
    <div className="relative w-full h-[90vh] min-h-[650px] flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        <Swiper
          modules={[EffectFade, Autoplay]}
          effect="fade"
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          className="w-full h-full"
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <div className="w-full h-full relative bg-[var(--color-primary)]">
                {/* Overlay with gradient for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60 z-10" />
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  className="w-full h-full object-cover scale-105 animate-[kenburns_20s_ease-out_infinite_alternate] opacity-80" 
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Hero Content */}
      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-24 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 w-full max-w-4xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-lg leading-tight tracking-tight">
            Find Your Perfect <br className="hidden md:block" /> 
            <span className="text-[var(--color-secondary)]">Property in Gujarat</span>
          </h1>
          <p className="text-lg md:text-xl text-white/95 font-medium max-w-2xl mx-auto drop-shadow-md">
            Explore exclusive luxury properties, secure bank auctions, and premium commercial spaces tailored for you.
          </p>
        </motion.div>

        {/* Integrated Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="w-full"
        >
          <QuickFilterBar />
        </motion.div>
      </div>

    </div>
  );
};

export default HeroBanner;
