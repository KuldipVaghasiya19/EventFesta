import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { ArrowRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/effect-fade';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Images for the hero slider
  const heroImages = [
    'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/7648047/pexels-photo-7648047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/2182973/pexels-photo-2182973.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ];

  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
      
      {/* Background Slider */}
      <Swiper
        className="absolute inset-0 w-full h-full"
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
      >
        {heroImages.map((image, index) => (
          <SwiperSlide key={index}>
            <div 
              className="w-full h-full bg-cover bg-center transition-transform duration-10000 transform scale-105"
              style={{ 
                backgroundImage: `url(${image})`,
                animation: currentSlide === index ? 'zoom-in 6s ease-in-out' : 'none'
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Hero Content */}
      <div className="container mx-auto px-4 md:px-6 z-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Text and CTA */}
          <div className="text-white animate-slide-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 leading-tight">
              Discover Amazing <span className="text-primary-400">Tech Events</span> Near You
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-xl">
              Connect with the tech community, learn from experts, and expand your network at top industry events.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/events" 
                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors flex items-center"
              >
                Browse Events <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/signup?role=organization" 
                className="px-6 py-3 bg-transparent hover:bg-white/10 text-white font-medium rounded-lg border-2 border-white transition-colors"
              >
                Host an Event
              </Link>
            </div>
          </div>
          
          {/* Right Column - Empty space for the background image to show */}
          <div className="hidden lg:block"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;