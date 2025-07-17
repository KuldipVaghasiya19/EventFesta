// components/ScheduleTab.jsx
const ScheduleTab = ({ event }) => {
  return (
    <>
      <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Event Schedule</h2>
      {event.schedule && event.schedule.length > 0 ? (
        <div className="space-y-6">
          {event.schedule.map((session, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-6">
              <div className="flex flex-col md:flex-row md:justify-between mb-2">
                <h3 className="text-lg font-bold">{session.title}</h3>
                <span className="text-primary-600 font-medium">{session.time}</span>
              </div>
              <p className="text-gray-600">Speaker: {session.speaker}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center py-8">Schedule will be updated soon.</p>
      )}
    </>
  );
};

export default ScheduleTab;// components/ScheduleTab.jsx
