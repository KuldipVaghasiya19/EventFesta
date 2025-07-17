import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, MapPin, Users, Search, Filter, ArrowRight, X, Building, Tag } from 'lucide-react';
import './animations.css'; // Import the CSS file

const HeroSection = () => {
  return (
    <section className="relative h-96 flex items-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-navy-900 dark:via-slate-800 dark:to-navy-900">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-primary-400/30 to-primary-500/20 animate-shimmer"></div>
        
        {/* Additional flowing animation */}
        <div className="absolute inset-0 bg-gradient-to-l from-primary-600/10 via-transparent to-primary-400/10 animate-flow"></div>
        
        {/* Pulse overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-primary-600/5 animate-pulse-slow"></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[length:20px_20px]"></div>
        </div>
        
        {/* Floating elements with improved animations */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary-500/20 rounded-full blur-xl animate-float-bounce"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-primary-400/20 rounded-full blur-xl animate-float-delayed-bounce"></div>
        <div className="absolute bottom-16 left-1/4 w-12 h-12 bg-primary-600/20 rounded-full blur-xl animate-float-slow-bounce"></div>
        <div className="absolute bottom-20 right-1/3 w-24 h-24 bg-primary-300/20 rounded-full blur-xl animate-float-delayed-bounce"></div>
        
        {/* Additional floating particles */}
        <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-primary-400/15 rounded-full blur-lg animate-drift"></div>
        <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-primary-500/15 rounded-full blur-lg animate-drift-delayed"></div>
        <div className="absolute bottom-1/3 left-1/2 w-10 h-10 bg-primary-600/15 rounded-full blur-lg animate-drift-slow"></div>
      </div>
      
      {/* Hero Content */}
      <div className="container mx-auto px-4 md:px-6 z-20 relative">
        <div className="text-center text-white animate-slide-up-enhanced">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 leading-tight animate-text-glow">
            Discover Amazing <span className="text-primary-400 drop-shadow-lg animate-text-pulse">Tech Events</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto drop-shadow-sm animate-fade-in-up">
            Find and join the most innovative tech events, from conferences and workshops to hackathons and meetups.
          </p>
        </div>
      </div>
    </section>
  );
};

const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Backend URL - replace with your actual backend endpoint
  const BACKEND_URL = `http://localhost:8080/api/events`;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "EventFesta - Browse Events";
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(BACKEND_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setEvents(data);
      setFilteredEvents(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Color mapping for event types
 const getEventTypeColor = (type) => {
  // Guard clause for null/undefined types, now returning your preferred default
  if (!type) {
    return 'bg-primary-500';
  }

  // Your exact color mapping
  const colorMap = {
    'workshop': 'bg-blue-500',
    'seminar': 'bg-green-500',
    'conference': 'bg-purple-500',
    'hackathon': 'bg-red-500',
    'meetup': 'bg-orange-500',
    'webinar': 'bg-indigo-500',
    'bootcamp': 'bg-pink-500',
    'networking': 'bg-teal-500',
    'training': 'bg-yellow-500',
    'symposium': 'bg-cyan-500',
    'summit': 'bg-violet-500',
    'expo': 'bg-emerald-500',
    'forum': 'bg-rose-500',
    'roundtable': 'bg-amber-500',
    'panel': 'bg-lime-500',
    'masterclass': 'bg-slate-500',
    'competition': 'bg-fuchsia-500',
    'startup': 'bg-sky-500',
    'demo': 'bg-stone-500',
    'pitch': 'bg-zinc-500'
  };

  const normalizedType = type.toLowerCase();

  // Look up the color or return the primary color as a default
  return colorMap[normalizedType] || 'bg-primary-500';
};

  const types = [...new Set(events.map(event => event.type))];

  useEffect(() => {
    filterEvents();
    
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedType) params.set('type', selectedType);
    setSearchParams(params);
  }, [searchTerm, selectedType, events]);

  const filterEvents = () => {
    let filtered = [...events];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(term) || 
        event.description.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term)
      );
    }
    
    if (selectedType) {
      filtered = filtered.filter(event => 
        event.type.toLowerCase() === selectedType.toLowerCase()
      );
    }
    
    setFilteredEvents(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="pt-20 pb-16 bg-gray-50 dark:bg-navy-900 min-h-screen transition-colors duration-300">
        <HeroSection />
        <div className="container mx-auto px-4 md:px-6 -mt-16 relative z-10">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            <span className="ml-4 text-lg text-gray-600 dark:text-gray-300">Loading events...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 pb-16 bg-gray-50 dark:bg-navy-900 min-h-screen transition-colors duration-300">
        <HeroSection />
        <div className="container mx-auto px-4 md:px-6 -mt-16 relative z-10">
          <div className="text-center py-16 bg-white dark:bg-navy-800 rounded-xl shadow-sm dark:shadow-dark">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">Error Loading Events</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <button
              onClick={fetchEvents}
              className="px-6 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 bg-gray-50 dark:bg-navy-900 min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <HeroSection />
      
      <div className="container mx-auto px-4 md:px-6 -mt-16 relative z-10">
        
        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-navy-800 rounded-xl shadow-lg dark:shadow-dark p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for events, locations, or keywords..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-navy-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors bg-white dark:bg-navy-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden flex items-center justify-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
            
            <div className="hidden md:flex gap-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-navy-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors bg-white dark:bg-navy-700 text-gray-900 dark:text-white"
              >
                <option value="">All Types</option>
                {types.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
              
              {(searchTerm || selectedType) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center px-4 py-2 bg-gray-100 dark:bg-navy-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-navy-500 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>
          
          {isFilterOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-navy-600 animate-fade-in">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-4 py-2 w-full border border-gray-300 dark:border-navy-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors bg-white dark:bg-navy-700 text-gray-900 dark:text-white"
                  >
                    <option value="">All Types</option>
                    {types.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                {(searchTerm || selectedType) && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center px-4 py-2 w-full justify-center bg-gray-100 dark:bg-navy-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-navy-500 transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Filter Status Bar */}
        {(searchTerm || selectedType) && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600 dark:text-gray-300">
              Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
              {selectedType && <span> of type <span className="font-medium">{selectedType}</span></span>}
              {searchTerm && <span> matching <span className="font-medium">"{searchTerm}"</span></span>}
            </p>
          </div>
        )}
        
        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white dark:bg-navy-800 rounded-xl shadow-md dark:shadow-dark overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={event.imageUrl} 
                    alt={event.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute top-4 right-4 ${getEventTypeColor(event.type)} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                    {event.type}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors mb-4">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Calendar className="h-4 w-4 mr-2 text-primary-500" />
                      <span className="text-sm">
                        {event.eventDate 
                          ? new Date(event.eventDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          : 'Date TBD'
                        }
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <MapPin className="h-4 w-4 mr-2 text-primary-500" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Users className="h-4 w-4 mr-2 text-primary-500" />
                      <span className="text-sm">{event.currentParticipants} / {event.maxParticipants} participants</span>
                    </div>
                    {event.organizer && (
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Building className="h-4 w-4 mr-2 text-primary-500" />
                        <span className="text-sm">
                          {typeof event.organizer === 'object' && event.organizer.name 
                            ? event.organizer.name 
                            : typeof event.organizer === 'string' 
                            ? event.organizer 
                            : 'Organization'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                        <Tag className="h-4 w-4 mr-2 text-primary-500" />
                        <span className="text-sm font-medium">Tags:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Link 
                    to={`/events/${event.id}`} 
                    className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                  >
                    View Details <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-navy-800 rounded-xl shadow-sm dark:shadow-dark mt-8">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">No Events Found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We couldn't find any events matching your search criteria.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;