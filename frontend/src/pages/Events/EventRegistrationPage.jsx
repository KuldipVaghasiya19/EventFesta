// Enhanced EventRegistrationPage.jsx with proper field mapping and consistent ID usage
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import EventRegistrationForm from '../../components/forms/EventRegistrationForm';

const EventRegistrationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);

  // Check if registration is still open
  const isRegistrationOpen = (event) => {
    if (!event) return false;
    
    const now = new Date();
    const registrationDeadline = event.lastRegistertDate ? new Date(event.lastRegistertDate) : null;
    const eventDate = new Date(event.date);
    
    // Check if registration deadline has passed
    if (registrationDeadline && now > registrationDeadline) {
      return false;
    }
    
    // Check if event has already occurred
    if (now > eventDate) {
      return false;
    }
    
    // Check if event is full
    if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
      return false;
    }
    
    return true;
  };

  // Get registration status message
  const getRegistrationStatusMessage = (event) => {
    if (!event) return null;
    
    const now = new Date();
    const registrationDeadline = event.lastRegistertDate ? new Date(event.lastRegistertDate) : null;
    const eventDate = new Date(event.date);
    
    if (now > eventDate) {
      return { type: 'error', message: 'This event has already occurred.' };
    }
    
    if (registrationDeadline && now > registrationDeadline) {
      return { 
        type: 'error', 
        message: `Registration closed on ${registrationDeadline.toLocaleDateString('en-GB')}` 
      };
    }
    
    if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
      return { type: 'error', message: 'This event is fully booked.' };
    }
    
    if (registrationDeadline) {
      const daysUntilDeadline = Math.ceil((registrationDeadline - now) / (1000 * 60 * 60 * 24));
      if (daysUntilDeadline <= 3) {
        return { 
          type: 'warning', 
          message: `Registration closes in ${daysUntilDeadline} day${daysUntilDeadline !== 1 ? 's' : ''}!` 
        };
      }
    }
    
    return null;
  };

  // Fetch event data from backend
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(id);
        const response = await fetch(`http://localhost:8080/api/events/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Event not found');
          } else {
            setError('Failed to fetch event details');
          }
          return;
        }
        
        const eventData = await response.json();

        console.log(eventData);
        
        // Transform the data to match component expectations
        const transformedEvent = {
          ...eventData,
          id: eventData._id,
          date: eventData.eventDate,
          image: eventData.imageUrl,
          registrationFees: eventData.registrationFees || 0,
          prices: eventData.registrationFees === 0 ? ['Free'] : [`₹${eventData.registrationFees}`],
          currentParticipants: eventData.registerdParticipants ? eventData.registerdParticipants.length : 0,
          // Add any missing fields with defaults
          maxParticipants: eventData.maxParticipants || null,
          lastRegistertDate: eventData.lastRegistertDate || null,
          type: eventData.type || 'Tech Event',
          organizer: eventData.organizer || 'Event Organizer'
        };
        
        setEvent(transformedEvent);
        
        // Update document title
        document.title = `Register for ${transformedEvent.title} - TechEvents`;
        
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Function to create or find participant
  const createOrFindParticipant = async (formData) => {
    try {
      // First try to find existing participant by email
      const searchResponse = await fetch(`http://localhost:8080/api/participants/search?email=${formData.registeredEmail}`);
      
      if (searchResponse.ok) {
        const existingParticipant = await searchResponse.json();
        return existingParticipant.id || existingParticipant._id;
      }
      
      // If not found, create new participant
      const participantData = {
        name: formData.participantName,
        email: formData.registeredEmail,
        phone: formData.phoneNumber,
        college: formData.collegeOrOrganization,
        contactEmail: formData.contactEmail,
        yearOrDesignation: formData.yearOrDesignation,
        expectation: formData.expectation,
        // Add other participant fields as needed
      };
      
      const createResponse = await fetch('http://localhost:8080/api/participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(participantData),
      });

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        throw new Error(`Failed to create participant: ${errorText}`);
      }

      const newParticipant = await createResponse.json();
      return newParticipant.id || newParticipant._id;
      
    } catch (error) {
      console.error('Error creating/finding participant:', error);
      throw error;
    }
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setRegistrationStatus(null);
    
    try {
      // Validate registration is still open
      if (!isRegistrationOpen(event)) {
        throw new Error('Registration is no longer available for this event');
      }

      // Step 1: Create or find participant
      const participantId = await createOrFindParticipant(formData);
      
      // Step 2: Create registration data according to your EventRegistration model
      const registrationData = {
        registeredEmail: formData.registeredEmail,
        registeredName: formData.participantName,
        registeredPhone: formData.phoneNumber,
        contactEmail: formData.contactEmail,
        registrationDate: new Date().toISOString(),
        // Map form fields to registration data
        college: formData.collegeOrOrganization,
        yearOrDesignation: formData.yearOrDesignation,
        expectation: formData.expectation,
        agreeTerms: formData.agreeTerms,
        // Include any other form fields
        participantName: formData.participantName,
        phoneNumber: formData.phoneNumber,
        collegeOrOrganization: formData.collegeOrOrganization,
      };
      
      // Step 3: Submit registration to backend API
      // 🔧 FIX: Use URL parameter 'id' instead of 'event.id' for consistency
      const response = await fetch(`http://localhost:8080/api/participants/${participantId}/events/${id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Registration failed: ${errorText}`);
      }

      const result = await response.json();
      
      console.log('Registration successful:', result);
      
      // Store participant ID for future use
      if (typeof(Storage) !== "undefined") {
        localStorage.setItem('participantId', participantId);
      }
      
      // Show success status
      setRegistrationStatus({
        type: 'success',
        message: 'Registration successful!',
        attendanceCode: result.attendanceCode,
        details: 'Check your email for the QR code and event details.'
      });
      
      // Redirect after a delay to show success message
      setTimeout(() => {
        navigate('/dashboard/participant', { 
          state: { 
            message: 'Registration successful!', 
            eventTitle: event.title,
            attendanceCode: result.attendanceCode,
            participantId: participantId
          } 
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error registering for event:', error);
      setRegistrationStatus({
        type: 'error',
        message: error.message || 'Registration failed. Please try again.',
        details: 'If the problem persists, please contact support.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="pt-20 pb-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 py-16 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto mb-8"></div>
            <div className="h-64 bg-gray-300 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <div className="pt-20 pb-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            {error === 'Event not found' ? 'Event Not Found' : 'Error Loading Event'}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {error === 'Event not found' 
              ? "We couldn't find the event you're trying to register for."
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
  }

  const statusMessage = getRegistrationStatusMessage(event);
  const canRegister = isRegistrationOpen(event);

  return (
    <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link 
              to={`/events/${id}`}
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
              {canRegister 
                ? "Complete the form below to secure your spot at this amazing event."
                : "Registration is currently not available for this event."
              }
            </p>
          </div>
        </div>

        {/* Registration Status Alert */}
        {statusMessage && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className={`p-4 rounded-lg border ${
              statusMessage.type === 'error' 
                ? 'bg-red-50 border-red-200 text-red-700' 
                : 'bg-yellow-50 border-yellow-200 text-yellow-700'
            }`}>
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">{statusMessage.message}</span>
              </div>
            </div>
          </div>
        )}

        {/* Registration Result Status */}
        {registrationStatus && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className={`p-6 rounded-lg border ${
              registrationStatus.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <div className="flex items-center mb-2">
                {registrationStatus.type === 'success' ? (
                  <CheckCircle className="h-6 w-6 mr-2" />
                ) : (
                  <AlertCircle className="h-6 w-6 mr-2" />
                )}
                <span className="font-bold text-lg">{registrationStatus.message}</span>
              </div>
              {registrationStatus.attendanceCode && (
                <div className="mb-2">
                  <span className="font-medium">Attendance Code: </span>
                  <span className="bg-white px-2 py-1 rounded font-mono text-sm">
                    {registrationStatus.attendanceCode}
                  </span>
                </div>
              )}
              <p className="text-sm">{registrationStatus.details}</p>
            </div>
          </div>
        )}

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
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {event.type}
                  </span>
                  <span className="bg-gray-800 bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {event.organizer}
                  </span>
                </div>
                <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(event.date).toLocaleDateString('en-GB')}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {event.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {event.currentParticipants || 0}
                    {event.maxParticipants ? `/${event.maxParticipants}` : ''} registered
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
                    {event.registrationFees === 0 || event.registrationFees === '0' ? 'FREE' : `₹${event.registrationFees}`}
                  </div>
                  <p className="text-sm text-gray-500">per person</p>
                </div>
              </div>
              
              {event.lastRegistertDate && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Registration closes: </span>
                    <span className="font-medium ml-1">
                      {new Date(event.lastRegistertDate).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Registration Form */}
        {canRegister && registrationStatus?.type !== 'success' ? (
          <EventRegistrationForm 
            event={event} 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
          />
        ) : !canRegister && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Registration Unavailable</h3>
              <p className="text-gray-600 mb-6">
                Registration for this event is currently not available.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to={`/events/${id}`}
                  className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg inline-flex items-center justify-center"
                >
                  View Event Details
                </Link>
                <Link 
                  to="/events"
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg inline-flex items-center justify-center"
                >
                  Browse Other Events
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventRegistrationPage;