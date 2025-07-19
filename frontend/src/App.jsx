import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import EventsPage from './pages/Events/EventsPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import EventDetailPage from './pages/Events/EventDetailPage';
import EventRegistrationPage from './pages/Events/EventRegistrationPage';
import ParticipantDashboard from './pages/Participant/ParticipantDashboard';
import OrganizationDashboard from './pages/Organization/OrganizationDashboard';
import CreateEventPage from './pages/Events/CreateEventPage';
import OrganizationProfileUpdatePage from './pages/Organization/OrganizationProfileUpdatePage';
import ParticipantProfileUpdatePage from './pages/Participant/ParticipantProfileUpdatePage';
import ParticipantListPage from './pages/Organization/ParticipantListPage';

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
          <Route path="/events/:id/register" element={<EventRegistrationPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard/participant" element={<ParticipantDashboard />} />
          <Route path="/dashboard/organization" element={<OrganizationDashboard />} />
          <Route path="/dashboard/organization/profile/update" element={<OrganizationProfileUpdatePage />} />
          <Route path="/dashboard/participant/profile/update" element={<ParticipantProfileUpdatePage />} />
          <Route path="/events/:eventId/participants" element={<ParticipantListPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;