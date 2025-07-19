import React from 'react';

// Enhanced styles with better typography and visual hierarchy
const styles = {
  container: {
    padding: '40px',
    backgroundColor: '#fff',
    color: '#2c3e50',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    lineHeight: '1.6',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  
  mainTitle: {
    textAlign: 'center',
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '40px',
    color: '#2c3e50',
    borderBottom: '3px solid #3498db',
    paddingBottom: '15px',
    letterSpacing: '-0.5px',
  },
  
  section: {
    marginBottom: '35px',
    padding: '25px',
    border: '1px solid #e8ecf0',
    borderRadius: '12px',
    backgroundColor: '#fafbfc',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    pageBreakInside: 'avoid',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#34495e',
    borderLeft: '4px solid #3498db',
    paddingLeft: '15px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  overviewList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
  },
  
  overviewItem: {
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid #e1e8ed',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  
  overviewLabel: {
    display: 'block',
    fontSize: '14px',
    color: '#657786',
    fontWeight: '500',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  overviewValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2c3e50',
  },
  
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  
  tableHeader: {
    border: 'none',
    padding: '16px 12px',
    textAlign: 'left',
    backgroundColor: '#3498db',
    color: '#fff',
    fontWeight: '600',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  tableCell: {
    border: 'none',
    padding: '14px 12px',
    borderBottom: '1px solid #e8ecf0',
    fontSize: '14px',
  },
  
  tableRow: {
    transition: 'background-color 0.2s ease',
  },
  
  fillRateHigh: {
    color: '#27ae60',
    fontWeight: '600',
  },
  
  fillRateMedium: {
    color: '#f39c12',
    fontWeight: '600',
  },
  
  fillRateLow: {
    color: '#e74c3c',
    fontWeight: '600',
  },
};

const AnalyticsReportGenerator = React.forwardRef(({ analyticsData }, ref) => {
  if (!analyticsData) {
    return (
      <div style={styles.container}>
        <p style={{ textAlign: 'center', color: '#657786' }}>
          No analytics data available
        </p>
      </div>
    );
  }

  const getFillRateStyle = (fillRate) => {
    if (fillRate >= 80) return styles.fillRateHigh;
    if (fillRate >= 60) return styles.fillRateMedium;
    return styles.fillRateLow;
  };

  return (
    <div ref={ref} style={styles.container}>
      <h1 style={styles.mainTitle}>Analytics Report</h1>

      {/* Enhanced Overview Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Executive Summary</h2>
        <ul style={styles.overviewList}>
          <li style={styles.overviewItem}>
            <span style={styles.overviewLabel}>Total Events</span>
            <div style={styles.overviewValue}>
              {analyticsData.overview.totalEvents.toLocaleString()}
            </div>
          </li>
          <li style={styles.overviewItem}>
            <span style={styles.overviewLabel}>Total Participants</span>
            <div style={styles.overviewValue}>
              {analyticsData.overview.totalParticipants.toLocaleString()}
            </div>
          </li>
          <li style={styles.overviewItem}>
            <span style={styles.overviewLabel}>Attendance Rate</span>
            <div style={styles.overviewValue}>
              {analyticsData.overview.attendanceRate}%
            </div>
          </li>
          <li style={styles.overviewItem}>
            <span style={styles.overviewLabel}>Avg. Participants/Event</span>
            <div style={styles.overviewValue}>
              {analyticsData.overview.avgParticipantsPerEvent}
            </div>
          </li>
        </ul>
      </div>

      {/* Enhanced Event Performance Table */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Event Performance Analysis</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Event Name</th>
                <th style={styles.tableHeader}>Type</th>
                <th style={styles.tableHeader}>Participants</th>
                <th style={styles.tableHeader}>Capacity</th>
                <th style={styles.tableHeader}>Fill Rate</th>
                <th style={styles.tableHeader}>Location</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.eventPerformance.map((event, index) => {
                const fillRate = event.maxParticipants > 0 
                  ? ((event.participants / event.maxParticipants) * 100).toFixed(1)
                  : 0;
                
                return (
                  <tr 
                    key={index} 
                    style={{
                      ...styles.tableRow,
                      backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa',
                    }}
                  >
                    <td style={{ ...styles.tableCell, fontWeight: '600' }}>
                      {event.name}
                    </td>
                    <td style={styles.tableCell}>
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: '#ecf0f1',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        textTransform: 'uppercase',
                      }}>
                        {event.type}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      {event.participants.toLocaleString()}
                    </td>
                    <td style={styles.tableCell}>
                      {event.maxParticipants.toLocaleString()}
                    </td>
                    <td style={{ ...styles.tableCell, ...getFillRateStyle(parseFloat(fillRate)) }}>
                      {fillRate}%
                    </td>
                    <td style={styles.tableCell}>{event.location}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Monthly Trends Table */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Monthly Participation Trends</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Month</th>
                <th style={styles.tableHeader}>Total Participants</th>
                <th style={styles.tableHeader}>Present</th>
                <th style={styles.tableHeader}>Absent</th>
                <th style={styles.tableHeader}>Attendance Rate</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.monthlyTrends.map((month, index) => {
                const attendanceRate = month.participants > 0 
                  ? ((month.present / month.participants) * 100).toFixed(1)
                  : 0;
                
                return (
                  <tr 
                    key={index}
                    style={{
                      ...styles.tableRow,
                      backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa',
                    }}
                  >
                    <td style={{ ...styles.tableCell, fontWeight: '600' }}>
                      {month.month}
                    </td>
                    <td style={styles.tableCell}>
                      {month.participants.toLocaleString()}
                    </td>
                    <td style={{ ...styles.tableCell, color: '#27ae60', fontWeight: '600' }}>
                      {month.present.toLocaleString()}
                    </td>
                    <td style={{ ...styles.tableCell, color: '#e74c3c', fontWeight: '600' }}>
                      {month.absent.toLocaleString()}
                    </td>
                    <td style={{ ...styles.tableCell, ...getFillRateStyle(parseFloat(attendanceRate)) }}>
                      {attendanceRate}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Enhanced Tag Distribution Table */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Popular Event Categories</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Tag</th>
                <th style={styles.tableHeader}>Count</th>
                <th style={styles.tableHeader}>Percentage</th>
                <th style={styles.tableHeader}>Popularity</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.tagDistribution.map((tag, index) => (
                <tr 
                  key={index}
                  style={{
                    ...styles.tableRow,
                    backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa',
                  }}
                >
                  <td style={{ ...styles.tableCell, fontWeight: '600' }}>
                    #{tag.tag}
                  </td>
                  <td style={styles.tableCell}>
                    {tag.count.toLocaleString()}
                  </td>
                  <td style={styles.tableCell}>
                    {tag.percentage}%
                  </td>
                  <td style={styles.tableCell}>
                    <div style={{
                      width: '100%',
                      backgroundColor: '#ecf0f1',
                      borderRadius: '10px',
                      height: '8px',
                      position: 'relative',
                    }}>
                      <div style={{
                        width: `${tag.percentage}%`,
                        backgroundColor: '#3498db',
                        height: '100%',
                        borderRadius: '10px',
                        transition: 'width 0.3s ease',
                      }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Event Type Distribution Table */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Event Type Distribution</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Event Type</th>
                <th style={styles.tableHeader}>Count</th>
                <th style={styles.tableHeader}>Percentage</th>
                <th style={styles.tableHeader}>Distribution</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.typeDistribution.map((type, index) => (
                <tr 
                  key={index}
                  style={{
                    ...styles.tableRow,
                    backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa',
                  }}
                >
                  <td style={styles.tableCell}>
                    <span style={{
                      padding: '6px 12px',
                      backgroundColor: '#3498db',
                      color: '#fff',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                    }}>
                      {type.type}
                    </span>
                  </td>
                  <td style={{ ...styles.tableCell, fontWeight: '600' }}>
                    {type.count.toLocaleString()}
                  </td>
                  <td style={styles.tableCell}>
                    {type.percentage}%
                  </td>
                  <td style={styles.tableCell}>
                    <div style={{
                      width: '100%',
                      backgroundColor: '#ecf0f1',
                      borderRadius: '10px',
                      height: '8px',
                      position: 'relative',
                    }}>
                      <div style={{
                        width: `${type.percentage}%`,
                        backgroundColor: '#2ecc71',
                        height: '100%',
                        borderRadius: '10px',
                        transition: 'width 0.3s ease',
                      }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Location Analytics Table */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Geographic Distribution</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>City</th>
                <th style={styles.tableHeader}>Total Participants</th>
                <th style={styles.tableHeader}>Number of Events</th>
                <th style={styles.tableHeader}>Avg. Participants/Event</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.locationAnalytics.map((loc, index) => {
                const avgParticipants = loc.events > 0 
                  ? Math.round(loc.participants / loc.events)
                  : 0;
                
                return (
                  <tr 
                    key={index}
                    style={{
                      ...styles.tableRow,
                      backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa',
                    }}
                  >
                    <td style={{ ...styles.tableCell, fontWeight: '600' }}>
                      📍 {loc.city}
                    </td>
                    <td style={styles.tableCell}>
                      {loc.participants.toLocaleString()}
                    </td>
                    <td style={styles.tableCell}>
                      {loc.events.toLocaleString()}
                    </td>
                    <td style={{ ...styles.tableCell, fontWeight: '600', color: '#3498db' }}>
                      {avgParticipants.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

AnalyticsReportGenerator.displayName = 'AnalyticsReportGenerator';

export default AnalyticsReportGenerator;