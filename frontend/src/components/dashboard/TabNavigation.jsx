import { Calendar, Tag } from 'lucide-react';

const TabNavigation = ({ activeTab, onTabChange, type = "participant" }) => {
  const participantTabs = [
    { id: 'events', label: 'My Events', icon: Calendar },
    { id: 'interests', label: 'My Interests', icon: Tag }
  ];

  const organizationTabs = [
    { id: 'events', label: 'My Events', icon: Calendar }
  ];

  const tabs = type === 'participant' ? participantTabs : organizationTabs;

  return (
    <div className="bg-white rounded-t-xl shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-8">
        <nav className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? type === 'participant' 
                      ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                      : 'border-emerald-500 text-emerald-600 bg-emerald-50'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
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