// components/OverviewTab.jsx
import { useState } from 'react';
import { ChevronDown, ChevronUp, User, Mail } from 'lucide-react';

const OverviewTab = ({ event }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <>
      <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">About This Event</h2>
      
      <div className="prose prose-lg max-w-none text-gray-700 mb-6">
        <p className={showFullDescription ? '' : 'line-clamp-4'}>
          {event.description}
        </p>
        {event.description && event.description.length > 200 && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="flex items-center text-primary-600 font-medium mt-2"
          >
            {showFullDescription ? (
              <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></>
            ) : (
              <>Read More <ChevronDown className="ml-1 h-4 w-4" /></>
            )}
          </button>
        )}
      </div>

      {event.organizer && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Organizer</h3>
          <div className="bg-gray-50 rounded-lg p-4 flex items-center">
            <User className="h-5 w-5 mr-3 text-primary-500" />
            <p className="text-gray-800 font-medium">
              {typeof event.organizer === 'object' && event.organizer.name 
                            ? event.organizer.name 
                            : typeof event.organizer === 'string' 
                            ? event.organizer 
                            : 'Organization'}</p>
            <Mail className="h-5 w-5 ml-auto mr-3 text-primary-500" />
            <a href={`mailto:${event.organizer.email}`} className="text-primary-600 hover:underline">
              {event.organizer.email}
            </a>
          </div>
        </div>
      )}

      {event.tags && event.tags.length > 0 && (
        <>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Event Topics</h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {event.tags.map((tag, idx) => (
              <span 
                key={idx} 
                className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </>
      )}

      {event.prizes && event.prizes.length > 0 && (
        <>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Prizes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {event.prizes.map((prize, idx) => (
              <div 
                key={idx} 
                className="bg-primary-50 rounded-lg p-4 text-primary-700 font-medium"
              >
                {prize}
              </div>
            ))}
          </div>
        </>
      )}

      {event.judges && event.judges.length > 0 && (
        <>
          <h3 className="text-2xl font-display font-bold text-gray-900 mb-6">Judges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {event.judges.map((judge, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-bold text-xl text-gray-900">{judge.name}</h4>
                <p className="text-gray-500">{judge.company}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default OverviewTab;