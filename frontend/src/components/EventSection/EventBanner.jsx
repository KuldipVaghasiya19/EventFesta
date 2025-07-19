import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2 } from 'lucide-react';

const EventBanner = ({ event, eventId, navigate: nav }) => {
  const navigate = useNavigate();

  // Helper function to check if registration is still possible
  const isRegistrationOpen = () => {
    if (!event) return false;
    const now = new Date();
    const eventDate = new Date(event.date);
    const registrationDeadline = event.lastRegistertDate ? new Date(event.lastRegistertDate) : null;

    // Check if the event date is in the past
    if (now > eventDate) {
      return false;
    }
    // Check if the registration deadline has passed
    if (registrationDeadline && now > registrationDeadline) {
      return false;
    }
    // Check if the event is full
    if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
      return false;
    }
    
    return true;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this tech event: ${event.title}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleRegisterClick = () => {
    // This check is a safeguard, the button should be disabled anyway
    if (!isRegistrationOpen()) return;

    const storedUser = localStorage.getItem('techevents_user') || sessionStorage.getItem('techevents_user');
    if (storedUser) {
      navigate(`/events/${eventId}/register`);
    } else {
      // Redirect to login, passing the registration page as the redirect URL
      navigate(`/login?role=participant&redirect=/events/${eventId}/register`);
    }
  };

  const registrationOpen = isRegistrationOpen();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
      <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {event.type}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-display font-bold mb-2 drop-shadow-md">
            {event.title}
          </h1>
          <p className="text-lg text-white/90">{event.location}</p>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex flex-wrap justify-between items-center p-4 md:p-6">
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => nav(-1)} 
              className="flex items-center text-gray-600 hover:text-primary-500 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-1" /> 
              <span className="hidden sm:inline">Back</span>
            </button>
            <button 
              onClick={handleShare} 
              className="flex items-center text-gray-600 hover:text-primary-500 transition-colors"
            >
              <Share2 className="h-5 w-5 mr-1" /> 
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
          
          {registrationOpen ? (
            <button 
              onClick={handleRegisterClick}
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
            >
              Register Now
            </button>
          ) : (
            <button 
              className="px-6 py-2 bg-gray-400 text-white font-medium rounded-lg cursor-not-allowed"
              disabled
            >
              Registration Closed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventBanner;