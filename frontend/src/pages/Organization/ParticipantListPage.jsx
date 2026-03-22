import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Search, Users, Calendar } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { downloadParticipantsPDF } from '../../utils/pdfGenerator'; 

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
        
        const token = localStorage.getItem('techevents_token') || sessionStorage.getItem('techevents_token');
        
        const response = await fetch(`http://localhost:8080/api/organizations/events/${eventId}/participants`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include' // This is all Spring Security needs!
        });
        
        const rawData = await response.json();
        console.log("Raw Backend Response:", rawData); // Debug log to check incoming data

        if (!response.ok || rawData.success === false) {
          throw new Error(rawData.message || 'Failed to fetch event and participant data');
        }
        
        // Explicitly target the "data" object from your JSON response
        const dataPayload = rawData.data;
        
        if (dataPayload) {
          console.log("Extracted Participants:", dataPayload.participants); // Debug log
          
          setEvent(dataPayload.event || null);
          setParticipants(dataPayload.participants || []);
          setFilteredParticipants(dataPayload.participants || []);

          if (dataPayload.event && dataPayload.event.eventDate) {
            setIsEventOver(new Date() >= new Date(dataPayload.event.eventDate));
          }
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
    if (event && participants.length > 0) {
      const organizationName = event.organizer?.name || "EventFesta";
      downloadParticipantsPDF(event, participants, organizationName);
    } else {
      alert("Participant data is not available to download.");
    }
  };

  if (loading) {
    return (
      <div className="pt-20 pb-16 min-h-screen bg-gray-50 dark:bg-navy-900 transition-colors duration-300 flex items-center justify-center">
        <div className="bg-white dark:bg-navy-800 p-8 rounded-2xl shadow-xl flex flex-col items-center space-y-4 border border-gray-100 dark:border-navy-700">
          <div className="relative">
            <div className="animate-spin rounded-full h-14 w-14 border-y-2 border-green-500"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 bg-green-100 dark:bg-green-900/30 rounded-full"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 font-medium animate-pulse">Loading participants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 pb-16 min-h-screen bg-gray-50 dark:bg-navy-900 transition-colors duration-300 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-navy-800 p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-gray-100 dark:border-navy-700">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something Went Wrong</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Link 
            to="/dashboard/organization" 
            className="inline-flex px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-gray-50 dark:bg-navy-900 min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        
        {/* Header Section */}
        <div className="bg-white dark:bg-navy-800 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-navy-700 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-green-500/10 dark:bg-green-500/5 rounded-full blur-3xl"></div>
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
            <Link
              to="/dashboard/organization"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors bg-gray-100/50 dark:bg-navy-900/50 px-4 py-2 rounded-lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            
            <button
              onClick={handleDownloadPDF}
              disabled={participants.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-semibold rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 hover:-translate-y-0.5"
            >
              <Download className="h-4 w-4" />
              Export PDF List
            </button>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">
              Event Roster
            </h1>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm text-gray-600 dark:text-gray-400 font-medium">
              <span className="flex items-center gap-1.5 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 px-3 py-1 rounded-md w-fit">
                <Calendar className="h-4 w-4" />
                {event?.title || 'Loading Event...'}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {participants.length} Total Registrations
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar & Stats */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search participants by name or email..."
              className="pl-12 pr-4 py-3.5 w-full bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-600 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none text-gray-800 dark:text-gray-200 shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Participants Table */}
        <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-xl dark:shadow-dark border border-gray-100 dark:border-navy-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-navy-700">
              <thead className="bg-gray-50/80 dark:bg-navy-900/50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Participant Name</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email Address</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact Info</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-navy-800 divide-y divide-gray-100 dark:divide-navy-700">
                {filteredParticipants.length > 0 ? (
                  filteredParticipants.map((participant, index) => (
                    <tr key={`${participant.id || index}`} className="hover:bg-gray-50 dark:hover:bg-navy-700/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-11 w-11 relative">
                            <img 
                              className="h-11 w-11 rounded-xl object-cover border border-gray-200 dark:border-navy-600 shadow-sm group-hover:shadow transition-shadow" 
                              src={participant.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name || 'User')}&background=random`} 
                              alt={participant.name || 'Participant'} 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-gray-900 dark:text-white">{participant.name || 'Unknown User'}</div>
                            {/* FIX: Changed from participant.university to participant.location based on your JSON */}
                            {participant.location && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">{participant.location}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{participant.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{participant.phone || 'Not Provided'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEventOver ? (
                          participant.isPresent ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border border-green-200 dark:border-green-500/30">
                              Checked In
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border border-red-200 dark:border-red-500/30">
                              Absent
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
                            Pending Check-in
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">
                      <div className="text-center py-20 px-4">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-navy-900 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Participants Found</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                          {searchTerm ? "No participants match your search criteria. Try a different term." : "There are currently no participants registered for this event."}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ParticipantListPage;