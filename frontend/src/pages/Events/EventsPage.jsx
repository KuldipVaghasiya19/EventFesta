import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import HeroSection from '../../components/EventsPage/HeroSection';
import FilterBar from '../../components/EventsPage/FilterBar';
import EventGrid from '../../components/EventsPage/EventGrid';
import LoadingSkeleton from '../../components/EventsPage/LoadingSkeleton';
import ErrorState from '../../components/EventsPage/ErrorState';

const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [featuredOnly, setFeaturedOnly] = useState(searchParams.get('featured') === 'true');

  // --- NEW: Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6; // You can change this to 9 or 12

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
      
      const responseData = await response.json();
      const eventsArray = responseData.success !== undefined ? responseData.data : responseData;
      
      if (Array.isArray(eventsArray)) {
        setEvents(eventsArray.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate)));
      } else {
        setEvents([]);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const isRegistrationOpen = (event) => {
    if (!event) return false;
    const now = new Date();
    const eventDate = new Date(event.eventDate);
    const registrationDeadline = event.lastRegistertDate ? new Date(event.lastRegistertDate) : null;

    if (now > eventDate) return false;
    if (registrationDeadline && now > registrationDeadline) return false;
    if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) return false;
    
    return true;
  };

  const types = [...new Set(events.map(event => (event.type || '').toLowerCase()))]
    .filter(type => type) 
    .map(type => type.charAt(0).toUpperCase() + type.slice(1))
    .sort();

  useEffect(() => {
    let filtered = [...events];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(event => 
        (event.title && event.title.toLowerCase().includes(term)) || 
        (event.description && event.description.toLowerCase().includes(term)) ||
        (event.location && event.location.toLowerCase().includes(term))
      );
    }
    if (selectedType) {
      filtered = filtered.filter(event => 
        event.type && event.type.toLowerCase() === selectedType.toLowerCase()
      );
    }
    if (featuredOnly) {
      filtered = filtered.filter(event => isRegistrationOpen(event));
    }
    
    setFilteredEvents(filtered);
    
    // --- FIX: Reset to page 1 whenever filters change ---
    setCurrentPage(1);

    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedType) params.set('type', selectedType);
    if (featuredOnly) params.set('featured', 'true');
    setSearchParams(params, { replace: true });
  }, [searchTerm, selectedType, featuredOnly, events, setSearchParams]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setFeaturedOnly(false);
  };

  // --- NEW: Pagination Calculation Logic ---
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Smooth scroll back to top of the grid when changing pages
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="pt-20 pb-16 bg-gray-50 dark:bg-navy-900 min-h-screen transition-colors duration-300">
      <HeroSection />
      
      <div className="container mx-auto px-4 md:px-6 -mt-16 relative z-10">
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorState error={error} onRetry={fetchEvents} />
        ) : (
          <>
            <FilterBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              featuredOnly={featuredOnly}
              setFeaturedOnly={setFeaturedOnly}
              types={types}
              clearFilters={clearFilters}
            />
            
            {(searchTerm || selectedType || featuredOnly) && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600 dark:text-gray-300">
                  Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
                  {featuredOnly && <span> (Featured)</span>}
                  {selectedType && <span> of type <span className="font-medium">{selectedType}</span></span>}
                  {searchTerm && <span> matching <span className="font-medium">"{searchTerm}"</span></span>}
                </p>
              </div>
            )}
            
            {/* Pass only the CURRENT PAGE'S events to the grid */}
            <EventGrid events={currentEvents} clearFilters={clearFilters} />

            {/* --- NEW: Professional Pagination Controls --- */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 mb-8">
                <div className="flex items-center gap-2 bg-white dark:bg-navy-800 p-2 rounded-2xl shadow-md border border-gray-100 dark:border-navy-700">
                  
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-navy-700 disabled:opacity-50 disabled:hover:bg-transparent transition-all"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-1 px-2">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      const isActive = currentPage === pageNum;
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => paginate(pageNum)}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 ${
                            isActive 
                              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-navy-700 disabled:opacity-50 disabled:hover:bg-transparent transition-all"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  
                </div>
              </div>
            )}

          </>
        )}
      </div>
    </div>
  );
};

export default EventsPage;