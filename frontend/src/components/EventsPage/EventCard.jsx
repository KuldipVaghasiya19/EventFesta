import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Building, Tag, ArrowRight } from 'lucide-react';

const EventCard = ({ event }) => {
  const getEventTypeColor = (type) => {
    if (!type) {
      return 'bg-primary-500';
    }

    const colorMap = {
      'workshop': 'bg-blue-500', 'seminar': 'bg-green-500', 'conference': 'bg-purple-500',
      'hackathon': 'bg-red-500', 'meetup': 'bg-orange-500', 'webinar': 'bg-indigo-500',
      'bootcamp': 'bg-pink-500', 'networking': 'bg-teal-500', 'training': 'bg-yellow-500',
      'symposium': 'bg-cyan-500', 'summit': 'bg-violet-500', 'expo': 'bg-emerald-500',
    };

    const normalizedType = type.toLowerCase();
    return colorMap[normalizedType] || 'bg-primary-500';
  };

  return (
    <div className="bg-white dark:bg-navy-800 rounded-xl shadow-md dark:shadow-dark overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className={`absolute top-4 right-4 ${getEventTypeColor(event.type)} text-white text-xs font-bold px-3 py-1 rounded-full`}>
          {event.type ? event.type.charAt(0).toUpperCase() + event.type.slice(1) : 'General'}
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
                : 'Date TBD'}
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
  );
};

export default EventCard;