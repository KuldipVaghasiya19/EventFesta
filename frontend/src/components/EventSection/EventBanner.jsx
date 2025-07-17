// components/EventBanner.jsx
import { Link } from 'react-router-dom';
import { ArrowLeft, Share2 } from 'lucide-react';

const EventBanner = ({ event, eventId, navigate }) => {
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
              onClick={() => navigate(-1)} 
              className="flex items-center text-gray-600 hover:text-primary-500"
            >
              <ArrowLeft className="h-5 w-5 mr-1" /> 
              <span className="hidden sm:inline">Back</span>
            </button>
            <button 
              onClick={handleShare} 
              className="flex items-center text-gray-600 hover:text-primary-500"
            >
              <Share2 className="h-5 w-5 mr-1" /> 
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
          <Link 
            to={`/events/${eventId}/register`}
            className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg"
          >
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventBanner;