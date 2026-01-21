import EventCard from "./EventCard";

const EventGrid = ({ events, clearFilters }) => {
  return (
    <>
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-navy-800 rounded-xl shadow-sm dark:shadow-dark mt-8">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">No Events Found</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We couldn't find any events matching your search criteria.
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </>
  );
};

export default EventGrid;