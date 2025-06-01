import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';
import { Calendar, Users, ArrowRight, MapPin, Clock, Tag } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { events } from '../data/events';

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

const FeaturedEvents = () => {
  const featuredEvents = events.slice(0, 6);
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
            Upcoming <span className="text-primary-500">Events</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and participate in the most anticipated tech events. Connect with industry experts and expand your knowledge.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-accent-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {event.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-display font-bold text-xl text-gray-900 group-hover:text-primary-500 transition-colors">
                    {event.title}
                  </h3>
                  <div className="bg-primary-50 text-primary-600 text-sm font-medium px-3 py-1 rounded-full">
                    {event.format}
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-primary-500" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-primary-500" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2 text-primary-500" />
                    <span className="text-sm">{event.attendees} attendees</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6 line-clamp-2">{event.description}</p>
                
                <Link 
                  to={`/events/${event.id}`} 
                  className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors"
                >
                  View Details <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            to="/events" 
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors inline-flex items-center"
          >
            View All Events <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
            Why Choose <span className="text-primary-500">TechEvents</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            The best platform for discovering, managing, and hosting tech events with features designed for the tech community.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Curated Tech Events",
              description: "Discover events specifically curated for the tech community, from workshops to conferences.",
              icon: "🔍"
            },
            {
              title: "Easy Registration",
              description: "Simple and secure registration process for both event organizers and participants.",
              icon: "📝"
            },
            {
              title: "Network Opportunities",
              description: "Connect with industry professionals, experts, and like-minded tech enthusiasts.",
              icon: "🌐"
            },
            {
              title: "Personalized Recommendations",
              description: "Get event suggestions tailored to your interests and previous attendance.",
              icon: "🎯"
            },
            {
              title: "Comprehensive Event Management",
              description: "Powerful tools for organizers to create, promote, and manage successful events.",
              icon: "⚙️"
            },
            {
              title: "Real-time Updates",
              description: "Stay informed with instant notifications about event changes and updates.",
              icon: "🔔"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-8 transition-all duration-300 hover:shadow-md hover:bg-gray-100">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-display font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const UpcomingCategories = () => {
  const categories = [
    {
      name: "Conferences",
      count: 15,
      icon: "🎤",
      color: "bg-blue-100 text-blue-800"
    },
    {
      name: "Workshops",
      count: 24,
      icon: "🛠️",
      color: "bg-green-100 text-green-800"
    },
    {
      name: "Hackathons",
      count: 8,
      icon: "💻",
      color: "bg-purple-100 text-purple-800"
    },
    {
      name: "Meetups",
      count: 32,
      icon: "👥",
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      name: "Webinars",
      count: 19,
      icon: "🖥️",
      color: "bg-red-100 text-red-800"
    }
  ];
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
            Explore Event <span className="text-primary-500">Categories</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect tech event format that matches your interests and learning style.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <Link 
              key={index} 
              to={`/events?category=${category.name.toLowerCase()}`}
              className="group block bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="p-6 text-center">
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-display font-bold text-lg mb-1 group-hover:text-primary-500 transition-colors">{category.name}</h3>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${category.color}`}>
                  {category.count} events
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-8 shadow-sm">
              <div className="text-primary-500 text-4xl mb-4">"</div>
              <p className="text-gray-700 italic mb-6">{testimonial.quote}</p>
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
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-16 bg-primary-600 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0 md:max-w-xl">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to Host Your Next Tech Event?
            </h2>
            <p className="text-lg text-primary-100">
              Join thousands of organizers who trust TechEvents to connect with the perfect audience for their events.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/signup?role=organization" 
              className="px-8 py-4 bg-white text-primary-600 font-bold rounded-lg hover:bg-gray-100 transition-colors text-center"
            >
              Register as Organizer
            </Link>
            <Link 
              to="/contact" 
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors text-center"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

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
      <UpcomingCategories />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default HomePage;