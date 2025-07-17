import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Calendar, Users, ArrowRight, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
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

export default FeaturedEvents;