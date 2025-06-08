import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { events } from '../data/events';
import ProfileSection from '../components/dashboard/ProfileSection';
import TabNavigation from '../components/dashboard/TabNavigation';
import EventsSection from '../components/dashboard/EventsSection';

const OrganizationDashboard = () => {
  const [activeTab, setActiveTab] = useState('events');

  // Mock organization data
  const organization = {
    name: "TechConf Solutions",
    role: "Event Management & Technology Company",
    avatar: "https://images.pexels.com/photos/2977547/pexels-photo-2977547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    email: "contact@techconf.com",
    location: "San Francisco, CA",
    organization: "Founded 2020"
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Organization Dashboard - TechEvents";
  }, []);

  return (
    <div className="pt-20 pb-16 min-h-screen bg-slate-50">
      {/* Profile Section */}
      <ProfileSection 
        user={organization} 
        type="organization"
      />

      <div className="container mx-auto px-4 md:px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Tab Navigation with Create Button */}
          <div className="flex justify-between items-center bg-white rounded-t-xl shadow-sm border-b border-slate-200">
            <TabNavigation 
              activeTab={activeTab}
              onTabChange={setActiveTab}
              type="organization"
            />
            <div className="pr-8">
              <Link
                to="/events/create"
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm font-medium"
              >
                <Plus className="h-4 w-4" />
                Create New Event
              </Link>
            </div>
          </div>

          {/* Content */}
          <EventsSection 
            events={events}
            userType="organization"
          />
        </div>
      </div>
    </div>
  );
};

export default OrganizationDashboard;