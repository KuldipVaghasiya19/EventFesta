import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CreateEventForm from '../../components/forms/createEventForm';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Get organization ID from sessionStorage
  const getOrganizationId = () => {
    const user = JSON.parse(sessionStorage.getItem("techevents_user"));
    return user ? user.id : null;
  };
    
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Create Event - EventFesta";
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

      // ✅ CHANGED: The keys here now EXACTLY match your Event.java entity.
      const eventData = {
        title: formData.title,
        description: formData.description,        // Corrected from 'about'
        type: formData.type,                      // Corrected from 'eventType'
        eventDate: formData.eventDate,
        lastRegistertDate: formData.lastRegistertDate, // Corrected from 'registrationDeadline'
        location: formData.location,
        registrationFees: parseFloat(formData.registrationFees) || 0,
        maxParticipants: parseInt(formData.maxParticipants) || 0,
        tags: formData.tags,
        speakers: formData.speakers,
        judges: formData.judges,
        prizes: formData.prizes,
        schedule: formData.schedule,
      };

      // Create FormData for multipart request
      const formDataToSend = new FormData();
      // The backend expects a part named 'event' that is a JSON string
      formDataToSend.append('event', JSON.stringify(eventData));
      
      // The backend expects a part named 'image' that is the image file
      if (formData.photo) {
        formDataToSend.append('image', formData.photo);
      } else {
        // If no photo is provided, create and send a placeholder
        const placeholderBlob = await createPlaceholderImage();
        formDataToSend.append('image', placeholderBlob, 'placeholder.png');
      }

      // Make API call
      const response = await fetch(`http://localhost:8080/api/organizations/${organizationId}/create-event`, {
          method: 'POST',
          body: formDataToSend,
          // ✅ THIS TELLS THE BROWSER TO SEND THE SESSION COOKIE
          credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Event created successfully:', result);
      setSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/dashboard/organization', { 
          state: { 
            message: 'Event created successfully!',
            eventId: result.id 
          }
        });
      }, 1500);

    } catch (err) {
      console.error('Error creating event:', err);
      setError(err.message || 'Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to create a placeholder image if none is uploaded
  const createPlaceholderImage = () => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, 400, 300);
      gradient.addColorStop(0, '#f3f4f6');
      gradient.addColorStop(1, '#e5e7eb');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 400, 300);
      ctx.fillStyle = '#6b7280';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Event Image', 200, 150);
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  };

  return (
    <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link to="/dashboard/organization" className="flex items-center text-gray-600 hover:text-primary-500 transition-colors mr-4">
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

        {/* Error & Success Messages */}
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}
        {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">Event created successfully! Redirecting...</div>}

        <CreateEventForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default CreateEventPage;
