// EventDetailPage.jsx - Main container component
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventBreadcrumb from '../../components/EventSection/EventBreadcrumb';
import EventBanner from '../../components/EventSection/EventBanner';
import EventSidebar from '../../components/EventSection/EventSidebar';
import LoadingState from '../../components/EventSection/LoadingState';
import ErrorState from '../../components/EventSection/ErrorState';
import EventTabs from '../../components/EventSection/EventTabs';

const EventDetailPage = () => {
  const { id } = useParams();

  console.log(id);
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:8080/api/events/${id}`, {
          method: 'GET'
        });
        
        if (!response.ok) {
          setError(response.status === 404 ? 'Event not found' : 'Failed to fetch event details');
          return;
        }
        
        const eventData = await response.json();
        
        const transformedEvent = {
          ...eventData,
          id: id,
          backendId: eventData._id,
          date: eventData.eventDate,
          image: eventData.imageUrl,
          schedule: eventData.schedule,
          price: eventData.registrationFees === 0 ? 'Free' : `₹${eventData.registrationFees}`,
          prizes: eventData.prizes ? [
            `1st Place: ${eventData.prizes.first}`,
            `2nd Place: ${eventData.prizes.second}`,
            `3rd Place: ${eventData.prizes.third}`
          ] : [],
          organizer: eventData.organizer
        };
        
        setEvent(transformedEvent);
        document.title = `${transformedEvent.title} - TechEvents`;
        
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };
    

    fetchEvent();
  }, [id]);

  if (loading) return <LoadingState />;
  if (error || !event) return <ErrorState error={error} navigate={navigate} />;

  return (
    <div className="pt-20 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <EventBreadcrumb eventTitle={event.title} />
        <EventBanner event={event} eventId={id} navigate={navigate} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EventTabs event={event} />
          </div>
          <div className="lg:col-span-1">
            <EventSidebar event={event} eventId={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;