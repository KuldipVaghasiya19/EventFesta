// components/EventSection/EventSidebar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, AlertCircle } from 'lucide-react';

const EventSidebar = ({ event, eventId }) => {
  const navigate = useNavigate();

  const isRegistrationOpen = () => {
    if (!event) return false;
    const now = new Date();
    const registrationDeadline = event.lastRegistertDate ? new Date(event.lastRegistertDate) : null;
    const eventDate = new Date(event.date);

    if (now > eventDate) return false; // Event has passed
    if (registrationDeadline && now > registrationDeadline) return false; // Deadline has passed
    if (event.maxParticipants && (event.currentParticipants >= event.maxParticipants)) return false; // Event is full

    return true;
  };

  const getRegistrationClosedMessage = () => {
    if (!event) return 'Registration details unavailable.';
    const now = new Date();
    const eventDate = new Date(event.date);
    const registrationDeadline = event.lastRegistertDate ? new Date(event.lastRegistertDate) : null;
  
    if (now > eventDate) {
      return 'This event has already occurred.';
    }
    if (registrationDeadline && now > registrationDeadline) {
      return `Registration closed on ${registrationDeadline.toLocaleDateString('en-GB')}.`;
    }
    if (event.maxParticipants && (event.currentParticipants >= event.maxParticipants)) {
      return 'This event is fully booked.';
    }
    return 'Registration is currently closed.';
  };


  const handleRegisterClick = () => {
    if (!isRegistrationOpen()) return;

    const storedUser = localStorage.getItem('techevents_user') || sessionStorage.getItem('techevents_user');
    if (storedUser) {
      navigate(`/events/${eventId}/register`);
    } else {
      navigate(`/login?role=participant&redirect=/events/${eventId}/register`);
    }
  };

  const registrationOpen = isRegistrationOpen();

  return (
    <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
      <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Event Details</h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-start">
          <Calendar className="h-5 w-5 mr-3 text-primary-500 mt-0.5" />
          <div>
            <span className="block font-medium text-gray-900">Date</span>
            <span className="text-gray-600">
              {new Date(event.date).toLocaleDateString('en-GB')}
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
              {event.currentParticipants || 0} / {event.maxParticipants || 'Unlimited'}
            </span>
          </div>
        </div>

        {event.lastRegistertDate && (
          <div className="flex items-start">
            <Calendar className="h-5 w-5 mr-3 text-red-500 mt-0.5" />
            <div>
              <span className="block font-medium text-gray-900">Registration Deadline</span>
              <span className="font-semibold text-red-600">
                {new Date(event.lastRegistertDate).toLocaleDateString('en-GB')}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex justify-between items-center">
          <span className="text-lg text-gray-600">Registration Fee</span>
          <span className="text-2xl font-bold text-gray-900">
            {event.registrationFees === 0 || event.registrationFees === '0' ? 'FREE' : `₹${event.registrationFees}`}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 mt-6" id="register">
        {registrationOpen ? (
          <>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Join?</h3>
            <p className="text-gray-600 mb-4">Secure your spot at this event. Limited seats available!</p>
            <button 
              onClick={handleRegisterClick}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-colors text-center text-lg"
            >
              Register Now
            </button>
            <p className="text-center text-sm text-gray-500 mt-3">
              Already have an account? <Link to="/login?role=participant" className="text-primary-600 hover:text-primary-700 font-medium">Sign in</Link>
            </p>
          </>
        ) : (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-semibold">
                  {getRegistrationClosedMessage()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventSidebar;