import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CreateEventForm from '../../components/forms/createEventForm';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Get organization ID from sessionStorage, URL params, or context
  const getOrganizationId = () => {
    // Option 1: From sessionStorage
    const user = JSON.parse(localStorage.getItem("techevents_user"));
    console.log(user.id); // ✅ Safe to use

    const orgId = user.id;
    if (orgId) return orgId;
    
    // Option 2: From URL params (if passed as route parameter)
    // const { orgId } = useParams();
    // if (orgId) return orgId;
    
    // Option 3: From user context/state
    // const { user } = useContext(UserContext);
    // if (user?.organizationId) return user.organizationId;
    
    // Fallback - you might want to redirect to login or organization selection
    return null;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Create Event - TechEvents";
  }, []);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const organizationId = getOrganizationId();
      
      if (!organizationId) {
        throw new Error('Organization ID not found. Please log in again.');
      }

      // Prepare the event data for JSON
      const eventData = {
        name: formData.name,
        about: formData.about,
        eventType: formData.eventType,
        tags: formData.tags,
        prizes: formData.prizes,
        judges: formData.judges,
        speakers: formData.speakers,
        schedule: formData.schedule,
        eventDate: formData.eventDate,
        registrationDeadline: formData.registrationDeadline,
        location: formData.location,
        registrationFees: parseFloat(formData.registrationFees) || 0,
        razorpayEnabled: formData.razorpayEnabled,
        remainingSeats: parseInt(formData.maxParticipants) || 0,
        maxParticipants: parseInt(formData.maxParticipants) || 0
      };

      // Create FormData for multipart request
      const formDataToSend = new FormData();
      
      // Add event data as JSON string
      formDataToSend.append('event', JSON.stringify(eventData));
      
      // Handle image file
      if (formData.photo) {
        formDataToSend.append('image', formData.photo);
      } else {
        // Create a default placeholder image blob if no image is provided
        const placeholderBlob = await createPlaceholderImage();
        formDataToSend.append('image', placeholderBlob, 'placeholder.png');
      }

      // Make API call
      const response = await fetch(`http://localhost:8080/api/organizations/${organizationId}/create-event`, {
        method: 'POST',
        body: formDataToSend,
        // Don't set Content-Type header - let the browser set it for multipart/form-data
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Event created successfully:', result);
      
      setSuccess(true);
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate('/dashboard/organization', { 
          state: { 
            message: 'Event created successfully!',
            eventId: result.id 
          }
        });
      }, 1500);

    } catch (error) {
      console.error('Error creating event:', error);
      setError(error.message || 'Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to create placeholder image
  const createPlaceholderImage = () => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 400, 300);
      gradient.addColorStop(0, '#f3f4f6');
      gradient.addColorStop(1, '#e5e7eb');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 400, 300);
      
      // Add text
      ctx.fillStyle = '#6b7280';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Event Image', 200, 150);
      
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    });
  };

  return (
    <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              to="/dashboard/organization"
              className="flex items-center text-gray-600 hover:text-primary-500 transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Dashboard
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Create New <span className="text-primary-500">Event</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fill out the form below to create your event. All fields marked with * are required.
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success!</h3>
                <div className="mt-2 text-sm text-green-700">
                  Event created successfully. Redirecting to dashboard...
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <CreateEventForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default CreateEventPage;