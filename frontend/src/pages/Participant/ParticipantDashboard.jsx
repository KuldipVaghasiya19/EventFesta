import { useState, useEffect } from 'react';
import { events } from '../../data/events';
import ProfileSection from '../../components/dashboard/ProfileSection';
import TabNavigation from '../../components/dashboard/TabNavigation';
import InterestsSection from '../../components/dashboard/InterestsSection';
import EventsSection from '../../components/dashboard/EventsSection';

const ParticipantDashboard = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [interests, setInterests] = useState(['React', 'JavaScript', 'Machine Learning', 'Web Development', 'AI']);

  // Mock user data
  const user = {
    name: "Sarah Johnson",
    role: "Computer Science Student",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    email: "sarah.johnson@university.edu",
    organization: "Stanford University"
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "My Dashboard - TechEvents";
  }, []);

  const handleUpdateInterests = (newInterests) => {
    setInterests(newInterests);
  };

  return (
    <div className="pt-20 pb-16 min-h-screen bg-slate-50">
      {/* Profile Section */}
      <ProfileSection 
        user={user} 
        type="participant"
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
              events={events}
              userType="participant"
            />
          ) : (
            <InterestsSection 
              interests={interests}
              onUpdateInterests={handleUpdateInterests}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantDashboard;