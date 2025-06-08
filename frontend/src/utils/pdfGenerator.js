// PDF Generation utility for participant lists
import { events } from '../data/events';

// Mock participant data generator
const generateMockParticipants = (eventId, count) => {
  const firstNames = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Ashley', 'James', 'Amanda', 'Christopher', 'Stephanie', 'Daniel', 'Jennifer', 'Matthew', 'Lisa', 'Anthony', 'Michelle', 'Mark', 'Kimberly'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com', 'university.edu', 'tech.org'];
  const cities = ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Boston, MA', 'Chicago, IL', 'Los Angeles, CA', 'Denver, CO', 'Atlanta, GA', 'Miami, FL'];
  
  const participants = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domains[Math.floor(Math.random() * domains.length)]}`;
    const phone = `+1 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`;
    const location = cities[Math.floor(Math.random() * cities.length)];
    const attendeeCode = `${eventId.toUpperCase().slice(0, 3)}-${String(i + 1).padStart(4, '0')}`;
    
    participants.push({
      id: i + 1,
      name: `${firstName} ${lastName}`,
      email,
      phone,
      location,
      attendeeCode,
      registrationDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
    });
  }
  
  return participants;
};

// Generate HTML content for PDF
const generatePDFContent = (event, participants, organizationName) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Participant List - ${event.title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #1e293b;
          background: #ffffff;
        }
        
        .container {
          max-width: 210mm;
          margin: 0 auto;
          padding: 20mm;
          background: white;
        }
        
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 30px;
          border-bottom: 3px solid #0ea5e9;
          position: relative;
        }
        
        .header::before {
          content: '';
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 4px;
          background: linear-gradient(90deg, #0ea5e9, #06b6d4, #10b981);
          border-radius: 2px;
        }
        
        .logo {
          display: inline-block;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #0ea5e9, #06b6d4);
          border-radius: 12px;
          margin-bottom: 20px;
          position: relative;
        }
        
        .logo::after {
          content: 'TE';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-weight: bold;
          font-size: 24px;
        }
        
        .header h1 {
          font-size: 32px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }
        
        .header .subtitle {
          font-size: 18px;
          color: #64748b;
          font-weight: 500;
        }
        
        .event-info {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-radius: 16px;
          padding: 30px;
          margin-bottom: 40px;
          border: 1px solid #e2e8f0;
          position: relative;
          overflow: hidden;
        }
        
        .event-info::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #0ea5e9, #06b6d4, #10b981);
        }
        
        .event-info h2 {
          font-size: 28px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .event-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        
        .detail-icon {
          width: 20px;
          height: 20px;
          margin-right: 12px;
          color: #0ea5e9;
        }
        
        .detail-label {
          font-weight: 600;
          color: #475569;
          margin-right: 8px;
        }
        
        .detail-value {
          color: #1e293b;
          font-weight: 500;
        }
        
        .stats-section {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 30px;
          border: 1px solid #e2e8f0;
          text-align: center;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        
        .stat-item {
          padding: 16px;
          border-radius: 8px;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
        }
        
        .stat-number {
          font-size: 24px;
          font-weight: 700;
          color: #0ea5e9;
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
        }
        
        .participants-section h3 {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .participants-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .participants-table thead {
          background: linear-gradient(135deg, #0ea5e9, #06b6d4);
          color: white;
        }
        
        .participants-table th {
          padding: 16px 12px;
          text-align: left;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        
        .participants-table td {
          padding: 14px 12px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 14px;
        }
        
        .participants-table tbody tr:nth-child(even) {
          background: #f8fafc;
        }
        
        .participants-table tbody tr:hover {
          background: #f1f5f9;
        }
        
        .attendee-code {
          font-family: 'Courier New', monospace;
          background: #e0f2fe;
          color: #0369a1;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 12px;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #f1f5f9;
          text-align: center;
          color: #64748b;
        }
        
        .footer-info {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .footer-item {
          text-align: center;
        }
        
        .footer-label {
          font-weight: 600;
          color: #475569;
          margin-bottom: 4px;
        }
        
        .footer-value {
          color: #64748b;
        }
        
        .watermark {
          position: fixed;
          bottom: 20px;
          right: 20px;
          color: #cbd5e1;
          font-size: 12px;
          font-weight: 500;
        }
        
        @media print {
          .container {
            padding: 15mm;
          }
          
          .participants-table {
            page-break-inside: avoid;
          }
          
          .participants-table thead {
            display: table-header-group;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="logo"></div>
          <h1>TechEvents</h1>
          <div class="subtitle">Participant List Report</div>
        </div>
        
        <!-- Event Information -->
        <div class="event-info">
          <h2>${event.title}</h2>
          <div class="event-details">
            <div class="detail-item">
              <div class="detail-icon">📅</div>
              <span class="detail-label">Date:</span>
              <span class="detail-value">${new Date(event.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div class="detail-item">
              <div class="detail-icon">📍</div>
              <span class="detail-label">Location:</span>
              <span class="detail-value">${event.location}</span>
            </div>
            <div class="detail-item">
              <div class="detail-icon">🏢</div>
              <span class="detail-label">Organizer:</span>
              <span class="detail-value">${organizationName}</span>
            </div>
            <div class="detail-item">
              <div class="detail-icon">🎯</div>
              <span class="detail-label">Type:</span>
              <span class="detail-value">${event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
            </div>
          </div>
        </div>
        
        <!-- Statistics -->
        <div class="stats-section">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">${participants.length}</div>
              <div class="stat-label">Total Participants</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${event.maxParticipants}</div>
              <div class="stat-label">Max Capacity</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${Math.round((participants.length / event.maxParticipants) * 100)}%</div>
              <div class="stat-label">Capacity Filled</div>
            </div>
          </div>
        </div>
        
        <!-- Participants List -->
        <div class="participants-section">
          <h3>Registered Participants</h3>
          <table class="participants-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Participant Name</th>
                <th>Email Address</th>
                <th>Contact Number</th>
                <th>Location</th>
                <th>Attendee Code</th>
              </tr>
            </thead>
            <tbody>
              ${participants.map((participant, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td><strong>${participant.name}</strong></td>
                  <td>${participant.email}</td>
                  <td>${participant.phone}</td>
                  <td>${participant.location}</td>
                  <td><span class="attendee-code">${participant.attendeeCode}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <div class="footer-info">
            <div class="footer-item">
              <div class="footer-label">Report Generated</div>
              <div class="footer-value">${currentDate}</div>
            </div>
            <div class="footer-item">
              <div class="footer-label">Generated By</div>
              <div class="footer-value">${organizationName}</div>
            </div>
          </div>
          <p style="margin-top: 20px; font-size: 12px;">
            This report contains confidential participant information. Please handle with care and in accordance with privacy policies.
          </p>
        </div>
        
        <div class="watermark">Generated by TechEvents Platform</div>
      </div>
    </body>
    </html>
  `;
};

// Function to download PDF
export const downloadParticipantsPDF = (eventId, organizationName = "TechConf Solutions") => {
  // Find the event
  const event = events.find(e => e.id === eventId);
  if (!event) {
    console.error('Event not found');
    return;
  }

  // Generate mock participants
  const participants = generateMockParticipants(eventId, event.currentParticipants);
  
  // Generate HTML content
  const htmlContent = generatePDFContent(event, participants, organizationName);
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load, then trigger print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      // Close the window after printing (optional)
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    }, 500);
  };
};

// Alternative function for direct download (if browser supports it)
export const downloadParticipantsPDFDirect = async (eventId, organizationName = "TechConf Solutions") => {
  const event = events.find(e => e.id === eventId);
  if (!event) {
    console.error('Event not found');
    return;
  }

  const participants = generateMockParticipants(eventId, event.currentParticipants);
  const htmlContent = generatePDFContent(event, participants, organizationName);
  
  // Create blob and download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_participants_${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};