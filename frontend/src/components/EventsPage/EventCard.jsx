import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Building, ArrowRight, Clock, AlertTriangle } from 'lucide-react';

const EventCard = ({ event }) => {
  // Logic to calculate if seats are low (last 20%)
  const maxSeats = event.maxParticipants || 0;
  const occupiedSeats = event.currentParticipants || 0;
  const remainingSeats = maxSeats - occupiedSeats;
  const isLowSeats = maxSeats > 0 && (remainingSeats / maxSeats) <= 0.2 && remainingSeats > 0;
  const isSoldOut = maxSeats > 0 && remainingSeats <= 0;

  
  const getEventTypeColor = (type) => {
    if (!type) return 'bg-primary-500';
    const colorMap = {
      'workshop': 'bg-blue-500', 'seminar': 'bg-green-500', 'conference': 'bg-purple-500',
      'hackathon': 'bg-red-500', 'meetup': 'bg-orange-500', 'webinar': 'bg-indigo-500',
      'bootcamp': 'bg-pink-500', 'networking': 'bg-teal-500', 'training': 'bg-yellow-500',
      'symposium': 'bg-cyan-500', 'summit': 'bg-violet-500', 'expo': 'bg-emerald-500',
    };
    const normalizedType = type.toLowerCase();
    return colorMap[normalizedType] || 'bg-primary-500';
  };

  console.log(event.organizer)

  return (
    <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-md dark:shadow-dark overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-gray-100 dark:border-navy-700 flex flex-col h-full group">
      <div className="relative h-52 overflow-hidden shrink-0">
        <img
          src={event.imageUrl || 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Event Type Badge */}
        <div className={`absolute top-4 right-4 ${getEventTypeColor(event.type)} text-white text-xs font-extrabold tracking-wide px-3 py-1.5 rounded-lg shadow-lg`}>
          {event.type ? event.type.charAt(0).toUpperCase() + event.type.slice(1) : 'General'}
        </div>

        {/* RED NOTICE: Low Seats Indicator */}
        {isLowSeats && !isSoldOut && (
          <div className="absolute bottom-4 left-4 right-4 bg-red-600/95 backdrop-blur-sm text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2 animate-pulse shadow-lg">
            <AlertTriangle className="h-4 w-4" />
            Hurry! Only {remainingSeats} seats left 
          </div>
        )}
        
        {isSoldOut && (
          <div className="absolute bottom-4 left-4 right-4 bg-gray-900/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center justify-center gap-2 shadow-lg">
            Sold Out
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        {/* Organization Name Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest bg-primary-50 dark:bg-primary-500/10 px-2 py-0.5 rounded">
            Organized by {(typeof event.organizer === 'object' ? event.organizer.name : event.organizer) || 'EventFesta'}
          </span>
        </div>

        <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors mb-4 line-clamp-2">
          {event.title}
        </h3>
        
        <div className="space-y-3 mb-6 flex-grow">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Calendar className="h-4 w-4 mr-3 text-primary-500 shrink-0" />
            <span className="text-sm font-medium">
              {event.eventDate
                ? new Date(event.eventDate).toLocaleDateString('en-US', {
                  weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                }) : 'Date TBD'}
            </span>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <MapPin className="h-4 w-4 mr-3 text-primary-500 shrink-0" />
            <span className="text-sm font-medium truncate">{event.location}</span>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Users className="h-4 w-4 mr-3 text-primary-500 shrink-0" />
            <span className="text-sm font-medium">{occupiedSeats} / {maxSeats} Registered</span>
          </div>
        </div>

        {/* Registration Deadline */}
        {event.lastRegistertDate && (
          <div className="mb-5 flex items-center text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-2 rounded-xl w-fit border border-amber-100 dark:border-amber-500/20">
            <Clock className="h-4 w-4 mr-2 shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Registration ends: {new Date(event.lastRegistertDate).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              })}
            </span>
          </div>
        )}

        <div className="mt-auto border-t border-gray-100 dark:border-navy-700 pt-5 flex items-center justify-between">
          <div className="flex gap-2 truncate pr-4">
            {event.tags && event.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="px-2.5 py-1 bg-gray-100 dark:bg-navy-900 text-gray-600 dark:text-gray-300 text-xs font-semibold rounded-md truncate">
                #{tag}
              </span>
            ))}
          </div>

          <Link
            to={`/events/${event.id}`}
            className="shrink-0 inline-flex items-center justify-center p-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-all duration-300 shadow-md shadow-primary-500/20"
          >
            <span className="text-xs font-bold px-2">Details</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;