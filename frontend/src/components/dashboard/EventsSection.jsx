import { useState } from 'react';
import { Calendar, Clock, Archive, Eye, Download, Users, MapPin, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, count, subtitle, icon: Icon, color }) => {
  const colorClasses = {
    purple: 'border-l-purple-500 bg-purple-50',
    blue: 'border-l-blue-500 bg-blue-50', 
    green: 'border-l-green-500 bg-green-50'
  };

  const iconColors = {
    purple: 'text-purple-500 bg-purple-100',
    blue: 'text-blue-500 bg-blue-100',
    green: 'text-green-500 bg-green-100'
  };

  return (
    <div className={`p-6 rounded-xl border-l-4 ${colorClasses[color]} flex items-center gap-4`}>
      <div className={`p-3 rounded-full ${iconColors[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900">{count}</h3>
        <p className="font-medium text-gray-700">{title}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
};

const EmptyState = ({ userType, activeTab }) => {
  const getEmptyStateContent = () => {
    if (userType === 'organization') {
      return {
        icon: <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />,
        title: "No events found",
        subtitle: "You don't have any events yet.",
        buttonText: "Create New Event",
        buttonLink: "/events/create",
        buttonIcon: <Plus className="h-5 w-5 mr-2" />,
        buttonColor: "bg-green-500 hover:bg-green-600"
      };
    } else {
      return {
        icon: <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />,
        title: "No events found",
        subtitle: "You haven't registered for any events yet.",
        buttonText: "Browse Events",
        buttonLink: "/events",
        buttonIcon: <Search className="h-5 w-5 mr-2" />,
        buttonColor: "bg-primary-500 hover:bg-primary-600"
      };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className="text-center py-16">
      {content.icon}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{content.title}</h3>
      <p className="text-gray-600 mb-6">{content.subtitle}</p>
      <Link 
        to={content.buttonLink}
        className={`inline-flex items-center px-6 py-3 ${content.buttonColor} text-white font-medium rounded-lg transition-colors`}
      >
        {content.buttonIcon}
        {content.buttonText}
      </Link>
    </div>
  );
};

const EventsSection = ({ events, userType = "participant" }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const upcomingEvents = events.filter(event => new Date(event.eventDate) >= new Date());
  const registeredEvents = events;
  const pastEvents = events.filter(event => new Date(event.eventDate) < new Date());

  const getEventsForTab = () => {
    switch (activeTab) {
      case 'upcoming':
        return upcomingEvents;
      case 'registered':
        return registeredEvents;
      case 'past':
        return pastEvents;
      default:
        return [];
    }
  };

  const tabs = [
    { id: 'upcoming', label: 'Upcoming Events', count: upcomingEvents.length, icon: Clock },
    { id: 'registered', label: 'Registered Events', count: registeredEvents.length, icon: Calendar },
    { id: 'past', label: 'Past Events', count: pastEvents.length, icon: Archive }
  ];

  const downloadParticipantsPDF = (event) => {
    // Create a comprehensive PDF report for participants
    const reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Participants Report - ${event.title}</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: #f8fafc;
          }
          .container { 
            max-width: 800px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 12px; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header { 
            background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); 
            color: white; 
            padding: 30px; 
            text-align: center; 
          }
          .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
          .header h2 { margin: 10px 0 0 0; font-size: 20px; font-weight: 400; opacity: 0.9; }
          .header p { margin: 15px 0 0 0; opacity: 0.8; }
          .content { padding: 30px; }
          .event-info { 
            background: #f1f5f9; 
            padding: 20px; 
            border-radius: 8px; 
            margin-bottom: 30px;
            border-left: 4px solid #0ea5e9;
          }
          .event-info h3 { margin: 0 0 15px 0; color: #0f172a; font-size: 18px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .info-item { display: flex; align-items: center; }
          .info-label { font-weight: 600; color: #475569; margin-right: 8px; }
          .stats { 
            display: grid; 
            grid-template-columns: repeat(4, 1fr); 
            gap: 20px; 
            margin-bottom: 30px; 
          }
          .stat-card { 
            text-align: center; 
            padding: 20px; 
            background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); 
            border-radius: 12px;
            border: 1px solid #7dd3fc;
          }
          .stat-number { font-size: 32px; font-weight: 700; color: #0369a1; margin-bottom: 5px; }
          .stat-label { color: #0f172a; font-weight: 500; }
          .participants-section h3 { 
            color: #0f172a; 
            font-size: 20px; 
            margin-bottom: 20px; 
            padding-bottom: 10px;
            border-bottom: 2px solid #e2e8f0;
          }
          .participant { 
            border: 1px solid #e2e8f0; 
            margin-bottom: 20px; 
            padding: 20px; 
            border-radius: 12px;
            background: #fafafa;
            transition: all 0.3s ease;
          }
          .participant:hover { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
          .participant-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 15px; 
          }
          .participant-name { font-size: 18px; font-weight: 700; color: #0369a1; }
          .participant-status { 
            padding: 6px 12px; 
            border-radius: 20px; 
            font-size: 12px; 
            font-weight: 600; 
            text-transform: uppercase;
          }
          .status-confirmed { background: #dcfce7; color: #166534; }
          .status-pending { background: #fef3c7; color: #92400e; }
          .participant-details { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 12px; 
            margin-bottom: 15px;
          }
          .detail-item { font-size: 14px; }
          .detail-label { font-weight: 600; color: #475569; }
          .detail-value { color: #64748b; }
          .interests { margin-top: 15px; }
          .interests-label { font-weight: 600; color: #475569; margin-bottom: 8px; }
          .interest-tags { display: flex; flex-wrap: wrap; gap: 6px; }
          .interest-tag { 
            background: #ddd6fe; 
            color: #5b21b6; 
            padding: 4px 8px; 
            border-radius: 12px; 
            font-size: 12px; 
            font-weight: 500;
          }
          .footer { 
            margin-top: 40px; 
            text-align: center; 
            color: #64748b; 
            border-top: 2px solid #e2e8f0; 
            padding-top: 20px; 
            font-size: 14px;
          }
          .footer-logo { font-weight: 700; color: #0ea5e9; margin-bottom: 5px; }
          @media print {
            body { background: white; }
            .container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Participants Report</h1>
            <h2>${event.title}</h2>
            <p>Generated on ${new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
          
          <div class="content">
            <div class="event-info">
              <h3>📅 Event Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Event:</span>
                  <span>${event.title}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Date:</span>
                  <span>${new Date(event.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Location:</span>
                  <span>${event.location}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Capacity:</span>
                  <span>${event.maxParticipants} people</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Type:</span>
                  <span>${event.type}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Current Registration:</span>
                  <span>${event.currentParticipants}/${event.maxParticipants}</span>
                </div>
              </div>
            </div>
            
            <div class="stats">
              <div class="stat-card">
                <div class="stat-number">${event.currentParticipants}</div>
                <div class="stat-label">Total Registered</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${Math.floor(event.currentParticipants * 0.85)}</div>
                <div class="stat-label">Confirmed</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${Math.floor(event.currentParticipants * 0.15)}</div>
                <div class="stat-label">Pending</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${Math.floor((event.currentParticipants / event.maxParticipants) * 100)}%</div>
                <div class="stat-label">Capacity Filled</div>
              </div>
            </div>
            
            <div class="participants-section">
              <h3>👥 Participant Details</h3>
              
              <div class="participant">
                <div class="participant-header">
                  <div class="participant-name">John Doe</div>
                  <div class="participant-status status-confirmed">Confirmed</div>
                </div>
                <div class="participant-details">
                  <div class="detail-item">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">john.doe@example.com</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">+1 (555) 123-4567</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Organization:</span>
                    <span class="detail-value">Tech University</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Designation:</span>
                    <span class="detail-value">Computer Science Student</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">San Francisco, CA</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Registration Date:</span>
                    <span class="detail-value">October 15, 2024</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Ticket Type:</span>
                    <span class="detail-value">Student</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">T-shirt Size:</span>
                    <span class="detail-value">Medium</span>
                  </div>
                </div>
                <div class="interests">
                  <div class="interests-label">🏷️ Interests & Skills:</div>
                  <div class="interest-tags">
                    <span class="interest-tag">React</span>
                    <span class="interest-tag">JavaScript</span>
                    <span class="interest-tag">Machine Learning</span>
                    <span class="interest-tag">Web Development</span>
                  </div>
                </div>
              </div>

              <div class="participant">
                <div class="participant-header">
                  <div class="participant-name">Sarah Johnson</div>
                  <div class="participant-status status-confirmed">Confirmed</div>
                </div>
                <div class="participant-details">
                  <div class="detail-item">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">sarah.j@techcorp.com</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">+1 (555) 234-5678</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Organization:</span>
                    <span class="detail-value">TechCorp Inc.</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Designation:</span>
                    <span class="detail-value">Senior Developer</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">New York, NY</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Registration Date:</span>
                    <span class="detail-value">October 12, 2024</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Ticket Type:</span>
                    <span class="detail-value">Professional</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">T-shirt Size:</span>
                    <span class="detail-value">Small</span>
                  </div>
                </div>
                <div class="interests">
                  <div class="interests-label">🏷️ Interests & Skills:</div>
                  <div class="interest-tags">
                    <span class="interest-tag">Python</span>
                    <span class="interest-tag">Data Science</span>
                    <span class="interest-tag">Machine Learning</span>
                    <span class="interest-tag">AI</span>
                  </div>
                </div>
              </div>

              <div class="participant">
                <div class="participant-header">
                  <div class="participant-name">Michael Chen</div>
                  <div class="participant-status status-pending">Pending</div>
                </div>
                <div class="participant-details">
                  <div class="detail-item">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">michael.chen@startup.io</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">+1 (555) 345-6789</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Organization:</span>
                    <span class="detail-value">Startup.io</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Designation:</span>
                    <span class="detail-value">CTO</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">Austin, TX</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Registration Date:</span>
                    <span class="detail-value">October 10, 2024</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Ticket Type:</span>
                    <span class="detail-value">Professional</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">T-shirt Size:</span>
                    <span class="detail-value">Large</span>
                  </div>
                </div>
                <div class="interests">
                  <div class="interests-label">🏷️ Interests & Skills:</div>
                  <div class="interest-tags">
                    <span class="interest-tag">Blockchain</span>
                    <span class="interest-tag">Web3</span>
                    <span class="interest-tag">Startup</span>
                    <span class="interest-tag">Leadership</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-logo">TechEvents Platform</div>
              <p>This comprehensive report was generated automatically by our event management system.</p>
              <p>For support or questions, please contact our team at support@techevents.com</p>
              <p>© ${new Date().getFullYear()} TechEvents. All rights reserved.</p>
            </div>
          </div>
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

  return (
    <div className="bg-white">
      {/* Stats Cards */}
      <div className="p-8 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Total Events" 
            count="3" 
            subtitle="All registered events"
            icon={Calendar}
            color="purple"
          />
          <StatCard 
            title="Upcoming Events" 
            count="1" 
            subtitle="Events you'll attend"
            icon={Clock}
            color="blue"
          />
          <StatCard 
            title="Past Events" 
            count="2" 
            subtitle="Events you attended"
            icon={Archive}
            color="green"
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 px-8">
        <nav className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-4 text-sm font-medium border-b-2 mr-6 transition-colors ${
                  activeTab === tab.id
                    ? userType === 'participant'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Events Table */}
      <div className="p-8">
        <div className="overflow-hidden">
          {getEventsForTab().length > 0 ? (
            <>
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 py-3 px-4 bg-gray-50 rounded-t-lg text-sm font-medium text-gray-500 uppercase tracking-wider">
                <div className="col-span-4">Event</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-3">Location</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-1">Actions</div>
              </div>

              {/* Table Body */}
              <div className="bg-white border border-gray-200 rounded-b-lg">
                {getEventsForTab().map((event, index) => (
                  <div 
                    key={event.id} 
                    className={`grid grid-cols-12 gap-4 py-4 px-4 items-center hover:bg-gray-50 transition-colors ${
                      index !== getEventsForTab().length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="col-span-4 flex items-center gap-3">
                      <img 
                        src={event.imageUrl} 
                        alt={event.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Users className="h-3 w-3" />
                          <span>{event.currentParticipants} participants</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-sm text-gray-600">
                      {new Date(event.eventDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    
                    <div className="col-span-3 text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    
                    <div className="col-span-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {event.type}
                      </span>
                    </div>
                    
                    <div className="col-span-1 flex gap-2">
                      <Link 
                        to={`/events/${event.id}`}
                        className="text-blue-600 hover:text-blue-700"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      {userType === 'organization' && (
                        <>
                          <Link
                            to={`/participants/${event.id}`}
                            className="text-purple-600 hover:text-purple-700"
                            title="View Participants"
                          >
                            <Users className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => downloadParticipantsPDF(event)}
                            className="text-green-600 hover:text-green-700"
                            title="Download Participants PDF"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState userType={userType} activeTab={activeTab} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsSection;