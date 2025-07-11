import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Remove import of hardcoded events since we're using backend data
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
    const initializeUser = () => {
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
        // Set interests from backend response
        setInterests(userData.interest || []);
        // Set registered events from backend response if available
        if (userData.registerdEvents) {
          setRegisteredEvents(userData.registerdEvents);
        } else {
          setRegisteredEvents([]);
        }
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
  const fetchRegisteredEvents = async () => {
    try {
      if (user) {
        const response = await fetch(`http://localhost:8080/api/participants/${user.id}/events`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const registeredEventsData = await response.json();
          setRegisteredEvents(registeredEventsData);
          
          // Update user's total events registered count
          setUser(prevUser => ({
            ...prevUser,
            totalEventsRegistered: registeredEventsData.length
          }));
        } else {
          console.error('Failed to fetch registered events:', response.status);
        }
      }
    } catch (error) {
      console.error('Error fetching registered events:', error);
    }
  };

  // Fetch interests from backend
  const fetchInterests = async () => {
    try {
      if (user) {
        const response = await fetch(`http://localhost:8080/api/participants/${user.id}/interests`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const interestsData = await response.json();
          setInterests(interestsData);
        } else {
          console.error('Failed to fetch interests:', response.status);
        }
      }
    } catch (error) {
      console.error('Error fetching interests:', error);
    }
  };

  // Load interests and registered events when user is available
  useEffect(() => {
    if (user) {
      fetchInterests();
      fetchRegisteredEvents();
    }
  }, [user]);

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
    fetchRegisteredEvents();
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
    return null; // Will redirect in useEffect
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
              events={registeredEvents} // Use registered events from backend instead of hardcoded events
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
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantDashboard;