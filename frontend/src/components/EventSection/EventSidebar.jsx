// components/EventSidebar.jsx
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';

const EventSidebar = ({ event, eventId }) => {
  return (
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
          to={`/events/${eventId}/register`}
          className="block w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors text-center"
        >
          Register Now
        </Link>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account? <Link to="/login?role=participant" className="text-primary-600 hover:text-primary-700">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default EventSidebar;