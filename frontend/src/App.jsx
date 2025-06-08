import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import EventDetailPage from './pages/EventDetailPage';
import ParticipantDashboard from './pages/ParticipantDashboard';
import OrganizationDashboard from './pages/OrganizationDashboard';
import CreateEventPage from './pages/CreateEventPage';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/create" element={<CreateEventPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard/participant" element={<ParticipantDashboard />} />
          <Route path="/dashboard/organization" element={<OrganizationDashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;