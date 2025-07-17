import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "TechEvents has transformed how I discover industry conferences. The platform is intuitive and the recommendations are spot-on!",
      author: "Sarah Johnson",
      role: "Software Engineer",
      company: "Google",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      quote: "As an event organizer, I've seen a 40% increase in attendance after listing on TechEvents. Their promotional tools are excellent.",
      author: "Michael Chen",
      role: "Event Manager",
      company: "TechConf",
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      quote: "The networking opportunities at events I found through this platform have been instrumental in growing my startup.",
      author: "Jessica Williams",
      role: "CEO",
      company: "DataFlow",
      avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      quote: "The quality of events and speakers on TechEvents is consistently high. It's my go-to platform for professional development.",
      author: "David Kumar",
      role: "Tech Lead",
      company: "Microsoft",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      quote: "I've attended over 20 events through this platform and each one has been valuable for my career growth.",
      author: "Lisa Zhang",
      role: "Product Manager",
      company: "Amazon",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    }
  ];
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
            What People <span className="text-primary-500">Say About Us</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from our community of event organizers and participants.
          </p>
        </div>
        
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={{
            prevEl: '.testimonials-prev',
            nextEl: '.testimonials-next',
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="relative"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="bg-gray-50 rounded-xl p-8 shadow-sm h-full flex flex-col">
                <div className="text-primary-500 text-4xl mb-4">"</div>
                <p className="text-gray-700 italic mb-6 flex-grow">{testimonial.quote}</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author} 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.author}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <div className="flex justify-center items-center mt-8 gap-4">
          <button className="testimonials-prev bg-white hover:bg-primary-50 text-primary-600 p-3 rounded-full shadow-md transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button className="testimonials-next bg-white hover:bg-primary-50 text-primary-600 p-3 rounded-full shadow-md transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;