// components/EventTabs.jsx
import { useState } from 'react';
import OverviewTab from './OverviewTab';
import ScheduleTab from './ScheduleTab';
import SpeakersTab from './SpeakersTab';


const EventTabs = ({ event }) => {
  const [selectedTab, setSelectedTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', component: OverviewTab },
    { id: 'schedule', label: 'Schedule', component: ScheduleTab },
    { id: 'speakers', label: 'Speakers', component: SpeakersTab }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === selectedTab)?.component;

  return (
    <div className="bg-white rounded-xl shadow-md mb-8">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                selectedTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6 md:p-8">
        <ActiveComponent event={event} />
      </div>
    </div>
  );
};

export default EventTabs;