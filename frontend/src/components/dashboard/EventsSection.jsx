import { useState, useMemo } from 'react';
import { Calendar, Clock, Archive, Eye, Users, MapPin, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// StatCard and EmptyState components remain the same...
// (Assuming StatCard and EmptyState components are defined above as in your original file)
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
  
  const EmptyState = ({ userType }) => {
    const content = userType === 'organization' ? {
      icon: <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />,
      title: "No events found",
      subtitle: "You haven't organized any events yet.",
      buttonText: "Create New Event",
      buttonLink: "/events/create",
      buttonIcon: <Plus className="h-5 w-5 mr-2" />,
      buttonColor: "bg-green-500 hover:bg-green-600"
    } : {
      icon: <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />,
      title: "No events found",
      subtitle: "You haven't registered for any events yet.",
      buttonText: "Browse Events",
      buttonLink: "/events",
      buttonIcon: <Search className="h-5 w-5 mr-2" />,
      buttonColor: "bg-primary-500 hover:bg-primary-600"
    };
  
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
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5; // You can adjust this number

  // Memoize event filtering to avoid recalculation on every render
  const { upcomingEvents, pastEvents, allEvents } = useMemo(() => {
    const currentDate = new Date();
    return {
        upcomingEvents: events.filter(event => new Date(event.eventDate) >= currentDate),
        pastEvents: events.filter(event => new Date(event.eventDate) < currentDate),
        allEvents: events
    };
  }, [events]);

  const stats = {
    totalEvents: allEvents.length,
    upcomingCount: upcomingEvents.length,
    pastCount: pastEvents.length
  };
  
  const tabs = userType === 'organization' ? [
    { id: 'all', label: 'All Organized Events', count: allEvents.length, icon: Calendar },
    { id: 'upcoming', label: 'Upcoming Events', count: upcomingEvents.length, icon: Clock },
    { id: 'past', label: 'Past Events', count: pastEvents.length, icon: Archive }
  ] : [
    { id: 'all', label: 'All Registered Events', count: allEvents.length, icon: Calendar },
    { id: 'upcoming', label: 'Upcoming Events', count: upcomingEvents.length, icon: Clock },
    { id: 'past', label: 'Past Events', count: pastEvents.length, icon: Archive }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1); // Reset to first page when tab changes
  };
  
  const getEventsForTab = () => {
    switch (activeTab) {
      case 'upcoming': return upcomingEvents;
      case 'past': return pastEvents;
      default: return allEvents;
    }
  };

  const currentEvents = getEventsForTab();

  // --- Pagination Logic ---
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const eventsToDisplay = currentEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(currentEvents.length / eventsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm">
      {/* Stats Cards - No changes here */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard
            title={userType === 'organization' ? "Total Organized" : "Total Registered"}
            count={stats.totalEvents}
            subtitle={userType === 'organization' ? 'Events you created' : 'Events you joined'}
            icon={Calendar}
            color="purple"
          />
          <StatCard
            title="Upcoming Events"
            count={stats.upcomingCount}
            subtitle={userType === 'organization' ? 'Events yet to be hosted' : 'Events you can attend'}
            icon={Clock}
            color="blue"
          />
          <StatCard
            title="Past Events"
            count={stats.pastCount}
            subtitle={userType === 'organization' ? 'Events you hosted' : 'Events you attended'}
            icon={Archive}
            color="green"
          />
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 text-sm font-medium border-b-2 mr-8 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Events Table Display Area */}
      <div className="pt-6">
        {eventsToDisplay.length > 0 ? (
          <>
            <div className="border border-gray-200 rounded-lg">
              <div className="grid grid-cols-12 gap-4 py-3 px-4 bg-gray-50 rounded-t-lg text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <div className="col-span-4">Event</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-3">Location</div>
                  <div className="col-span-2">Type</div>
                  <div className="col-span-1 text-right">Actions</div>
              </div>
              {eventsToDisplay.map((event, index) => (
                <div
                  key={event.id}
                  className={`grid grid-cols-12 gap-4 py-4 px-4 items-center hover:bg-gray-50 transition-colors ${
                    index !== eventsToDisplay.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                    <div className="col-span-4 flex items-center gap-3">
                        <img src={event.imageUrl} alt={event.title} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                            <h3 className="font-medium text-gray-900">{event.title}</h3>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Users className="h-3 w-3" />
                                <span>{event.currentParticipants} participants</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 text-sm text-gray-600">
                        {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                    <div className="col-span-1 flex justify-end gap-2">
                        <Link to={`/events/${event.id}`} className="text-blue-600 hover:text-blue-700 p-1" title="View Details">
                            <Eye className="h-5 w-5" />
                        </Link>
                        {userType === 'organization' && (
                            <Link to={`/events/${event.id}/participants`} className="text-purple-600 hover:text-purple-700 p-1" title="View Participants">
                                <Users className="h-5 w-5" />
                            </Link>
                        )}
                    </div>
                </div>
              ))}
            </div>

            {/* --- Pagination Component --- */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstEvent + 1}</span> to <span className="font-medium">{Math.min(indexOfLastEvent, currentEvents.length)}</span> of{' '}
                  <span className="font-medium">{currentEvents.length}</span> results
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState userType={userType} />
        )}
      </div>
    </div>
  );
};

export default EventsSection;