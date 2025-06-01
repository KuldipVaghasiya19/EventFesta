import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Tag, ChevronRight, Plus, BarChart, X, Mail, Globe, Building, Edit } from 'lucide-react';
import { events } from '../data/events';

const ParticipantList = ({ participants, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Event Participants</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {participants.map((participant, index) => (
            <div key={index} className="flex items-center py-4 border-b border-gray-200 last:border-0">
              <img
                src={participant.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name)}`}
                alt={participant.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="ml-4">
                <h4 className="font-medium text-gray-900">{participant.name}</h4>
                <p className="text-sm text-gray-600">{participant.email}</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {participant.interests.map((interest, i) => (
                    <span
                      key={i}
                      className="text-xs bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm text-gray-600">{participant.university}</p>
                <p className="text-xs text-gray-500">{participant.course}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const OrganizationDashboard = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [activeEvents, setActiveEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const navigate = useNavigate();

  // Mock organization data - In a real app, this would come from your backend
  const organization = {
    name: "TechConf Solutions",
    logo: "https://images.pexels.com/photos/2977547/pexels-photo-2977547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    email: "contact@techconf.com",
    website: "www.techconf.com",
    location: "San Francisco, CA",
    type: "Event Management & Technology",
    founded: "2020",
    about: "Leading provider of technology conferences and events. We specialize in creating immersive experiences that bring together industry experts, innovators, and enthusiasts.",
    socialLinks: {
      linkedin: "https://linkedin.com/company/techconf",
      twitter: "https://twitter.com/techconf"
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // Simulate fetching organization's events
    setActiveEvents(events);
    setPastEvents(events);
  }, []);

  const handleShowParticipants = (event) => {
    setSelectedEvent(event);
    setShowParticipants(true);
  };

  const renderEventCard = (event) => (
    <div key={event.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-64 h-48 md:h-auto relative">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            {event.type}
          </div>
        </div>
        <div className="p-6 flex-grow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
            <span className="text-sm text-primary-600 font-medium">
              {new Date(event.date).toLocaleDateString()}
            </span>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-primary-500" />
              <span className="text-sm">{event.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-2 text-primary-500" />
              <span className="text-sm">{event.currentParticipants} / {event.maxParticipants} participants</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-primary-50 text-primary-600 text-xs font-medium px-2.5 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Link 
                to={`/events/${event.id}`}
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
              >
                View Details <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
              <Link 
                to={`/events/${event.id}/analytics`}
                className="text-gray-600 hover:text-gray-700 font-medium flex items-center"
              >
                Analytics <BarChart className="h-4 w-4 ml-1" />
              </Link>
              <button
                onClick={() => handleShowParticipants(event)}
                className="text-gray-600 hover:text-gray-700 font-medium flex items-center"
              >
                <Users className="h-4 w-4 mr-1" /> Participants
              </button>
            </div>
            <div className="text-sm text-gray-500">
              {event.schedule.length} sessions
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-20 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Organization Profile */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="md:flex">
            {/* Profile Info */}
            <div className="md:w-1/3 bg-primary-600 p-8 text-white">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img 
                    src={organization.logo} 
                    alt={organization.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white"
                  />
                  <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full text-primary-600 hover:text-primary-700 transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
                <h2 className="text-2xl font-bold mt-4">{organization.name}</h2>
                <p className="text-primary-200">{organization.type}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-primary-300" />
                  <span>{organization.email}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-5 w-5 mr-3 text-primary-300" />
                  <span>{organization.website}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-primary-300" />
                  <span>{organization.location}</span>
                </div>
                <div className="flex items-center">
                  <Building className="h-5 w-5 mr-3 text-primary-300" />
                  <span>Founded {organization.founded}</span>
                </div>
              </div>
            </div>
            
            {/* About & Stats */}
            <div className="md:w-2/3 p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">About</h3>
                <p className="text-gray-600">{organization.about}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Calendar className="h-6 w-6 text-primary-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {activeEvents.length}
                  </div>
                  <div className="text-gray-600">Active Events</div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Users className="h-6 w-6 text-primary-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {events[0].currentParticipants}
                  </div>
                  <div className="text-gray-600">Total Participants</div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Clock className="h-6 w-6 text-primary-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {pastEvents.length}
                  </div>
                  <div className="text-gray-600">Past Events</div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Tag className="h-6 w-6 text-primary-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {events[0].tags.length}
                  </div>
                  <div className="text-gray-600">Event Categories</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Management</h1>
            <p className="text-gray-600">Manage your events and track their performance</p>
          </div>
          <Link
            to="/events/create"
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Event
          </Link>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('active')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'active'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Active Events
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'past'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Past Events
              </button>
            </nav>
          </div>
        </div>

        {/* Event List */}
        <div className="space-y-6">
          {activeTab === 'active' ? (
            activeEvents.length > 0 ? (
              activeEvents.map(event => renderEventCard(event))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-600">No active events found</p>
                <Link
                  to="/events/create"
                  className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700"
                >
                  Create your first event <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            )
          ) : (
            pastEvents.length > 0 ? (
              pastEvents.map(event => renderEventCard(event))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-600">No past events found</p>
              </div>
            )
          )}
        </div>

        {/* Participant List Modal */}
        {showParticipants && selectedEvent && (
          <ParticipantList
            participants={selectedEvent.participants}
            onClose={() => {
              setShowParticipants(false);
              setSelectedEvent(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default OrganizationDashboard;