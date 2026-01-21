const ErrorState = ({ error, onRetry }) => (
  <div className="container mx-auto px-4 md:px-6">
    <div className="text-center py-16 bg-white dark:bg-navy-800 rounded-xl shadow-sm dark:shadow-dark">
      <div className="text-5xl mb-4">⚠️</div>
      <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">Error Loading Events</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default ErrorState;