import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [featuredOnly, setFeaturedOnly] = useState(searchParams.get('featured') === 'true');
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
      
      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setEvents(data.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate)));
      // setFilteredEvents is now handled by the filtering useEffect
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
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

    if (now > eventDate) {
      return false;
    }
    if (registrationDeadline && now > registrationDeadline) {
      return false;
    }
    if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
      return false;
    }
    
    return true;
  };

  const getEventTypeColor = (type) => {
    if (!type) {
      return 'bg-primary-500';
    }

    const colorMap = {
      'workshop': 'bg-blue-500', 'seminar': 'bg-green-500', 'conference': 'bg-purple-500',
      'hackathon': 'bg-red-500', 'meetup': 'bg-orange-500', 'webinar': 'bg-indigo-500',
      'bootcamp': 'bg-pink-500', 'networking': 'bg-teal-500', 'training': 'bg-yellow-500',
      'symposium': 'bg-cyan-500', 'summit': 'bg-violet-500', 'expo': 'bg-emerald-500',
      'forum': 'bg-rose-500', 'roundtable': 'bg-amber-500', 'panel': 'bg-lime-500',
      'masterclass': 'bg-slate-500', 'competition': 'bg-fuchsia-500', 'startup': 'bg-sky-500',
      'demo': 'bg-stone-500', 'pitch': 'bg-zinc-500'
    };

    const normalizedType = type.toLowerCase();
    return colorMap[normalizedType] || 'bg-primary-500';
  };

  // ✅ FIX: Create a case-insensitive, unique, capitalized, and sorted list of types.
  // This is robust against missing 'type' properties and prevents ReferenceError.
  const types = [...new Set(events.map(event => (event.type || '').toLowerCase()))]
    .filter(type => type) // Filter out any empty strings
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

  if (loading) {
    // Your original, detailed skeleton loader is preserved
    return <LoadingSkeleton />;
  }

  if (error) {
    // Your original error display is preserved
    return (
      <div className="pt-20 pb-16 bg-gray-50 dark:bg-navy-900 min-h-screen transition-colors duration-300">
        <HeroSection />
        <div className="container mx-auto px-4 md:px-6 -mt-16 relative z-10">
          <ErrorState error={error} onRetry={fetchEvents} />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 bg-gray-50 dark:bg-navy-900 min-h-screen transition-colors duration-300">
      <HeroSection />
      
      <div className="container mx-auto px-4 md:px-6 -mt-16 relative z-10">
        
        {/* Search and Filter Bar */}
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
        
        {/* Filter Status Bar */}
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
        
        {/* Events Grid */}
        <EventGrid events={filteredEvents} clearFilters={clearFilters} />
      </div>
    </div>
  );
};

export default EventsPage;