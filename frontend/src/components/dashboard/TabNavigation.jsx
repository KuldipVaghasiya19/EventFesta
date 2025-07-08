import { Calendar, Tag, QrCode, BarChart3 } from 'lucide-react';

const TabNavigation = ({ activeTab, onTabChange, type = "participant" }) => {
  const participantTabs = [
    { id: 'events', label: 'My Events', icon: Calendar },
    { id: 'interests', label: 'My Interests', icon: Tag }
  ];

  const organizationTabs = [
    { id: 'events', label: 'My Events', icon: Calendar },
    { id: 'attendance', label: 'Attendance', icon: QrCode },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const tabs = type === 'participant' ? participantTabs : organizationTabs;

  const handleTabClick = (tabId) => {
    console.log('Tab clicked:', tabId); // Debug log
    onTabChange(tabId);
  };

  return (
    <div className="bg-white rounded-t-xl shadow-sm border-b">
      <div className="container mx-auto px-8">
        <nav className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2 py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? type === 'participant' 
                      ? 'border-purple-500 text-purple-600 bg-purple-50'
                      : 'border-green-500 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;