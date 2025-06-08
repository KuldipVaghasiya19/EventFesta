import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, Users, Tag, Globe,
  ArrowLeft, Share2, Heart, ChevronDown, ChevronUp
} from 'lucide-react';
import { events } from '../data/events';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = events.find(e => e.id === id);

  const [isLiked, setIsLiked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = event ? `${event.title} - TechEvents` : "Event Not Found - TechEvents";
  }, [event]);

  if (!event) {
    return (
      <div className="pt-20 pb-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Event Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            We couldn't find the event you're looking for.
          </p>
          <Link to="/events" className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg">
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Events
          </Link>
        </div>
      </div>
    );
  }

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

  const toggleLike = () => setIsLiked(!isLiked);

  return (
    <div className="pt-20 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
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
                <button onClick={toggleLike} className={`flex items-center ${isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}>
                  <Heart className={`h-5 w-5 mr-1 ${isLiked ? 'fill-current' : ''}`} /> 
                  <span className="hidden sm:inline">{isLiked ? 'Saved' : 'Save'}</span>
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
                      {event.description.length > 200 && (
                        <button
                          onClick={() => setShowFullDescription(!showFullDescription)}
                          className="flex items-center text-primary-600 font-medium mt-2"
                        >
                          {showFullDescription ? <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></> : <>Read More <ChevronDown className="ml-1 h-4 w-4" /></>}
                        </button>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-4">Event Topics</h3>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {event.tags.map((tag, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">{tag}</span>
                      ))}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-4">Prizes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      {event.prizes.map((prize, idx) => (
                        <div key={idx} className="bg-primary-50 rounded-lg p-4 text-primary-700 font-medium">{prize}</div>
                      ))}
                    </div>

                    {event.judges && event.judges.length > 0 && (
                      <>
                        <h3 className="text-2xl font-display font-bold text-gray-900 mb-6">Judges</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {event.judges.map((judge, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-xl p-6">
                              <h4 className="font-bold text-xl text-gray-900">{judge.name}</h4>
                              <p className="text-primary-600">{judge.role}</p>
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
                  </>
                )}

                {selectedTab === 'speakers' && event.speakers && event.speakers.length > 0 && (
                  <>
                    <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Event Speakers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {event.speakers.map((speaker, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-xl p-6">
                          <h3 className="font-bold text-xl text-gray-900">{speaker.name}</h3>
                          <p className="text-primary-600">{speaker.role}</p>
                          <p className="text-gray-500">{speaker.company}</p>
                        </div>
                      ))}
                    </div>
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
                    <span className="text-gray-600">{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                </div>

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
                    <span className="text-gray-600">{event.currentParticipants} / {event.maxParticipants} registered</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Ticket Price</h3>
                {event.prices.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Entry</span>
                    <span className="font-medium text-gray-900">{event.prices[0].split('-')[1].trim()}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6" id="register">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Join?</h3>
                <p className="text-gray-600 mb-6">Secure your spot at this event. Limited seats available!</p>
                <Link to="/signup?role=participant" className="block w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg text-center">
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
