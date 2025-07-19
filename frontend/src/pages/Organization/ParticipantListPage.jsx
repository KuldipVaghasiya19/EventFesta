import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Search, Users } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { downloadParticipantsPDF } from '../../utils/pdfGenerator'; // Ensure this path is correct

const ParticipantListPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEventOver, setIsEventOver] = useState(false);

  useEffect(() => {
    const fetchEventAndParticipants = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:8080/api/organizations/events/${eventId}/participants`,{
          credentials:'include'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch event and participant data');
        }
        const data = await response.json();
        
        setEvent(data.event);
        setParticipants(data.participants || []);
        setFilteredParticipants(data.participants || []);

        if (data.event && data.event.eventDate) {
          setIsEventOver(new Date() >= new Date(data.event.eventDate));
        }

      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndParticipants();
  }, [eventId]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredParticipants(participants);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = participants.filter(p =>
      (p.name && p.name.toLowerCase().includes(term)) ||
      (p.email && p.email.toLowerCase().includes(term))
    );
    setFilteredParticipants(filtered);
  }, [searchTerm, participants]);

  const handleDownloadPDF = () => {
    if (event && participants) {
      const organizationName = event.organizer?.name || "EventFesta";
      downloadParticipantsPDF(event, participants, organizationName);
    } else {
      alert("Participant data is not available to download.");
    }
  };

  if (loading) {
    return (
      <div className="pt-20 pb-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 pb-16 min-h-screen bg-gray-50 text-center px-4">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Something Went Wrong</h1>
        <p className="text-gray-600">{error}</p>
        <Link to="/dashboard/organization" className="mt-6 inline-block px-6 py-2 bg-primary-500 text-white rounded-lg shadow hover:bg-primary-600 transition-colors">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <Link
              to="/dashboard/organization"
              className="flex items-center text-sm text-gray-600 hover:text-primary-500 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
            <button
              onClick={handleDownloadPDF}
              disabled={participants.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4" />
              Download List
            </button>
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900 truncate">
            Participants for: <span className="text-primary-500">{event?.title}</span>
          </h1>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition"
          />
        </div>

        {/* Participants Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredParticipants.length > 0 ? (
                filteredParticipants.map((participant, index) => (
                  <tr key={`${participant.id}-${index}`}> {/* ✅ FIX: Key is now guaranteed to be unique */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full object-cover" src={participant.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name)}&background=random`} alt={participant.name} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{participant.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{participant.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{participant.phone || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {isEventOver ? (participant.isPresent ? 'Present' : 'Absent') : ''}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">
                    <div className="text-center py-16 px-4">
                      <Users className="mx-auto h-12 w-12 text-gray-300" />
                      <h3 className="mt-2 text-lg font-medium text-gray-800">No Participants Found</h3>
                      <p className="mt-1 text-sm text-gray-500">No participants match your search, or no one has registered yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ParticipantListPage;