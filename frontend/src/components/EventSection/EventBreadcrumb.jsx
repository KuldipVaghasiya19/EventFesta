// components/EventBreadcrumb.jsx
import { Link } from 'react-router-dom';

const EventBreadcrumb = ({ eventTitle }) => {
  return (
    <div className="mb-6 text-sm text-gray-600 flex items-center space-x-2">
      <Link to="/" className="hover:text-primary-500">Home</Link>
      <span>/</span>
      <Link to="/events" className="hover:text-primary-500">Events</Link>
      <span>/</span>
      <span className="text-primary-500">{eventTitle}</span>
    </div>
  );
};

export default EventBreadcrumb;