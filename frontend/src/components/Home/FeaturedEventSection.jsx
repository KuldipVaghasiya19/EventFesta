import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Calendar, Users, ArrowRight, MapPin, ChevronLeft, ChevronRight, Clock, Building } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
        
        const response = await fetch('http://localhost:8080/api/events', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        
        // --- FIX: Unwrap the ApiResponse structure ---
        const eventsArray = responseData.success !== undefined ? responseData.data : responseData;
        
        if (Array.isArray(eventsArray)) {
          // Sort by date (newest first) and limit to 6
          const sortedEvents = eventsArray.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
          setEvents(sortedEvents.slice(0, 6));
        } else {
          setEvents([]);
        }
        
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load featured events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getEventTypeColor = (type) => {
    if (!type) return 'bg-primary-500';
    const colorMap = {
      'workshop': 'bg-blue-500', 'seminar': 'bg-green-500', 'conference': 'bg-purple-500',
      'hackathon': 'bg-red-500', 'meetup': 'bg-orange-500', 'webinar': 'bg-indigo-500',
      'bootcamp': 'bg-pink-500', 'networking': 'bg-teal-500', 'training': 'bg-yellow-500',
      'symposium': 'bg-cyan-500', 'summit': 'bg-violet-500', 'expo': 'bg-emerald-500',
    };
    const normalizedType = type.toLowerCase();
    return colorMap[normalizedType] || 'bg-primary-500';
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-navy-900 transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight">
              Upcoming <span className="text-primary-500">Events</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
              Discover and participate in the most anticipated tech events. Connect with industry experts and expand your knowledge.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-navy-800 rounded-3xl shadow-xl overflow-hidden animate-pulse border border-gray-100 dark:border-navy-700">
                <div className="h-52 bg-gray-200 dark:bg-navy-700"></div>
                <div className="p-8">
                  <div className="h-8 bg-gray-200 dark:bg-navy-700 rounded-xl mb-6"></div>
                  <div className="space-y-4 mb-6">
                    <div className="h-4 bg-gray-200 dark:bg-navy-700 rounded-md w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-navy-700 rounded-md w-1/2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-navy-700 rounded-md w-2/3"></div>
                  </div>
                  <div className="flex gap-3 mb-6 mt-auto">
                    <div className="h-8 bg-gray-200 dark:bg-navy-700 rounded-lg w-20"></div>
                    <div className="h-8 bg-gray-200 dark:bg-navy-700 rounded-lg w-24"></div>
                  </div>
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
      <section className="py-20 bg-gray-50 dark:bg-navy-900 transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight">
              Upcoming <span className="text-primary-500">Events</span>
            </h2>
          </div>
          
          <div className="bg-white dark:bg-navy-800 rounded-3xl shadow-xl border border-gray-100 dark:border-navy-700 max-w-lg mx-auto p-10 text-center">
            <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-10 w-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Oops!</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/30 hover:-translate-y-0.5"
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
      <section className="py-20 bg-gray-50 dark:bg-navy-900 transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight">
              Upcoming <span className="text-primary-500">Events</span>
            </h2>
          </div>
          
          <div className="bg-white dark:bg-navy-800 rounded-3xl shadow-xl border border-gray-100 dark:border-navy-700 max-w-2xl mx-auto p-12 text-center">
             <div className="text-6xl mb-6">🗓️</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Featured Events</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">We are currently preparing an amazing lineup. Check back soon!</p>
            <Link 
              to="/events" 
              className="inline-flex items-center px-8 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/30 hover:-translate-y-0.5"
            >
              Browse All Events <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-24 bg-gray-50 dark:bg-navy-900 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/5 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-purple-500/5 blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight">
            Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-purple-600">Events</span>
          </h2>
          <p className="mt-5 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            Discover and participate in the most anticipated tech events. Connect with industry experts and expand your knowledge.
          </p>
        </div>
        
        <div className="relative px-4 sm:px-12">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              prevEl: '.featured-prev',
              nextEl: '.featured-next',
            }}
            pagination={{ 
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{ delay: 5000, disableOnInteraction: true }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-16 pt-4"
          >
            {events.map((event) => (
              <SwiperSlide key={event.id} className="h-auto">
                <div className="bg-white dark:bg-navy-800 rounded-3xl shadow-lg dark:shadow-dark overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-gray-100 dark:border-navy-700 flex flex-col h-full group">
                  <div className="relative h-56 overflow-hidden shrink-0">
                    <img 
                      src={event.imageUrl || 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} 
                      alt={event.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
                      }}
                    />
                    <div className={`absolute top-4 right-4 ${getEventTypeColor(event.type)} text-white text-xs font-extrabold tracking-wide px-3 py-1.5 rounded-lg shadow-lg`}>
                      {event.type ? event.type.charAt(0).toUpperCase() + event.type.slice(1) : 'General'}
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8 flex flex-col flex-grow">
                    <h3 className="font-display font-bold text-2xl text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors mb-5 line-clamp-2">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-3 mb-6 flex-grow">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Calendar className="h-5 w-5 mr-3 text-primary-500 shrink-0" />
                        <span className="text-sm font-medium">
                          {event.eventDate ? new Date(event.eventDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'}) : 'Date TBD'}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <MapPin className="h-5 w-5 mr-3 text-primary-500 shrink-0" />
                        <span className="text-sm font-medium truncate">{event.location || 'Location TBD'}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Users className="h-5 w-5 mr-3 text-primary-500 shrink-0" />
                        <span className="text-sm font-medium">
                          {event.currentParticipants || 0} / {event.maxParticipants || 'Unlimited'} Registered
                        </span>
                      </div>
                    </div>

                    {event.lastRegistertDate && (
                      <div className="mb-6 flex items-center text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-2 rounded-xl w-fit border border-amber-100 dark:border-amber-500/20">
                        <Clock className="h-4 w-4 mr-2 shrink-0" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Deadline: {new Date(event.lastRegistertDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    )}
                    
                    <div className="mt-auto border-t border-gray-100 dark:border-navy-700 pt-6 flex items-center justify-between">
                      <div className="flex gap-2 truncate pr-4">
                        {event.tags && event.tags.length > 0 ? (
                          event.tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-navy-900 text-gray-600 dark:text-gray-300 text-xs font-bold tracking-wide rounded-md truncate">
                              #{tag}
                            </span>
                          ))
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 dark:bg-navy-900 text-gray-600 dark:text-gray-300 text-xs font-bold tracking-wide rounded-md">
                            Tech Event
                          </span>
                        )}
                        {event.tags && event.tags.length > 2 && (
                           <span className="px-2 py-1 text-gray-400 text-xs font-bold">+{event.tags.length - 2}</span>
                        )}
                      </div>
                      
                      <Link 
                        to={`/events/${event.id}`} 
                        className="shrink-0 inline-flex items-center justify-center p-2.5 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-xl hover:bg-primary-500 hover:text-white transition-all duration-300 shadow-sm"
                      >
                         <ArrowRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Absolute Navigation Buttons for Swiper */}
          <button className="featured-prev absolute left-0 top-[40%] -translate-y-1/2 z-20 bg-white dark:bg-navy-800 text-primary-600 dark:text-primary-400 p-3 lg:p-4 rounded-full shadow-xl hover:bg-primary-50 dark:hover:bg-navy-700 border border-gray-100 dark:border-navy-700 transition-all hover:scale-110 hidden sm:flex">
            <ChevronLeft className="h-6 w-6 stroke-[3]" />
          </button>
          <button className="featured-next absolute right-0 top-[40%] -translate-y-1/2 z-20 bg-white dark:bg-navy-800 text-primary-600 dark:text-primary-400 p-3 lg:p-4 rounded-full shadow-xl hover:bg-primary-50 dark:hover:bg-navy-700 border border-gray-100 dark:border-navy-700 transition-all hover:scale-110 hidden sm:flex">
            <ChevronRight className="h-6 w-6 stroke-[3]" />
          </button>
        </div>
        
        <div className="text-center mt-4">
          <Link 
            to="/events" 
            className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Explore All Events <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;