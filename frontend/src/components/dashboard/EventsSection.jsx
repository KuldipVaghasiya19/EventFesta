import { useState } from 'react';
import { Calendar, Clock, Archive, Eye, Download, Users, MapPin, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, count, subtitle, icon: Icon, color }) => {
  const colorClasses = {
    purple: 'border-l-purple-500 bg-purple-50',
    blue: 'border-l-blue-500 bg-blue-50', 
    green: 'border-l-green-500 bg-green-50'
  };

  const iconColors = {
    purple: 'text-purple-500 bg-purple-100',
    blue: 'text-blue-500 bg-blue-100',
    green: 'text-green-500 bg-green-100'
  };

  return (
    <div className={`p-6 rounded-xl border-l-4 ${colorClasses[color]} flex items-center gap-4`}>
      <div className={`p-3 rounded-full ${iconColors[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900">{count}</h3>
        <p className="font-medium text-gray-700">{title}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
};

const EmptyState = ({ userType, activeTab }) => {
  const getEmptyStateContent = () => {
    if (userType === 'organization') {
      return {
        icon: <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />,
        title: "No events found",
        subtitle: "You don't have any events yet.",
        buttonText: "Create New Event",
        buttonLink: "/events/create",
        buttonIcon: <Plus className="h-5 w-5 mr-2" />,
        buttonColor: "bg-green-500 hover:bg-green-600"
      };
    } else {
      return {
        icon: <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />,
        title: "No events found",
        subtitle: "You haven't registered for any events yet.",
        buttonText: "Browse Events",
        buttonLink: "/events",
        buttonIcon: <Search className="h-5 w-5 mr-2" />,
        buttonColor: "bg-primary-500 hover:bg-primary-600"
      };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className="text-center py-16">
      {content.icon}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{content.title}</h3>
      <p className="text-gray-600 mb-6">{content.subtitle}</p>
      <Link 
        to={content.buttonLink}
        className={`inline-flex items-center px-6 py-3 ${content.buttonColor} text-white font-medium rounded-lg transition-colors`}
      >
        {content.buttonIcon}
        {content.buttonText}
      </Link>
    </div>
  );
};

const EventsSection = ({ events, userType = "participant" }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date());
  const registeredEvents = events;
  const pastEvents = events.filter(event => new Date(event.date) < new Date());

  const getEventsForTab = () => {
    switch (activeTab) {
      case 'upcoming':
        return upcomingEvents;
      case 'registered':
        return registeredEvents;
      case 'past':
        return pastEvents;
      default:
        return [];
    }
  };

  const tabs = [
    { id: 'upcoming', label: 'Upcoming Events', count: upcomingEvents.length, icon: Clock },
    { id: 'registered', label: 'Registered Events', count: registeredEvents.length, icon: Calendar },
    { id: 'past', label: 'Past Events', count: pastEvents.length, icon: Archive }
  ];

  return (
    <div className="bg-white">
      {/* Stats Cards */}
      <div className="p-8 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Total Events" 
            count="3" 
            subtitle="All registered events"
            icon={Calendar}
            color="purple"
          />
          <StatCard 
            title="Upcoming Events" 
            count="1" 
            subtitle="Events you'll attend"
            icon={Clock}
            color="blue"
          />
          <StatCard 
            title="Past Events" 
            count="2" 
            subtitle="Events you attended"
            icon={Archive}
            color="green"
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 px-8">
        <nav className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-4 text-sm font-medium border-b-2 mr-6 transition-colors ${
                  activeTab === tab.id
                    ? userType === 'participant'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Events Table */}
      <div className="p-8">
        <div className="overflow-hidden">
          {getEventsForTab().length > 0 ? (
            <>
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 py-3 px-4 bg-gray-50 rounded-t-lg text-sm font-medium text-gray-500 uppercase tracking-wider">
                <div className="col-span-4">Event</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-3">Location</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-1">Actions</div>
              </div>

              {/* Table Body */}
              <div className="bg-white border border-gray-200 rounded-b-lg">
                {getEventsForTab().map((event, index) => (
                  <div 
                    key={event.id} 
                    className={`grid grid-cols-12 gap-4 py-4 px-4 items-center hover:bg-gray-50 transition-colors ${
                      index !== getEventsForTab().length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="col-span-4 flex items-center gap-3">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Users className="h-3 w-3" />
                          <span>{event.currentParticipants} participants</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    
                    <div className="col-span-3 text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    
                    <div className="col-span-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {event.type}
                      </span>
                    </div>
                    
                    <div className="col-span-1 flex gap-2">
                      <Link 
                        to={`/events/${event.id}`}
                        className="text-blue-600 hover:text-blue-700"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      {userType === 'organization' && (
                        <button
                          onClick={() => {
                            // Mock PDF download
                            const link = document.createElement('a');
                            link.href = '#';
                            link.download = `${event.title}-participants.pdf`;
                            link.click();
                          }}
                          className="text-green-600 hover:text-green-700"
                          title="Download Participants PDF"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState userType={userType} activeTab={activeTab} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsSection;