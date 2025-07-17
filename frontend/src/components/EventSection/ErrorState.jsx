// components/ErrorState.jsx
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ErrorState = ({ error, navigate }) => {
  return (
    <div className="pt-20 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
          {error === 'Event not found' ? 'Event Not Found' : 'Error Loading Event'}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {error === 'Event not found' 
            ? "We couldn't find the event you're looking for."
            : "There was an error loading the event details. Please try again."
          }
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg inline-flex items-center justify-center"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Go Back
          </button>
          <Link 
            to="/events" 
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg inline-flex items-center justify-center"
          >
            Browse Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;