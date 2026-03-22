import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plus, Settings } from 'lucide-react';
import ProfileSection from '../../components/dashboard/ProfileSection';
import TabNavigation from '../../components/dashboard/TabNavigation';
import EventsSection from '../../components/dashboard/EventsSection';
import AttendanceSection from '../../components/dashboard/AttendanceSection';
import AnalyticsSection from '../../components/dashboard/AnalyticsSection';

const OrganizationDashboard = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [organization, setOrganization] = useState(null);
  const [organizationEvents, setOrganizationEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Get organization data from different sources
    const getOrganizationData = () => {
      // First, try to get from navigation state (from login)
      if (location.state?.userData) {
        return location.state.userData;
      }
      
      // Then try from localStorage (if remember me was checked)
      const storedUser = localStorage.getItem('techevents_user');
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
        }
      }
      
      // Finally try from sessionStorage
      const sessionUser = sessionStorage.getItem('techevents_user');
      if (sessionUser) {
        try {
          return JSON.parse(sessionUser);
        } catch (error) {
          console.error('Error parsing session user data:', error);
        }
      }
      
      return null;
    };

    const rawUserData = getOrganizationData();
    
    // --- FIX: Unwrap the new ApiResponse structure { success, message, data } ---
    // If the data is wrapped in the new response format, extract the actual user details from '.data'
    const actualUser = rawUserData?.success !== undefined ? rawUserData.data : rawUserData;
    
    if (actualUser) {
      // Verify it's an organization user
      if (actualUser.role === 'ORGANIZATION') {
        // Transform backend data to match component expectations
        const transformedData = {
          id: actualUser.id,
          name: actualUser.name,
          role: actualUser.type || 'Organization',
          avatar: actualUser.profileImageUrl || 'https://images.pexels.com/photos/2977547/pexels-photo-2977547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          email: actualUser.email,
          location: actualUser.location,
          organization: actualUser.since ? `Founded ${actualUser.since}` : 'Organization',
          about: actualUser.about,
          contact: actualUser.contact,
          totalOrganizedEvents: actualUser.totalOrganizedEvents || 0,
          type: actualUser.type,
          profileImagePublicId: actualUser.profileImagePublicId
        };
        
        setOrganization(transformedData);
        
        // Set the organization's events
        if (actualUser.organizedEvents && Array.isArray(actualUser.organizedEvents)) {
          // Transform events to match your component's expected format
          const transformedEvents = actualUser.organizedEvents.map(event => ({
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
            organizer: {
              id: actualUser.id,
              name: actualUser.name,
              avatar: actualUser.profileImageUrl
            }
          })).sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
          
          setOrganizationEvents(transformedEvents);
        } else {
          setOrganizationEvents([]);
        }
        
        document.title = `${actualUser.name} Dashboard - TechEvents`;
      } else {
        // User is not an organization, redirect to appropriate dashboard
        navigate('/participant/dashboard', { replace: true });
        return;
      }
    } else {
      // No user data found, redirect to login
      navigate('/login?role=organization', { replace: true });
      return;
    }
    
    setLoading(false);
    window.scrollTo(0, 0);
  }, [location.state, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="pt-20 pb-16 min-h-screen bg-gray-50 dark:bg-navy-900 transition-colors duration-300 flex items-center justify-center">
        <div className="bg-white dark:bg-navy-800 p-8 rounded-2xl shadow-xl flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-14 w-14 border-y-2 border-green-500"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 bg-green-100 dark:bg-green-900/30 rounded-full"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 font-medium animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error if no organization data
  if (!organization) {
    return (
      <div className="pt-20 pb-16 min-h-screen bg-gray-50 dark:bg-navy-900 transition-colors duration-300 flex items-center justify-center">
        <div className="bg-white dark:bg-navy-800 p-8 rounded-2xl shadow-xl text-center max-w-md w-full mx-4 border border-gray-100 dark:border-navy-700">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Data Unavailable</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">We were unable to load your organization profile data.</p>
          <Link 
            to="/login?role=organization"
            className="inline-flex px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg shadow-green-600/20 hover:-translate-y-0.5"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'events':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <EventsSection 
              events={organizationEvents} 
              userType="organization" 
              organization={organization} 
            />
          </div>
        );
      case 'attendance':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AttendanceSection 
              events={organizationEvents} 
              organization={organization} 
            />
          </div>
        );
      case 'analytics':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AnalyticsSection 
              events={organizationEvents} 
              organization={organization} 
            />
          </div>
        );
      default:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <EventsSection 
              events={organizationEvents} 
              userType="organization" 
              organization={organization} 
            />
          </div>
        );
    }
  };

  return (
    <div className="pt-20 pb-16 min-h-screen bg-gray-50 dark:bg-navy-900 transition-colors duration-300">
      {/* Profile Section */}
      <ProfileSection 
        user={organization} 
        coverGradient="from-green-600 via-emerald-600 to-teal-700"
        type="organization"
      />

      {/* Main Content Dashboard Layout */}
      <div className="container mx-auto px-4 md:px-6 -mt-12 relative z-10 transition-all duration-500 ease-in-out">
        <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-xl dark:shadow-dark border border-gray-100 dark:border-navy-700 overflow-hidden flex flex-col min-h-[500px]">
          
          {/* Header Controls Area */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center bg-white dark:bg-navy-800 border-b border-gray-100 dark:border-navy-700">
            <div className="flex-1">
              <TabNavigation 
                activeTab={activeTab}
                onTabChange={setActiveTab}
                type="organization"
              />
            </div>
            
            <div className="flex items-center justify-end p-4 sm:p-0 sm:pr-6 bg-gray-50/50 sm:bg-transparent dark:bg-navy-800/50 sm:dark:bg-transparent">
              {activeTab === 'events' && (
                <Link
                  to="/events/create"
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md shadow-green-500/25 hover:shadow-lg hover:shadow-green-500/40 hover:-translate-y-0.5 font-semibold text-sm"
                >
                  <Plus className="h-5 w-5" />
                  Create New Event
                </Link>
              )}
            </div>
          </div>

          {/* Dynamic Content Area */}
          <div className="flex-1 bg-gray-50/30 dark:bg-navy-900/20">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDashboard;