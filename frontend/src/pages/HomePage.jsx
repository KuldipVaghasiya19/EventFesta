import { useEffect } from 'react';
import HeroSection from '../components/Home/HeroSection';
import FeaturedEvents from '../components/Home/FeaturedEventSection';
import WhyChooseUs from '../components/Home/WhyChooseUse';
import EventCategories from '../components/Home/EventCatagories';
import CTASection from '../components/Home/CTASection';
import TestimonialsSection from '../components/Home/TestimonialsSection';

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "TechEvents - Discover Amazing Tech Events";
  }, []);

  return (
    <div>
      <HeroSection />
      <FeaturedEvents />
      <WhyChooseUs />
      {/* <EventCategories /> */}
      {/* <TestimonialsSection /> */}
      <CTASection />
    </div>
  );
};

export default HomePage;