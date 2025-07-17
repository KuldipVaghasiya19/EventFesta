import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProfileSection from '../../components/dashboard/ProfileSection';
import TabNavigation from '../../components/dashboard/TabNavigation';
import InterestsSection from '../../components/dashboard/InterestsSection';
import EventsSection from '../../components/dashboard/EventsSection';

const ParticipantDashboard = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [interests, setInterests] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeUser = async () => {
      let userData = null;

      // First, try to get user data from navigation state
      if (location.state?.userData) {
        userData = location.state.userData;
      } else {
        // If not in state, try to get from localStorage or sessionStorage
        const storedUser = localStorage.getItem('techevents_user') || sessionStorage.getItem('techevents_user');
        if (storedUser) {
          try {
            userData = JSON.parse(storedUser);
          } catch (error) {
            console.error('Error parsing stored user data:', error);
          }
        }
      }

      if (userData && userData.role === 'PARTICIPANT') {
        // Transform backend response to match dashboard expectations
        const transformedUser = {
          id: userData.id,
          name: userData.name,
          role: userData.currentlyStudyingOrNot ? 
            `${userData.course} Student` : 
            userData.course || 'Participant',
          avatar: userData.profileImageUrl || "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          email: userData.email,
          organization: userData.university || 'Not specified',
          course: userData.course,
          university: userData.university,
          currentlyStudying: userData.currentlyStudyingOrNot,
          totalEventsRegistered: userData.totaleventsRegisterd || 0,
          profileImagePublicId: userData.profileImagePublicId
        };

        setUser(transformedUser);
        
        // Check if user data already contains registered events and interests
        if (userData.registeredEvents && Array.isArray(userData.registeredEvents)) {
          // Transform registered events to match component expectations
          const transformedEvents = userData.registeredEvents.map(event => ({
            id: event.id,
            title: event.title,
            description: event.description,
            type: event.type,
            date: new Date(event.eventDate).toISOString(),
            eventDate: event.eventDate,
            lastRegistrationDate: event.lastRegistertDate,
            location: event.location,
            registrationFees: event.registrationFees,
            maxParticipants: event.maxParticipants,
            currentParticipants: event.currentParticipants,
            remainingSeats: event.remainingSeats,
            imageUrl: event.imageUrl,
            imagePublicId: event.imagePublicId,
            tags: event.tags || [],
            speakers: event.speakers || [],
            judges: event.judges || [],
            prizes: event.prizes || {},
            schedule: event.schedule || [],
            organizer: event.organizer || {
              id: event.organizerId,
              name: event.organizerName,
              avatar: event.organizerAvatar
            }
          }));
          
          setRegisteredEvents(transformedEvents);
          
          // Update total events registered count
          transformedUser.totalEventsRegistered = transformedEvents.length;
          setUser(transformedUser);
        } else {
          // If not in user data, fetch from API
          await fetchRegisteredEvents(userData.id);
        }

        // Handle interests
        if (userData.interests && Array.isArray(userData.interests)) {
          setInterests(userData.interests);
        } else {
          // If not in user data, fetch from API
          await fetchInterests(userData.id);
        }
      } else if (userData && userData.role === 'ORGANIZATION') {
        // If user is organization, redirect to organization dashboard
        navigate('/organization/dashboard', { replace: true });
        return;
      } else {
        // If no valid user data, redirect to login
        navigate('/login?role=participant', { replace: true });
        return;
      }

      setLoading(false);
    };

    initializeUser();
    window.scrollTo(0, 0);
    document.title = "My Dashboard - TechEvents";
  }, [location.state, navigate]);

  // Fetch registered events from backend
  const fetchRegisteredEvents = async (userId) => {
    if (!userId) {
      console.error('No user ID provided for fetching registered events');
      return;
    }
    
    try {
      console.log('Fetching registered events for user:', userId);
      const response = await fetch(`http://localhost:8080/api/participants/${userId}/events`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if you have authentication token
          // 'Authorization': `Bearer ${localStorage.getItem('techevents_token') || sessionStorage.getItem('techevents_token')}`
        }
      });

      if (response.ok) {
        const registeredEventsData = await response.json();
        console.log('Registered events fetched:', registeredEventsData);
        
        // Ensure we have an array
        const eventsArray = Array.isArray(registeredEventsData) ? registeredEventsData : [];
        
        // Transform events if needed
        const transformedEvents = eventsArray.map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          type: event.type,
          date: new Date(event.eventDate).toISOString(),
          eventDate: event.eventDate,
          lastRegistrationDate: event.lastRegistertDate,
          location: event.location,
          registrationFees: event.registrationFees,
          maxParticipants: event.maxParticipants,
          currentParticipants: event.currentParticipants,
          remainingSeats: event.remainingSeats,
          imageUrl: event.imageUrl,
          imagePublicId: event.imagePublicId,
          tags: event.tags || [],
          speakers: event.speakers || [],
          judges: event.judges || [],
          prizes: event.prizes || {},
          schedule: event.schedule || [],
          organizer: event.organizer || {
            id: event.organizerId,
            name: event.organizerName,
            avatar: event.organizerAvatar
          }
        }));
        
        setRegisteredEvents(transformedEvents);
        
        // Update user's total events registered count
        setUser(prevUser => ({
          ...prevUser,
          totalEventsRegistered: transformedEvents.length
        }));
      } else {
        console.error('Failed to fetch registered events:', response.status, response.statusText);
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Error details:', errorData);
        
        // Set empty array on error
        setRegisteredEvents([]);
      }
    } catch (error) {
      console.error('Error fetching registered events:', error);
      
      // Check if it's a CORS error
      if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
        console.warn('CORS error detected. Please configure CORS on your backend server.');
        console.warn('Add Access-Control-Allow-Origin header for http://localhost:5173');
      }
      
      // Set empty array on error
      setRegisteredEvents([]);
    }
  };

  // Fetch interests from backend
  const fetchInterests = async (userId) => {
    if (!userId) {
      console.error('No user ID provided for fetching interests');
      return;
    }
    
    try {
      console.log('Fetching interests for user:', userId);
      const response = await fetch(`http://localhost:8080/api/participants/${userId}/interests`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if you have authentication token
          // 'Authorization': `Bearer ${localStorage.getItem('techevents_token') || sessionStorage.getItem('techevents_token')}`
        }
      });

      if (response.ok) {
        const interestsData = await response.json();
        console.log('Interests fetched:', interestsData);
        
        // Ensure we have an array
        const interestsArray = Array.isArray(interestsData) ? interestsData : [];
        setInterests(interestsArray);
      } else {
        console.error('Failed to fetch interests:', response.status, response.statusText);
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Error details:', errorData);
        
        // Set empty array on error
        setInterests([]);
      }
    } catch (error) {
      console.error('Error fetching interests:', error);
      
      // Check if it's a CORS error
      if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
        console.warn('CORS error detected. Please configure CORS on your backend server.');
        console.warn('Add Access-Control-Allow-Origin header for http://localhost:5173');
        console.warn('Backend should respond with: Access-Control-Allow-Origin: http://localhost:5173');
      }
      
      // Set empty array on error
      setInterests([]);
    }
  };

  const handleLogout = () => {
    // Clear stored data
    localStorage.removeItem('techevents_user');
    sessionStorage.removeItem('techevents_user');
    localStorage.removeItem('techevents_token');
    sessionStorage.removeItem('techevents_token');
    
    // Redirect to home page
    navigate('/', { replace: true });
  };

  const handleEventRegister = () => {
    // Refresh registered events after registration
    if (user?.id) {
      fetchRegisteredEvents(user.id);
    }
  };

  const handleInterestsUpdate = () => {
    // Refresh interests after update
    if (user?.id) {
      fetchInterests(user.id);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 pb-16 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-20 pb-16 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Unable to load user data</p>
          <button
            onClick={() => navigate('/login?role=participant', { replace: true })}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 min-h-screen bg-slate-50">
      {/* Profile Section */}
      <ProfileSection 
        user={user} 
        type="participant"
        onLogout={handleLogout}
      />

      <div className="container mx-auto px-4 md:px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Tab Navigation */}
          <TabNavigation 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            type="participant"
          />

          {/* Content */}
          {activeTab === 'events' ? (
            <EventsSection 
              events={registeredEvents}
              userType="participant"
              user={user}
              registeredEvents={registeredEvents}
              onEventRegister={handleEventRegister}
            />
          ) : (
            <InterestsSection 
              interests={interests}
              setInterests={setInterests}
              participantId={user.id}
              onInterestsUpdate={handleInterestsUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantDashboard;