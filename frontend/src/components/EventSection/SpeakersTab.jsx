// components/SpeakersTab.jsx
const SpeakersTab = ({ event }) => {
  return (
    <>
      <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Event Speakers</h2>
      {event.speakers && event.speakers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {event.speakers.map((speaker, idx) => (
            <div key={idx} className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-xl text-gray-900">{speaker.name}</h3>
              <p className="text-gray-500">{speaker.company}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center py-8">Speakers will be announced soon.</p>
      )}
    </>
  );
};

export default SpeakersTab;