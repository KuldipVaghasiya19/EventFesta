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
    <div className="w-full overflow-x-auto hide-scrollbar border-b border-gray-100 dark:border-navy-700 bg-white/50 dark:bg-navy-800/50 backdrop-blur-md">
      <div className="flex px-4 sm:px-6 gap-3 py-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          // Thematic styling based on user type
          const activeClasses = type === 'participant' 
            ? 'bg-purple-50 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 shadow-sm ring-1 ring-purple-200 dark:ring-purple-500/30' 
            : 'bg-green-50 text-green-700 dark:bg-green-500/20 dark:text-green-300 shadow-sm ring-1 ring-green-200 dark:ring-green-500/30';
            
          const inactiveClasses = 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/80 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-navy-700/50 border border-transparent';

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-2.5 py-2.5 px-5 text-sm font-semibold rounded-xl transition-all duration-300 ease-out whitespace-nowrap ${
                isActive ? activeClasses : inactiveClasses
              }`}
            >
              <Icon 
                className={`h-4 w-4 transition-transform duration-300 ${
                  isActive ? 'scale-110' : 'scale-100 opacity-70'
                }`} 
              />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;