import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Search, Filter, Users, Mail, Phone, MapPin, Calendar, FileText, Eye } from 'lucide-react';
import { events } from '../../data/events';

const ParticipantListPage = () => {
  const { eventId } = useParams();
  const event = events.find(e => e.id === eventId);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filteredParticipants, setFilteredParticipants] = useState([]);

  // Mock participant data
  const participants = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      organization: 'Tech University',
      designation: 'Computer Science Student',
      location: 'San Francisco, CA',
      registrationDate: '2024-10-15',
      status: 'confirmed',
      ticketType: 'Student',
      paymentStatus: 'paid',
      dietaryRestrictions: 'Vegetarian',
      tshirtSize: 'M',
      experience: 'Intermediate',
      interests: ['React', 'JavaScript', 'AI'],
      linkedinProfile: 'https://linkedin.com/in/johndoe',
      githubProfile: 'https://github.com/johndoe'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@techcorp.com',
      phone: '+1 (555) 234-5678',
      organization: 'TechCorp Inc.',
      designation: 'Senior Developer',
      location: 'New York, NY',
      registrationDate: '2024-10-12',
      status: 'confirmed',
      ticketType: 'Professional',
      paymentStatus: 'paid',
      dietaryRestrictions: 'None',
      tshirtSize: 'S',
      experience: 'Advanced',
      interests: ['Python', 'Machine Learning', 'Data Science'],
      linkedinProfile: 'https://linkedin.com/in/sarahjohnson',
      githubProfile: 'https://github.com/sarahjohnson'
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael.chen@startup.io',
      phone: '+1 (555) 345-6789',
      organization: 'Startup.io',
      designation: 'CTO',
      location: 'Austin, TX',
      registrationDate: '2024-10-10',
      status: 'pending',
      ticketType: 'Professional',
      paymentStatus: 'pending',
      dietaryRestrictions: 'Gluten-free',
      tshirtSize: 'L',
      experience: 'Expert',
      interests: ['Blockchain', 'Web3', 'Startup'],
      linkedinProfile: 'https://linkedin.com/in/michaelchen',
      githubProfile: 'https://github.com/michaelchen'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@university.edu',
      phone: '+1 (555) 456-7890',
      organization: 'State University',
      designation: 'PhD Student',
      location: 'Boston, MA',
      registrationDate: '2024-10-08',
      status: 'confirmed',
      ticketType: 'Student',
      paymentStatus: 'paid',
      dietaryRestrictions: 'Vegan',
      tshirtSize: 'M',
      experience: 'Intermediate',
      interests: ['Research', 'AI', 'Academia'],
      linkedinProfile: 'https://linkedin.com/in/emilydavis',
      githubProfile: 'https://github.com/emilydavis'
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david.w@freelance.com',
      phone: '+1 (555) 567-8901',
      organization: 'Freelancer',
      designation: 'Full Stack Developer',
      location: 'Seattle, WA',
      registrationDate: '2024-10-05',
      status: 'confirmed',
      ticketType: 'Professional',
      paymentStatus: 'paid',
      dietaryRestrictions: 'None',
      tshirtSize: 'XL',
      experience: 'Advanced',
      interests: ['Full Stack', 'DevOps', 'Cloud'],
      linkedinProfile: 'https://linkedin.com/in/davidwilson',
      githubProfile: 'https://github.com/davidwilson'
    }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `Participants - ${event?.title || 'Event'} - TechEvents`;
    filterParticipants();
  }, [searchTerm, filterStatus, event]);

  const filterParticipants = () => {
    let filtered = [...participants];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(participant => 
        participant.name.toLowerCase().includes(term) ||
        participant.email.toLowerCase().includes(term) ||
        participant.organization.toLowerCase().includes(term) ||
        participant.designation.toLowerCase().includes(term)
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(participant => participant.status === filterStatus);
    }
    
    setFilteredParticipants(filtered);
  };

  const exportToCSV = () => {
    const headers = [
      'Name', 'Email', 'Phone', 'Organization', 'Designation', 'Location',
      'Registration Date', 'Status', 'Ticket Type', 'Payment Status',
      'Dietary Restrictions', 'T-shirt Size', 'Experience Level', 'Interests'
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredParticipants.map(participant => [
        participant.name,
        participant.email,
        participant.phone,
        participant.organization,
        participant.designation,
        participant.location,
        participant.registrationDate,
        participant.status,
        participant.ticketType,
        participant.paymentStatus,
        participant.dietaryRestrictions,
        participant.tshirtSize,
        participant.experience,
        participant.interests.join('; ')
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
    // Create a comprehensive PDF report
    const reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Participant Report - ${event?.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0ea5e9; padding-bottom: 20px; }
          .event-info { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          .stats { display: flex; justify-content: space-around; margin-bottom: 30px; }
          .stat-card { text-align: center; padding: 15px; background: #e0f2fe; border-radius: 8px; }
          .participant { border: 1px solid #e2e8f0; margin-bottom: 15px; padding: 15px; border-radius: 8px; }
          .participant-header { font-weight: bold; color: #0369a1; margin-bottom: 10px; }
          .participant-details { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .detail-item { margin-bottom: 5px; }
          .label { font-weight: bold; color: #475569; }
          .status-confirmed { color: #059669; font-weight: bold; }
          .status-pending { color: #d97706; font-weight: bold; }
          .footer { margin-top: 40px; text-align: center; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Participant Report</h1>
          <h2>${event?.title || 'Event'}</h2>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="event-info">
          <h3>Event Information</h3>
          <p><strong>Event:</strong> ${event?.title}</p>
          <p><strong>Date:</strong> ${event ? new Date(event.date).toLocaleDateString() : 'N/A'}</p>
          <p><strong>Location:</strong> ${event?.location}</p>
          <p><strong>Total Capacity:</strong> ${event?.maxParticipants}</p>
        </div>
        
        <div class="stats">
          <div class="stat-card">
            <h3>${filteredParticipants.length}</h3>
            <p>Total Participants</p>
          </div>
          <div class="stat-card">
            <h3>${filteredParticipants.filter(p => p.status === 'confirmed').length}</h3>
            <p>Confirmed</p>
          </div>
          <div class="stat-card">
            <h3>${filteredParticipants.filter(p => p.status === 'pending').length}</h3>
            <p>Pending</p>
          </div>
          <div class="stat-card">
            <h3>${filteredParticipants.filter(p => p.paymentStatus === 'paid').length}</h3>
            <p>Paid</p>
          </div>
        </div>
        
        <h3>Participant Details</h3>
        ${filteredParticipants.map(participant => `
          <div class="participant">
            <div class="participant-header">${participant.name}</div>
            <div class="participant-details">
              <div class="detail-item"><span class="label">Email:</span> ${participant.email}</div>
              <div class="detail-item"><span class="label">Phone:</span> ${participant.phone}</div>
              <div class="detail-item"><span class="label">Organization:</span> ${participant.organization}</div>
              <div class="detail-item"><span class="label">Designation:</span> ${participant.designation}</div>
              <div class="detail-item"><span class="label">Location:</span> ${participant.location}</div>
              <div class="detail-item"><span class="label">Registration Date:</span> ${participant.registrationDate}</div>
              <div class="detail-item"><span class="label">Status:</span> <span class="status-${participant.status}">${participant.status.toUpperCase()}</span></div>
              <div class="detail-item"><span class="label">Ticket Type:</span> ${participant.ticketType}</div>
              <div class="detail-item"><span class="label">Payment:</span> ${participant.paymentStatus}</div>
              <div class="detail-item"><span class="label">T-shirt Size:</span> ${participant.tshirtSize}</div>
              <div class="detail-item"><span class="label">Experience:</span> ${participant.experience}</div>
              <div class="detail-item"><span class="label">Dietary Restrictions:</span> ${participant.dietaryRestrictions}</div>
            </div>
            <div style="margin-top: 10px;"><span class="label">Interests:</span> ${participant.interests.join(', ')}</div>
          </div>
        `).join('')}
        
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
          <Link 
            to="/dashboard/organization" 
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Dashboard
          </Link>
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
            <Link 
              to="/dashboard/organization"
              className="flex items-center text-gray-600 hover:text-primary-500 transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Dashboard
            </Link>
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
                    {new Date(event.date).toLocaleDateString()}
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
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {participants.filter(p => p.status === 'confirmed').length}
                </h3>
                <p className="text-gray-600">Confirmed</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 text-orange-600 p-3 rounded-full mr-4">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {participants.filter(p => p.status === 'pending').length}
                </h3>
                <p className="text-gray-600">Pending</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-full mr-4">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {participants.filter(p => p.paymentStatus === 'paid').length}
                </h3>
                <p className="text-gray-600">Paid</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search participants by name, email, organization..."
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              />
            </div>
            
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors bg-white"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
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
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">{participant.name}</h4>
                          <p className="text-primary-600">{participant.designation}</p>
                          <p className="text-gray-600">{participant.organization}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            participant.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {participant.status.toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            participant.paymentStatus === 'paid' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {participant.paymentStatus.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          <a href={`mailto:${participant.email}`} className="hover:text-primary-600 transition-colors">
                            {participant.email}
                          </a>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          <a href={`tel:${participant.phone}`} className="hover:text-primary-600 transition-colors">
                            {participant.phone}
                          </a>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          {participant.location}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          Registered: {participant.registrationDate}
                        </div>
                        <div className="text-gray-600">
                          <span className="font-medium">Ticket:</span> {participant.ticketType}
                        </div>
                        <div className="text-gray-600">
                          <span className="font-medium">T-shirt:</span> {participant.tshirtSize}
                        </div>
                        <div className="text-gray-600">
                          <span className="font-medium">Experience:</span> {participant.experience}
                        </div>
                        <div className="text-gray-600">
                          <span className="font-medium">Diet:</span> {participant.dietaryRestrictions}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Interests:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {participant.interests.map((interest, index) => (
                              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {(participant.linkedinProfile || participant.githubProfile) && (
                        <div className="mt-4 flex gap-4">
                          {participant.linkedinProfile && (
                            <a 
                              href={participant.linkedinProfile} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              LinkedIn
                            </a>
                          )}
                          {participant.githubProfile && (
                            <a 
                              href={participant.githubProfile} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-700 hover:text-gray-900 text-sm flex items-center"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              GitHub
                            </a>
                          )}
                        </div>
                      )}
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
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
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

export default ParticipantListPage;