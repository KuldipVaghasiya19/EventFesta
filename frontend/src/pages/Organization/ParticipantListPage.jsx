import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Search, Users, Mail, MapPin, GraduationCap, FileText, Calendar } from 'lucide-react';

const ParticipantListComponent = ({ eventId, onBack }) => {
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEventAndParticipants();
  }, [eventId]);

  useEffect(() => {
    filterParticipants();
  }, [searchTerm, participants]);

  const fetchEventAndParticipants = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user token from localStorage or sessionStorage
      const user = JSON.parse(localStorage.getItem('techevents_user') || sessionStorage.getItem('techevents_user'));
      const token = user?.token;
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch event details with participants
      const response = await fetch(`/api/events/${eventId}/participants`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch event participants');
      }

      const data = await response.json();
      setEvent(data.event);
      setParticipants(data.participants || []);
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching participants:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterParticipants = () => {
    if (!searchTerm) {
      setFilteredParticipants(participants);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = participants.filter(participant => 
      participant.name.toLowerCase().includes(term) ||
      participant.email.toLowerCase().includes(term) ||
      participant.course.toLowerCase().includes(term) ||
      participant.university.toLowerCase().includes(term)
    );
    
    setFilteredParticipants(filtered);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Course', 'University'];
    
    const csvContent = [
      headers.join(','),
      ...filteredParticipants.map(participant => [
        participant.name,
        participant.email,
        participant.course,
        participant.university
      ].map(field => `"${field}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${event?.title || 'event'}-participants.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Participant List - ${event?.title}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            line-height: 1.6;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #0ea5e9; 
            padding-bottom: 20px; 
          }
          .event-info { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 8px; 
            margin-bottom: 30px; 
          }
          .stats { 
            display: flex; 
            justify-content: space-around; 
            margin-bottom: 30px; 
          }
          .stat-card { 
            text-align: center; 
            padding: 15px; 
            background: #e0f2fe; 
            border-radius: 8px; 
            min-width: 120px;
          }
          .participant-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          .participant-table th,
          .participant-table td {
            border: 1px solid #e2e8f0;
            padding: 12px;
            text-align: left;
          }
          .participant-table th {
            background: #f1f5f9;
            font-weight: bold;
            color: #0369a1;
          }
          .participant-table tr:nth-child(even) {
            background: #f8fafc;
          }
          .footer { 
            margin-top: 40px; 
            text-align: center; 
            color: #64748b; 
            border-top: 1px solid #e2e8f0; 
            padding-top: 20px; 
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Participant List</h1>
          <h2>${event?.title || 'Event'}</h2>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="event-info">
          <h3>Event Information</h3>
          <p><strong>Event:</strong> ${event?.title}</p>
          <p><strong>Date:</strong> ${event?.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'N/A'}</p>
          <p><strong>Location:</strong> ${event?.location || 'N/A'}</p>
          <p><strong>Total Participants:</strong> ${filteredParticipants.length}</p>
        </div>
        
        <div class="stats">
          <div class="stat-card">
            <h3>${filteredParticipants.length}</h3>
            <p>Total Participants</p>
          </div>
          <div class="stat-card">
            <h3>${filteredParticipants.filter(p => p.currentlyStudyingOrNot).length}</h3>
            <p>Currently Studying</p>
          </div>
          <div class="stat-card">
            <h3>${[...new Set(filteredParticipants.map(p => p.university))].length}</h3>
            <p>Universities</p>
          </div>
          <div class="stat-card">
            <h3>${[...new Set(filteredParticipants.map(p => p.course))].length}</h3>
            <p>Courses</p>
          </div>
        </div>
        
        <h3>Participant Details</h3>
        <table class="participant-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>University</th>
            </tr>
          </thead>
          <tbody>
            ${filteredParticipants.map(participant => `
              <tr>
                <td>${participant.name}</td>
                <td>${participant.email}</td>
                <td>${participant.course}</td>
                <td>${participant.university}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>This report was generated by TechEvents platform</p>
          <p>For more information, visit our website or contact support</p>
        </div>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(reportContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  if (loading) {
    return (
      <div className="pt-20 pb-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 py-16">
          <div className="flex items-center justify-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 pb-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Error Loading Participants
          </h1>
          <p className="text-lg text-gray-600 mb-8">{error}</p>
          <button 
            onClick={onBack}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="pt-20 pb-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Event Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            We couldn't find the event you're looking for.
          </p>
          <button 
            onClick={onBack}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button 
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-primary-500 transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Dashboard
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                  Participants - <span className="text-primary-500">{event.title}</span>
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(event.eventDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {event.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {filteredParticipants.length} participants
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex gap-3">
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
                <button
                  onClick={exportToPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full mr-4">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{filteredParticipants.length}</h3>
                <p className="text-gray-600">Total Participants</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-100 text-green-600 p-3 rounded-full mr-4">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {participants.filter(p => p.currentlyStudyingOrNot).length}
                </h3>
                <p className="text-gray-600">Currently Studying</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-full mr-4">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {[...new Set(participants.map(p => p.university))].length}
                </h3>
                <p className="text-gray-600">Universities</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 text-orange-600 p-3 rounded-full mr-4">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {[...new Set(participants.map(p => p.course))].length}
                </h3>
                <p className="text-gray-600">Different Courses</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search participants by name, email, course, or university..."
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Participants List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Participant Details</h3>
          </div>
          
          {filteredParticipants.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredParticipants.map((participant) => (
                <div key={participant.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                          {participant.profileImageUrl ? (
                            <img 
                              src={participant.profileImageUrl} 
                              alt={participant.name}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-primary-600 font-medium text-lg">
                              {participant.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-lg font-semibold text-gray-900">{participant.name}</h4>
                        <div className="mt-1 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            <a href={`mailto:${participant.email}`} className="hover:text-primary-600 transition-colors">
                              {participant.email}
                            </a>
                          </div>
                          <div className="flex items-center">
                            <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
                            {participant.course}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            {participant.university}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        participant.currentlyStudyingOrNot 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {participant.currentlyStudyingOrNot ? 'Currently Studying' : 'Not Studying'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {participant.totaleventsRegisterd || 0} events attended
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No participants found</h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Try adjusting your search criteria.' 
                  : 'No participants have registered for this event yet.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantListComponent;