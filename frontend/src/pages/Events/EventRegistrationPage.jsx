import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, CreditCard } from 'lucide-react';
import { events } from '../../data/events';
import EventRegistrationForm from '../../components/forms/EventRegistrationForm';

const EventRegistrationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = events.find(e => e.id === id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (event) {
      document.title = `Register for ${event.title} - TechEvents`;
    } else {
      document.title = "Event Registration - TechEvents";
    }
  }, [event]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call for registration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Registration data:', formData);
      console.log('Event:', event);
      
      // Redirect to success page or dashboard
      navigate('/dashboard/participant');
    } catch (error) {
      console.error('Error registering for event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!event) {
    return (
      <div className="pt-20 pb-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Event Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            We couldn't find the event you're trying to register for.
          </p>
          <Link 
            to="/events" 
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link 
              to={`/events/${event.id}`}
              className="flex items-center text-gray-600 hover:text-primary-500 transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Event Details
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Register for <span className="text-primary-500">{event.title}</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Complete the form below to secure your spot at this amazing event.
            </p>
          </div>
        </div>

        {/* Event Summary Card */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {event.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {event.currentParticipants}/{event.maxParticipants} registered
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Registration Fee</h3>
                  <p className="text-gray-600">
                    {event.prices && event.prices.length > 0 ? event.prices[0] : 'Free'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">
                    {event.registrationFees === 0 || event.registrationFees === '0' ? 'FREE' : `₹${event.registrationFees || '999'}`}
                  </div>
                  <p className="text-sm text-gray-500">per person</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <EventRegistrationForm 
          event={event} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
};

export default EventRegistrationPage;