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

    const userData = getOrganizationData();
    
    if (userData) {
      // Verify it's an organization user
      if (userData.role === 'ORGANIZATION') {
        // Transform backend data to match component expectations
        const transformedData = {
          id: userData.id,
          name: userData.name,
          role: userData.type || 'Organization',
          avatar: userData.profileImageUrl || 'https://images.pexels.com/photos/2977547/pexels-photo-2977547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          email: userData.email,
          location: userData.location,
          organization: userData.since ? `Founded ${userData.since}` : 'Organization',
          about: userData.about,
          contact: userData.contact,
          totalOrganizedEvents: userData.totalOrganizedEvents || 0,
          type: userData.type,
          profileImagePublicId: userData.profileImagePublicId
        };
        
        setOrganization(transformedData);
        
        // Set the organization's events
        if (userData.organizedEvents && Array.isArray(userData.organizedEvents)) {
          // Transform events to match your component's expected format
          const transformedEvents = userData.organizedEvents.map(event => ({
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
            // Add any other fields your components expect
            organizer: {
              id: userData.id,
              name: userData.name,
              avatar: userData.profileImageUrl
            }
          }));
          
          setOrganizationEvents(transformedEvents);
        } else {
          setOrganizationEvents([]);
        }
        
        document.title = `${userData.name} Dashboard - TechEvents`;
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
      <div className="pt-20 pb-16 min-h-screen bg-gray-50 dark:bg-navy-900 transition-colors duration-300">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  // Show error if no organization data
  if (!organization) {
    return (
      <div className="pt-20 pb-16 min-h-screen bg-gray-50 dark:bg-navy-900 transition-colors duration-300">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Unable to load organization data</p>
            <Link 
              to="/login?role=organization"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'events':
        return (
          <EventsSection 
            events={organizationEvents} 
            userType="organization" 
            organization={organization} 
          />
        );
      case 'attendance':
        return (
          <AttendanceSection 
            events={organizationEvents} 
            organization={organization} 
          />
        );
      case 'analytics':
        return (
          <AnalyticsSection 
            events={organizationEvents} 
            organization={organization} 
          />
        );
      default:
        return (
          <EventsSection 
            events={organizationEvents} 
            userType="organization" 
            organization={organization} 
          />
        );
    }
  };

  return (
    <div className="pt-20 pb-16 min-h-screen bg-gray-50 dark:bg-navy-900 transition-colors duration-300">
      {/* Profile Section */}
      <ProfileSection 
        user={organization} 
        coverGradient="from-green-600 to-blue-700"
        type="organization"
      />

      <div className="container mx-auto px-4 md:px-6 -mt-8 relative z-10">
        <div className="bg-white dark:bg-navy-800 rounded-xl shadow-sm dark:shadow-dark overflow-hidden">
          {/* Tab Navigation with Action Buttons */}
          <div className="flex justify-between items-center bg-white dark:bg-navy-800 rounded-t-xl shadow-sm border-b dark:border-navy-600">
            <TabNavigation 
              activeTab={activeTab}
              onTabChange={setActiveTab}
              type="organization"
            />
            
            <div className="flex items-center gap-3 px-6 py-3">
              {activeTab === 'events' && (
                <Link
                  to="/events/create"
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm font-medium"
                >
                  <Plus className="h-4 w-4" />
                  Create New Event
                </Link>
              )}
              
              <Link
                to="/organization/settings"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-navy-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-navy-600 transition-colors"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </div>
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default OrganizationDashboard;