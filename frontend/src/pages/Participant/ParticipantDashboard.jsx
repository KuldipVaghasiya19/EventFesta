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

      // If the login response was also wrapped in ApiResponse, the actual user details might be inside userData.data
      // We check if userData has a success flag to unwrap it just in case
      const actualUser = userData?.success !== undefined ? userData.data : userData;

      if (actualUser && actualUser.role === 'PARTICIPANT') {
        // Transform backend response to match dashboard expectations
        const transformedUser = {
          id: actualUser.id,
          name: actualUser.name,
          role: actualUser.currentlyStudyingOrNot ? 
            `${actualUser.course} Student` : 
            actualUser.course || 'Participant',
          avatar: actualUser.profileImageUrl || "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          email: actualUser.email,
          organization: actualUser.university || 'Not specified',
          course: actualUser.course,
          university: actualUser.university,
          currentlyStudying: actualUser.currentlyStudyingOrNot,
          totalEventsRegistered: actualUser.totaleventsRegisterd || 0,
          profileImagePublicId: actualUser.profileImagePublicId
        };

        console.log("Transformed User:", transformedUser);
        setUser(transformedUser);
        
        // --- Fetch fresh data from the server on load ---
        await fetchRegisteredEvents(actualUser.id);
        await fetchInterests(actualUser.id);
        
      } else if (actualUser && actualUser.role === 'ORGANIZATION') {
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

  // Fetch registered events from backend (UPDATED FOR NEW API RESPONSE)
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
        },
        credentials: 'include' // Ensure cookies are sent
      });

      if (response.ok) {
        const apiResponse = await response.json();
        console.log('API Response for events:', apiResponse);
        
        // Handle the new ApiResponse structure: { success, message, data }
        if (apiResponse.success) {
          const eventsArray = Array.isArray(apiResponse.data) ? apiResponse.data : [];
          
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
          })).sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
          
          setRegisteredEvents(transformedEvents);
          
          // Update user's total events registered count based on the fresh data
          setUser(prevUser => ({
            ...prevUser,
            totalEventsRegistered: transformedEvents.length
          }));
        } else {
          console.error('API Error:', apiResponse.message);
          setRegisteredEvents([]);
        }
      } else {
        console.error('Failed to fetch registered events:', response.status, response.statusText);
        setRegisteredEvents([]);
      }
    } catch (error) {
      console.error('Error fetching registered events:', error);
      setRegisteredEvents([]);
    }
  };

  // Fetch interests from backend (UPDATED FOR NEW API RESPONSE)
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
        },
        credentials: 'include'
      });

      if (response.ok) {
        const apiResponse = await response.json();
        console.log('API Response for interests:', apiResponse);
        
        // Handle the new ApiResponse structure: { success, message, data }
        if (apiResponse.success) {
          const interestsArray = Array.isArray(apiResponse.data) ? apiResponse.data : [];
          setInterests(interestsArray);
        } else {
          console.error('API Error:', apiResponse.message);
          setInterests([]);
        }
      } else {
        console.error('Failed to fetch interests:', response.status, response.statusText);
        setInterests([]);
      }
    } catch (error) {
      console.error('Error fetching interests:', error);
      setInterests([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('techevents_user');
    sessionStorage.removeItem('techevents_user');
    localStorage.removeItem('techevents_token');
    sessionStorage.removeItem('techevents_token');
    
    navigate('/', { replace: true });
  };

  const handleEventRegister = () => {
    if (user?.id) {
      fetchRegisteredEvents(user.id);
    }
  };

  const handleInterestsUpdate = () => {
    if (user?.id) {
      fetchInterests(user.id);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 pb-16 min-h-screen bg-slate-50 dark:bg-navy-900 transition-colors duration-300 flex items-center justify-center">
        <div className="bg-white dark:bg-navy-800 p-8 rounded-2xl shadow-xl flex flex-col items-center space-y-4 border border-gray-100 dark:border-navy-700">
          <div className="relative">
            <div className="animate-spin rounded-full h-14 w-14 border-y-2 border-purple-600"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 bg-purple-100 dark:bg-purple-900/30 rounded-full"></div>
          </div>
          <span className="text-gray-600 dark:text-gray-300 font-medium animate-pulse">Loading your experience...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-20 pb-16 min-h-screen bg-slate-50 dark:bg-navy-900 transition-colors duration-300 flex items-center justify-center">
        <div className="bg-white dark:bg-navy-800 p-8 rounded-2xl shadow-xl text-center max-w-md w-full mx-4 border border-gray-100 dark:border-navy-700">
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">Unable to load user data</p>
          <button
            onClick={() => navigate('/login?role=participant', { replace: true })}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-purple-600/20 hover:-translate-y-0.5"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 min-h-screen bg-slate-50 dark:bg-navy-900 transition-colors duration-300">
      <ProfileSection 
        user={user} 
        type="participant"
        onLogout={handleLogout}
        coverGradient="from-purple-600 via-indigo-600 to-blue-700"
      />

      <div className="container mx-auto px-4 md:px-6 -mt-12 relative z-10 transition-all duration-500 ease-in-out">
        <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-xl dark:shadow-dark border border-gray-100 dark:border-navy-700 overflow-hidden flex flex-col min-h-[500px]">
          
          <div className="bg-white dark:bg-navy-800 border-b border-gray-100 dark:border-navy-700">
            <TabNavigation 
              activeTab={activeTab}
              onTabChange={setActiveTab}
              type="participant"
            />
          </div>

          <div className="flex-1 bg-gray-50/30 dark:bg-navy-900/20 p-2 sm:p-0">
            {activeTab === 'events' ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <EventsSection 
                  events={registeredEvents}
                  userType="participant"
                  user={user}
                  registeredEvents={registeredEvents}
                  onEventRegister={handleEventRegister}
                />
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <InterestsSection 
                  interests={interests}
                  setInterests={setInterests}
                  participantId={user.id}
                  onInterestsUpdate={handleInterestsUpdate}
                />
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ParticipantDashboard;