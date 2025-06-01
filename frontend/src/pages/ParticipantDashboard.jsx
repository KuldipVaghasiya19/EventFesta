import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Tag, ChevronRight, Plus, X, Mail, Briefcase, GraduationCap, Edit } from 'lucide-react';
import { events } from '../data/events';

const ParticipantDashboard = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [participatedEvents, setParticipatedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [tags, setTags] = useState(['React', 'JavaScript', 'Web Development']);
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  // Mock user data - In a real app, this would come from your backend
  const user = {
    name: "Sarah Johnson",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    email: "sarah.johnson@example.com",
    university: "Stanford University",
    course: "Computer Science",
    year: "Final Year",
    about: "Passionate about web development and artificial intelligence. Always eager to learn new technologies and participate in tech events.",
    linkedin: "https://linkedin.com/in/sarahjohnson",
    github: "https://github.com/sarahjohnson"
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // Simulate fetching participated events
    setParticipatedEvents(events);
    setUpcomingEvents(events);
  }, []);

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
      setShowTagInput(false);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
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
            <Link 
              to={`/events/${event.id}`}
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              View Details <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
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
        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="md:flex">
            {/* Profile Info */}
            <div className="md:w-1/3 bg-primary-600 p-8 text-white">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white"
                  />
                  <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full text-primary-600 hover:text-primary-700 transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
                <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
                <p className="text-primary-200">{user.course} Student</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-primary-300" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-3 text-primary-300" />
                  <span>{user.university}</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-3 text-primary-300" />
                  <span>{user.year}</span>
                </div>
              </div>
            </div>
            
            {/* About & Stats */}
            <div className="md:w-2/3 p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">About</h3>
                <p className="text-gray-600">{user.about}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Calendar className="h-6 w-6 text-primary-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {participatedEvents.length}
                  </div>
                  <div className="text-gray-600">Events Participated</div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Clock className="h-6 w-6 text-primary-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {upcomingEvents.length}
                  </div>
                  <div className="text-gray-600">Upcoming Events</div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Tag className="h-6 w-6 text-primary-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {tags.length}
                  </div>
                  <div className="text-gray-600">Interest Tags</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interest Tags Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Your Interests</h2>
            <button
              onClick={() => setShowTagInput(true)}
              className="text-primary-600 hover:text-primary-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Tag
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <div 
                key={index}
                className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full flex items-center"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 hover:text-primary-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            {showTagInput && (
              <form onSubmit={handleAddTag} className="flex items-center">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Enter tag..."
                  className="px-3 py-1 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="ml-2 text-primary-600 hover:text-primary-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTagInput(false);
                    setNewTag('');
                  }}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'upcoming'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Upcoming Events
              </button>
              <button
                onClick={() => setActiveTab('participated')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'participated'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Participated Events
              </button>
            </nav>
          </div>
        </div>

        {/* Event List */}
        <div className="space-y-6">
          {activeTab === 'upcoming' ? (
            upcomingEvents.length > 0 ? (
              upcomingEvents.map(event => renderEventCard(event))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-600">No upcoming events found</p>
              </div>
            )
          ) : (
            participatedEvents.length > 0 ? (
              participatedEvents.map(event => renderEventCard(event))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-600">No participated events found</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantDashboard;