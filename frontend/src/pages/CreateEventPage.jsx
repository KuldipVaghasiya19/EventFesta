import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CreateEventForm from '../components/forms/CreateEventForm';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Create Event - TechEvents";
  }, []);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Event data:', formData);
      
      // Redirect to organization dashboard or event page
      navigate('/dashboard/organization');
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsSubmitting(false);
    }
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

        {/* Form */}
        <CreateEventForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default CreateEventPage;