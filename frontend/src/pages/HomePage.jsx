import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Calendar, Users, ArrowRight, MapPin, Clock, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
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

const FeaturedEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Replace with your actual API endpoint
        const response = await fetch('http://localhost:8080/api/events', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Assuming the API returns an array of events
        // If the API returns data in a different format, adjust accordingly
        // e.g., if it returns { events: [...] }, use data.events
        setEvents(data.slice(0, 6)); // Limit to 6 events for featured section
        
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Loading state
  if (loading) {
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
          
          {/* Loading skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                    <div className="h-6 bg-gray-300 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
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
          
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-4">{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // No events state
  if (events.length === 0) {
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
          
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">No featured events available at the moment.</div>
            <Link 
              to="/events" 
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors inline-flex items-center"
            >
              Browse All Events <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    );
  }
  
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
        
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={{
            prevEl: '.featured-prev',
            nextEl: '.featured-next',
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="relative"
        >
          {events.map((event) => (
            <SwiperSlide key={event.id}>
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg group h-full">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={event.imageUrl} 
                    alt={event.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {event.type || 'Event'}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display font-bold text-xl text-gray-900 group-hover:text-primary-500 transition-colors mb-4">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-primary-500" />
                      <span className="text-sm">
                        {event.date ? new Date(event.date).toLocaleDateString() : 'Date TBD'}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-primary-500" />
                      <span className="text-sm">{event.location || 'Location TBD'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2 text-primary-500" />
                      <span className="text-sm">
                        {event.currentParticipants || 0} / {event.maxParticipants || 'Unlimited'} participants
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {event.tags && event.tags.length > 0 ? (
                      event.tags.slice(0, 2).map((tag, index) => (
                        <span 
                          key={index}
                          className="bg-primary-50 text-primary-600 text-xs font-medium px-2.5 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="bg-primary-50 text-primary-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Tech Event
                      </span>
                    )}
                  </div>
                  
                  <Link 
                    to={`/events/${event.id}`} 
                    className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors"
                  >
                    View Details <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <div className="flex justify-center items-center mt-8 gap-4">
          <button className="featured-prev bg-white hover:bg-primary-50 text-primary-600 p-3 rounded-full shadow-md transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button className="featured-next bg-white hover:bg-primary-50 text-primary-600 p-3 rounded-full shadow-md transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        
        <div className="text-center mt-8">
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
      color: "bg-blue-100 text-blue-800",
      description: "Large-scale industry gatherings"
    },
    {
      name: "Workshops",
      count: 24,
      icon: "🛠️",
      color: "bg-green-100 text-green-800",
      description: "Hands-on learning sessions"
    },
    {
      name: "Hackathons",
      count: 8,
      icon: "💻",
      color: "bg-purple-100 text-purple-800",
      description: "Competitive coding events"
    },
    {
      name: "Meetups",
      count: 32,
      icon: "👥",
      color: "bg-yellow-100 text-yellow-800",
      description: "Local community gatherings"
    },
    {
      name: "Webinars",
      count: 19,
      icon: "🖥️",
      color: "bg-red-100 text-red-800",
      description: "Online learning sessions"
    },
    {
      name: "Exhibitions",
      count: 12,
      icon: "🏢",
      color: "bg-indigo-100 text-indigo-800",
      description: "Product showcases"
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
        
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={{
            prevEl: '.categories-prev',
            nextEl: '.categories-next',
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            480: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
            1280: {
              slidesPerView: 5,
            },
          }}
          className="relative"
        >
          {categories.map((category, index) => (
            <SwiperSlide key={index}>
              <Link 
                to={`/events?type=${category.name.toLowerCase()}`}
                className="group block bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-2 h-full"
              >
                <div className="p-6 text-center h-full flex flex-col justify-between">
                  <div>
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary-500 transition-colors">{category.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${category.color}`}>
                    {category.count} events
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <div className="flex justify-center items-center mt-8 gap-4">
          <button className="categories-prev bg-white hover:bg-primary-50 text-primary-600 p-3 rounded-full shadow-md transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button className="categories-next bg-white hover:bg-primary-50 text-primary-600 p-3 rounded-full shadow-md transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
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