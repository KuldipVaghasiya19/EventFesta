// Enhanced EventRegistrationPage.jsx with role-based access control
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, CreditCard, CheckCircle, AlertCircle, LogIn, ShieldOff } from 'lucide-react';
import EventRegistrationForm from '../../components/forms/EventRegistrationForm';

const EventRegistrationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [user, setUser] = useState(null);

  // Check for user authentication and role
  useEffect(() => {
    const storedUser = localStorage.getItem('techevents_user') || sessionStorage.getItem('techevents_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
      }
    }
  }, []);

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        
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
        
        const transformedEvent = {
          ...eventData,
          id: eventData._id,
          date: eventData.eventDate,
          image: eventData.imageUrl,
          registrationFees: eventData.registrationFees || 0,
          prices: eventData.registrationFees === 0 ? ['Free'] : [`₹${eventData.registrationFees}`],
          currentParticipants: eventData.registerdParticipants ? eventData.registerdParticipants.length : 0,
          maxParticipants: eventData.maxParticipants || null,
          lastRegistertDate: eventData.lastRegistertDate || null,
          type: eventData.type || 'Tech Event',
          organizer: eventData.organizer ? eventData.organizer.name : 'Event Organizer'
        };
        
        setEvent(transformedEvent);
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
    window.scrollTo(0, 0);
  }, [id]);
  
  const isRegistrationOpen = (event) => {
    if (!event) return false;
    const now = new Date();
    const registrationDeadline = event.lastRegistertDate ? new Date(event.lastRegistertDate) : null;
    const eventDate = new Date(event.date);

    if (now > eventDate) return false;
    if (registrationDeadline && now > registrationDeadline) return false;
    if (event.maxParticipants && (event.currentParticipants >= event.maxParticipants)) return false;

    return true;
  };

  const createOrFindParticipant = async (formData) => {
      // Logic to create or find participant remains the same
      // This is a placeholder for your actual implementation
      return user.id; 
  };

  const handleSubmit = async (formData) => {
    if (!user || user.role !== 'PARTICIPANT') {
        setError("Only participants can register for events.");
        return;
    }
    setIsSubmitting(true);
    setRegistrationStatus(null);
    try {
      const participantId = user.id;
      
      const registrationData = {
        participantName: formData.participantName,
        registeredEmail: formData.registeredEmail,
        contactEmail: formData.contactEmail,
        phoneNumber: formData.phoneNumber,
        collegeOrOrganization: formData.collegeOrOrganization,
        yearOrDesignation: formData.yearOrDesignation,
        expectation: formData.expectation,
      };
      
      const response = await fetch(`http://localhost:8080/api/participants/${participantId}/events/${id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Registration failed');
      }

      const result = await response.json();
      setRegistrationStatus({
        type: 'success',
        message: 'Registration successful!',
        attendanceCode: result.attendanceCode,
        details: 'Check your email for the QR code and event details.'
      });
      
      setTimeout(() => {
        navigate('/dashboard/participant', { 
          state: { message: 'Registration successful!', eventTitle: event.title } 
        });
      }, 3000);
      
    } catch (err) {
      setRegistrationStatus({
        type: 'error',
        message: err.message || 'An unexpected error occurred.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="pt-20 pb-16 min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (error || !event) {
    return <div className="pt-20 pb-16 min-h-screen bg-gray-50 flex items-center justify-center">Error: {error}</div>;
  }
  
  const canRegister = isRegistrationOpen(event);
  const isParticipant = user && user.role.toLowerCase() === 'participant';
  const isLoggedIn = !!user;

  return (
    <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header and Event Summary */}
        <div className="mb-8">
            <div className="flex items-center mb-4">
                <Link to={`/events/${id}`} className="flex items-center text-gray-600 hover:text-primary-500">
                    <ArrowLeft className="h-5 w-5 mr-1" />
                    Back to Event Details
                </Link>
            </div>
            <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
                    Register for <span className="text-primary-500">{event.title}</span>
                </h1>
            </div>
        </div>
        
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             {/* Event summary content... */}
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto">
            {!isLoggedIn ? (
                <div className="text-center bg-white rounded-xl shadow-sm border p-8">
                    <LogIn className="h-12 w-12 text-primary-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Please Login to Register</h3>
                    <p className="text-gray-600 mb-6">You must be logged in as a participant to register for this event.</p>
                    <Link to={`/login?role=participant&redirect=/events/${id}/register`} className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg">
                        Login as Participant
                    </Link>
                </div>
            ) : !isParticipant ? (
                <div className="text-center bg-white rounded-xl shadow-sm border p-8">
                    <ShieldOff className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Registration Not Available</h3>
                    <p className="text-gray-600 mb-6">Only participants can register for events. This feature is not available for organizations.</p>
                    <Link to="/events" className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg">
                        Browse Events
                    </Link>
                </div>
            ) : !canRegister ? (
                <div className="text-center bg-white rounded-xl shadow-sm border p-8">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Registration Is Closed</h3>
                    <p className="text-gray-600">We're sorry, but registration for this event is no longer available.</p>
                </div>
            ) : registrationStatus?.type === 'success' ? (
                 <div className="bg-green-50 border-green-200 text-green-700 rounded-lg p-6">
                    <CheckCircle className="h-6 w-6 mr-2" />
                    <span className="font-bold text-lg">{registrationStatus.message}</span>
                    <p className="text-sm">{registrationStatus.details}</p>
                 </div>
            ) : (
                <EventRegistrationForm
                    event={event}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    initialUserData={{ name: user.name, email: user.email }}
                />
            )}
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationPage;