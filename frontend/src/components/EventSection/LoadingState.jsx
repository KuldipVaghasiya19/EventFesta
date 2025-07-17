// components/LoadingState.jsx
const LoadingState = () => {
  return (
    <div className="pt-20 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto mb-8"></div>
          <div className="h-64 bg-gray-300 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;