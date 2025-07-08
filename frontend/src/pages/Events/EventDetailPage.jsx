import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, Users, Tag, Globe,
  ArrowLeft, Share2, ChevronDown, ChevronUp
} from 'lucide-react';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');

  // Fetch event data from API
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:8080/api/events/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Event not found');
          } else {
            setError('Failed to fetch event details');
          }
          return;
        }
        
        const eventData = await response.json();
        
        // Transform the data to match component expectations
        const transformedEvent = {
          ...eventData,
          id: eventData._id,
          date: eventData.eventDate,
          image: eventData.imageUrl,
          schedule:eventData.schedule,
          price: eventData.registrationFees === 0 ? 'Free' : `₹${eventData.registrationFees}`,
          // Transform prizes object to array format
          prizes: eventData.prizes ? [
            `1st Place: ${eventData.prizes.first}`,
            `2nd Place: ${eventData.prizes.second}`,
            `3rd Place: ${eventData.prizes.third}`
          ] : []
        };
        
        setEvent(transformedEvent);
        
        // Update document title
        document.title = `${transformedEvent.title} - TechEvents`;
        
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this tech event: ${event.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="pt-20 pb-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 py-16 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto mb-8"></div>
            <div className="h-64 bg-gray-300 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <div className="pt-20 pb-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            {error === 'Event not found' ? 'Event Not Found' : 'Error Loading Event'}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {error === 'Event not found' 
              ? "We couldn't find the event you're looking for."
              : "There was an error loading the event details. Please try again."
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg inline-flex items-center justify-center"
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> Go Back
            </button>
            <Link 
              to="/events" 
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg inline-flex items-center justify-center"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600 flex items-center space-x-2">
          <Link to="/" className="hover:text-primary-500">Home</Link>
          <span>/</span>
          <Link to="/events" className="hover:text-primary-500">Events</Link>
          <span>/</span>
          <span className="text-primary-500">{event.title}</span>
        </div>

        {/* Event Banner */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">{event.type}</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-display font-bold mb-2 drop-shadow-md">{event.title}</h1>
              <p className="text-lg text-white/90">{event.location}</p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap justify-between items-center p-4 md:p-6">
              <div className="flex items-center space-x-6">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-primary-500">
                  <ArrowLeft className="h-5 w-5 mr-1" /> <span className="hidden sm:inline">Back</span>
                </button>
                <button onClick={handleShare} className="flex items-center text-gray-600 hover:text-primary-500">
                  <Share2 className="h-5 w-5 mr-1" /> <span className="hidden sm:inline">Share</span>
                </button>
              </div>
              <Link to="#register" className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg">
                Register Now
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md mb-8">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  {['overview', 'schedule', 'speakers'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setSelectedTab(tab)}
                      className={`py-4 px-6 text-sm font-medium border-b-2 ${
                        selectedTab === tab
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6 md:p-8">
                {selectedTab === 'overview' && (
                  <>
                    <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">About This Event</h2>
                    <div className="prose prose-lg max-w-none text-gray-700 mb-6">
                      <p className={showFullDescription ? '' : 'line-clamp-4'}>
                        {event.description}
                      </p>
                      {event.description && event.description.length > 200 && (
                        <button
                          onClick={() => setShowFullDescription(!showFullDescription)}
                          className="flex items-center text-primary-600 font-medium mt-2"
                        >
                          {showFullDescription ? <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></> : <>Read More <ChevronDown className="ml-1 h-4 w-4" /></>}
                        </button>
                      )}
                    </div>

                    {event.tags && event.tags.length > 0 && (
                      <>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Event Topics</h3>
                        <div className="flex flex-wrap gap-2 mb-8">
                          {event.tags.map((tag, idx) => (
                            <span key={idx} className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">{tag}</span>
                          ))}
                        </div>
                      </>
                    )}

                    {event.prizes && event.prizes.length > 0 && (
                      <>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Prizes</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                          {event.prizes.map((prize, idx) => (
                            <div key={idx} className="bg-primary-50 rounded-lg p-4 text-primary-700 font-medium">{prize}</div>
                          ))}
                        </div>
                      </>
                    )}

                    {event.judges && event.judges.length > 0 && (
                      <>
                        <h3 className="text-2xl font-display font-bold text-gray-900 mb-6">Judges</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {event.judges.map((judge, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-xl p-6">
                              <h4 className="font-bold text-xl text-gray-900">{judge.name}</h4>
                              <p className="text-gray-500">{judge.company}</p>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}

                {selectedTab === 'schedule' && (
                  <>
                    <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Event Schedule</h2>
                    {event.schedule && event.schedule.length > 0 ? (
                      <div className="space-y-6">
                        {event.schedule.map((session, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-6">
                            <div className="flex flex-col md:flex-row md:justify-between mb-2">
                              <h3 className="text-lg font-bold">{session.title}</h3>
                              <span className="text-primary-600 font-medium">{session.time}</span>
                            </div>
                            <p className="text-gray-600">Speaker: {session.speaker}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-center py-8">Schedule will be updated soon.</p>
                    )}
                  </>
                )}

                {selectedTab === 'speakers' && (
                  <>
                    <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Event Speakers</h2>
                    {event.speakers && event.speakers.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {event.speakers.map((speaker, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-xl p-6">
                            <h3 className="font-bold text-xl text-gray-900">{speaker.name}</h3>
                            <p className="text-gray-500">{speaker.company}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-center py-8">Speakers will be announced soon.</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Event Details</h2>
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-3 text-primary-500 mt-0.5" />
                  <div>
                    <span className="block font-medium text-gray-900">Date</span>
                    <span className="text-gray-600">
                    {new Date(event.date).toLocaleDateString('en-GB').replace(/\//g, '/')}
                    </span>

                  </div>
                </div>

                {/* <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-3 text-primary-500 mt-0.5" />
                  <div>
                    <span className="block font-medium text-gray-900">Time</span>
                    <span className="text-gray-600">{event.time ? new Date(event.time).toLocaleTimeString() : 'TBA'}</span>
                  </div>
                </div> */}

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-primary-500 mt-0.5" />
                  <div>
                    <span className="block font-medium text-gray-900">Location</span>
                    <span className="text-gray-600">{event.location}</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <Users className="h-5 w-5 mr-3 text-primary-500 mt-0.5" />
                  <div>
                    <span className="block font-medium text-gray-900">Participants</span>
                    <span className="text-gray-600">
                      {event.currentParticipants || 0} / {event.maxParticipants || 'Unlimited'} registered
                    </span>
                  </div>
                </div>

                {event.lastRegistertDate && (
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-3 text-primary-500 mt-0.5" />
                    <div>
                      <span className="block font-medium text-gray-900">Registration Deadline</span>
                      <span className="text-red-600">
                      {new Date(event.lastRegistertDate).toLocaleDateString('en-GB').replace(/\//g, '/')}
                    </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Registration Fee</h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Entry Fee</span>
                  <span className="font-medium text-gray-900">{event.price}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6" id="register">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Join?</h3>
                <p className="text-gray-600 mb-6">Secure your spot at this event. Limited seats available!</p>
                <Link 
                  to={`/events/${event.id}/register`}
                  className="block w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors text-center"
                >
                  Register Now
                </Link>
                <p className="text-center text-sm text-gray-500 mt-4">
                  Already have an account? <Link to="/login?role=participant" className="text-primary-600 hover:text-primary-700">Sign in</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;