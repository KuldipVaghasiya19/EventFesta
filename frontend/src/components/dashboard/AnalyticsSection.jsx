import { useState, useEffect, useRef } from 'react';
import { Calendar, Users, TrendingUp, Download, BarChart3, Target, Award, Tag, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import AnalyticsReportGenerator from '../../utils/AnalyticsPdfGenerator';

const AnalyticsSection = ({ events }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const [monthSliderIndex, setMonthSliderIndex] = useState(0);
  const [eventSliderIndex, setEventSliderIndex] = useState(0);
  const [locationSliderIndex, setLocationSliderIndex] = useState(0);
  
  const reportRef = useRef(null);

  useEffect(() => {
    const calculateAndFetchAnalytics = async () => {
      setLoading(true);
      
      const totalEvents = events.length;
      const totalParticipants = events.reduce((sum, event) => sum + event.currentParticipants, 0);
      const avgParticipantsPerEvent = totalEvents > 0 ? Math.round(totalParticipants / totalEvents) : 0;
      
      const tagCounts = {};
      events.forEach(event => { (event.tags || []).forEach(tag => { tagCounts[tag] = (tagCounts[tag] || 0) + 1; }); });
      const typeCounts = {};
      events.forEach(event => { if (event.type) { typeCounts[event.type] = (typeCounts[event.type] || 0) + 1; } });
      const locationCounts = {};
      events.forEach(event => { if (event.location) { const city = event.location.split(',')[0].trim(); locationCounts[city] = (locationCounts[city] || 0) + event.currentParticipants; } });

      try {
        const orgString = sessionStorage.getItem('techevents_user');
        if (!orgString) throw new Error("User data not found in session storage.");
        
        const org = JSON.parse(orgString);
        const orgId = org.id;
        if (!orgId) throw new Error("Organization ID not found in user data.");

        const apiUrl = `http://localhost:8080/${orgId}/analytics/monthly-participants`;
        const response = await fetch(apiUrl, { credentials: 'include' });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        let monthlyTrendsData = await response.json();
        
        // Ensure present and absent are numbers
        monthlyTrendsData = monthlyTrendsData.map(month => ({
          ...month,
          present: parseInt(month.present, 10) || 0,
          absent: parseInt(month.absent, 10) || 0,
        }));

        const totalPresent = monthlyTrendsData.reduce((sum, month) => sum + month.present, 0);
        const totalAbsent = monthlyTrendsData.reduce((sum, month) => sum + month.absent, 0);
        const totalRegistered = totalPresent + totalAbsent;
        const attendanceRate = totalRegistered > 0 ? Math.round((totalPresent / totalRegistered) * 100) : 0;
        
        setAnalyticsData({
          overview: { totalEvents, totalParticipants, totalPresent, totalAbsent, attendanceRate, avgParticipantsPerEvent, growthRate: 23.5 },
          eventPerformance: events.map(event => ({ name: event.title, participants: event.currentParticipants, maxParticipants: event.maxParticipants, attendanceRate: event.maxParticipants > 0 ? Math.round((event.currentParticipants / event.maxParticipants) * 100) : 0, type: event.type, location: event.location })),
          tagDistribution: Object.entries(tagCounts).sort(([, a], [, b]) => b - a).slice(0, 8).map(([tag, count]) => ({ tag, count, percentage: totalEvents > 0 ? Math.round((count / totalEvents) * 100) : 0 })),
          typeDistribution: Object.entries(typeCounts).map(([type, count]) => ({ type, count, percentage: totalEvents > 0 ? Math.round((count / totalEvents) * 100) : 0 })),
          locationAnalytics: Object.entries(locationCounts).sort(([, a], [, b]) => b - a).slice(0, 10).map(([city, participants]) => ({ city, participants, events: events.filter(e => e.location && e.location.includes(city)).length })),
          monthlyTrends: monthlyTrendsData,
        });

      } catch (error) {
        console.error("Failed to fetch or process analytics:", error);
        setAnalyticsData({
            overview: { totalEvents: 0, totalParticipants: 0, totalPresent: 0, totalAbsent: 0, attendanceRate: 0, avgParticipantsPerEvent: 0 },
            eventPerformance: [],
            tagDistribution: [],
            typeDistribution: [],
            locationAnalytics: [],
            monthlyTrends: [],
        });
      } finally {
        setLoading(false);
      }
    };
    calculateAndFetchAnalytics();
  }, [events]);

  useEffect(() => {
    if (isGeneratingPdf && reportRef.current) {
      html2canvas(reportRef.current, { scale: 2 })
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: [canvas.width, canvas.height],
          });
          pdf.addImage(imgData, 'pdf', 0, 0, canvas.width, canvas.height);
          pdf.save('Full_Analytics_Report.pdf');
        })
        .finally(() => {
          setIsGeneratingPdf(false);
        });
    }
  }, [isGeneratingPdf, analyticsData]);

  const handleDownloadReport = () => {
    setIsGeneratingPdf(true);
  };

  if (loading || !analyticsData) {
    return <div className="p-8 text-center">Loading Analytics...</div>;
  }

  // Sub-components
  const StatCard = ({ title, value, subtitle, icon: Icon, color }) => {
    const colorClasses = {
      blue: 'border-l-blue-500 bg-blue-50', green: 'border-l-green-500 bg-green-50', 
      purple: 'border-l-purple-500 bg-purple-50', orange: 'border-l-orange-500 bg-orange-50',
      red: 'border-l-red-500 bg-red-50', indigo: 'border-l-indigo-500 bg-indigo-50'
    };
    const iconColors = {
      blue: 'text-blue-500 bg-blue-100', green: 'text-green-500 bg-green-100',
      purple: 'text-purple-500 bg-purple-100', orange: 'text-orange-500 bg-orange-100',
      red: 'text-red-500 bg-red-100', indigo: 'text-indigo-500 bg-indigo-100'
    };
    return (
      <div className={`p-6 rounded-xl border-l-4 ${colorClasses[color]} transition-all duration-300 hover:shadow-md`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
            <p className="font-medium text-gray-700 mb-1">{title}</p>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
          <div className={`p-3 rounded-full ${iconColors[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    );
  };
  
  const SliderChart = ({ data, title, xKey, yKey, color = 'blue', sliderIndex, setSliderIndex, itemsPerView = 6 }) => {
    const maxValue = data.length > 0 ? Math.max(...data.map(item => item[yKey]), 1) : 1;
    const visibleData = data.slice(sliderIndex, sliderIndex + itemsPerView);
    const colorClasses = {
      blue: 'bg-blue-500', green: 'bg-green-500', purple: 'bg-purple-500',
      orange: 'bg-orange-500', indigo: 'bg-indigo-500'
    };
    const canGoNext = sliderIndex + itemsPerView < data.length;
    const canGoPrev = sliderIndex > 0;
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSliderIndex(Math.max(0, sliderIndex - itemsPerView))}
              disabled={!canGoPrev}
              className={`p-2 rounded-lg transition-colors ${ canGoPrev ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-50 text-gray-300 cursor-not-allowed' }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setSliderIndex(Math.min(data.length - itemsPerView, sliderIndex + itemsPerView))}
              disabled={!canGoNext}
              className={`p-2 rounded-lg transition-colors ${ canGoNext ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-50 text-gray-300 cursor-not-allowed' }`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {visibleData.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-24 text-sm font-medium text-gray-700 truncate">{item[xKey]}</div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-200 rounded-full h-3 relative overflow-hidden">
                  <div className={`h-full ${colorClasses[color]} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${(item[yKey] / maxValue) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-16 text-sm font-bold text-gray-900 text-right">{item[yKey].toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          Showing {sliderIndex + 1}-{Math.min(sliderIndex + itemsPerView, data.length)} of {data.length}
        </div>
      </div>
    );
  };

  const LineChart = ({ data, title, sliderIndex, setSliderIndex, itemsPerView = 6 }) => {
    const visibleData = data.slice(sliderIndex, sliderIndex + itemsPerView);
    const maxValue = visibleData.length > 0 ? Math.max(...visibleData.map(item => item.participants), 1) : 1;
    const canGoNext = sliderIndex + itemsPerView < data.length;
    const canGoPrev = sliderIndex > 0;
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <div className="flex items-center gap-2">
             <button
              onClick={() => setSliderIndex(Math.max(0, sliderIndex - itemsPerView))}
              disabled={!canGoPrev}
              className={`p-2 rounded-lg transition-colors ${ canGoPrev ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-50 text-gray-300 cursor-not-allowed' }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setSliderIndex(Math.min(data.length - itemsPerView, sliderIndex + itemsPerView))}
              disabled={!canGoNext}
              className={`p-2 rounded-lg transition-colors ${ canGoNext ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-50 text-gray-300 cursor-not-allowed' }`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="relative h-64">
          <div className="absolute inset-0 flex items-end justify-between px-2">
            {visibleData.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="relative w-full max-w-12 mx-2">
                  <div 
                    className="line-chart-bar bg-gradient-to-t from-primary-500 to-primary-300 rounded-t-lg transition-all duration-1000 ease-out hover:from-primary-600 hover:to-primary-400 cursor-pointer group"
                    style={{ height: `${maxValue > 0 ? (item.participants / maxValue) * 200 : 0}px` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.participants} participants
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-700 mt-2">{item.month}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          Showing {sliderIndex + 1}-{Math.min(sliderIndex + itemsPerView, data.length)} of {data.length} months
        </div>
      </div>
    );
  };

  const DonutChart = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#84CC16'];
    let currentAngle = 0;
    const segments = data.map((item, index) => {
      const percentage = total > 0 ? (item.count / total) * 100 : 0;
      const angle = total > 0 ? (item.count / total) * 360 : 0;
      const segment = { ...item, percentage, startAngle: currentAngle, endAngle: currentAngle + angle, color: colors[index % colors.length] };
      currentAngle += angle;
      return segment;
    });
    const createPath = (centerX, centerY, radius, startAngle, endAngle) => {
      if (endAngle - startAngle >= 360) { endAngle = startAngle + 359.99; }
      const start = polarToCartesian(centerX, centerY, radius, endAngle);
      const end = polarToCartesian(centerX, centerY, radius, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      return ["M", centerX, centerY, "L", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y, "Z"].join(" ");
    };
    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
      const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
      return { x: centerX + (radius * Math.cos(angleInRadians)), y: centerY + (radius * Math.sin(angleInRadians)) };
    };
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 h-full">
        <h3 className="text-xl font-bold text-gray-900 mb-6">{title}</h3>
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg width="200" height="200" className="transform -rotate-90">
              {segments.map((segment, index) => (
                <path key={index} d={createPath(100, 100, 80, segment.startAngle, segment.endAngle)} fill={segment.color} className="hover:opacity-80 transition-opacity cursor-pointer" />
              ))}
              <circle cx="100" cy="100" r="40" fill="white" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{total}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>
          </div>
          <div className="ml-8 space-y-3 max-h-48 overflow-y-auto">
            {segments.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: item.color }}></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{item.tag || item.type}</div>
                  <div className="text-xs text-gray-500">{item.count} ({item.percentage.toFixed(1)}%)</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  const EventPerformanceTable = ({ data }) => {
    const [tableSliderIndex, setTableSliderIndex] = useState(0);
    const itemsPerPage = 5;
    const visibleData = data.slice(tableSliderIndex, tableSliderIndex + itemsPerPage);
    const canGoNext = tableSliderIndex + itemsPerPage < data.length;
    const canGoPrev = tableSliderIndex > 0;
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Event Performance</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTableSliderIndex(Math.max(0, tableSliderIndex - itemsPerPage))}
              disabled={!canGoPrev}
              className={`p-2 rounded-lg transition-colors ${ canGoPrev ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-50 text-gray-300 cursor-not-allowed' }`}
            > <ChevronLeft className="h-4 w-4" /> </button>
            <span className="text-sm text-gray-500 px-2"> {tableSliderIndex + 1}-{Math.min(tableSliderIndex + itemsPerPage, data.length)} of {data.length} </span>
            <button
              onClick={() => setTableSliderIndex(Math.min(data.length - itemsPerPage, tableSliderIndex + itemsPerPage))}
              disabled={!canGoNext}
              className={`p-2 rounded-lg transition-colors ${ canGoNext ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-50 text-gray-300 cursor-not-allowed' }`}
            > <ChevronRight className="h-4 w-4" /> </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fill Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visibleData.map((event, index) => {
                const fillRate = event.maxParticipants > 0 ? ((event.participants / event.maxParticipants) * 100).toFixed(1) : 0;
                return (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap"><div className="font-medium text-gray-900">{event.name}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{event.type}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{event.participants.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{event.maxParticipants.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2 max-w-20">
                          <div className={`h-2 rounded-full ${ fillRate >= 80 ? 'bg-green-500' : fillRate >= 60 ? 'bg-yellow-500' : 'bg-red-500' }`} style={{ width: `${fillRate}%` }} ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{fillRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 text-sm">{event.location}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  const AttendanceChart = ({ data, title, sliderIndex, setSliderIndex, itemsPerView = 3 }) => {
    const visibleData = data.slice(sliderIndex, sliderIndex + itemsPerView);
    const canGoNext = sliderIndex + itemsPerView < data.length;
    const canGoPrev = sliderIndex > 0;
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSliderIndex(Math.max(0, sliderIndex - itemsPerView))}
              disabled={!canGoPrev}
              className={`p-2 rounded-lg transition-colors ${ canGoPrev ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-50 text-gray-300 cursor-not-allowed' }`}
            > <ChevronLeft className="h-4 w-4" /> </button>
            <button
              onClick={() => setSliderIndex(Math.min(data.length - itemsPerView, sliderIndex + itemsPerView))}
              disabled={!canGoNext}
              className={`p-2 rounded-lg transition-colors ${ canGoNext ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-50 text-gray-300 cursor-not-allowed' }`}
            > <ChevronRight className="h-4 w-4" /> </button>
          </div>
        </div>
        <div className="space-y-4">
          {visibleData.map((item, index) => {
            const present = parseInt(item.present, 10) || 0;
            const absent = parseInt(item.absent, 10) || 0;
            const total = present + absent;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{item.month}</span>
                  <span className="text-sm text-gray-500">{total} total</span>
                </div>
                <div className="flex h-3 w-full rounded-full overflow-hidden bg-gray-200">
                  {total > 0 && (
                    <>
                      <div
                        className="bg-green-500"
                        style={{ width: `${(present / total) * 100}%` }}
                      ></div>
                      <div
                        className="bg-red-500"
                        style={{ width: `${(absent / total) * 100}%` }}
                      ></div>
                    </>
                  )}
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Present: {present}</span>
                  <span>Absent: {absent}</span>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-6 flex items-center justify-center space-x-6">
          <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div><span className="text-sm text-gray-600">Present</span></div>
          <div className="flex items-center"><div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div><span className="text-sm text-gray-600">Absent</span></div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          Showing {sliderIndex + 1}-{Math.min(sliderIndex + itemsPerView, data.length)} of {data.length} months
        </div>
      </div>
    );
  };

  return (
    <>
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        {isGeneratingPdf && <AnalyticsReportGenerator ref={reportRef} analyticsData={analyticsData} />}
      </div>
      
      <div className="bg-white min-h-screen">
        <div className="p-8 pb-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
              <p className="text-gray-600">Comprehensive insights into your event performance and attendance</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-4">
              <button 
                onClick={handleDownloadReport}
                disabled={isGeneratingPdf}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                {isGeneratingPdf ? 'Generating...' : 'Export Full Report'}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <StatCard title="Total Events" value={analyticsData.overview.totalEvents} subtitle="Events organized" icon={Calendar} color="blue" />
            <StatCard title="Total Participants" value={analyticsData.overview.totalParticipants.toLocaleString()} subtitle="Across all events" icon={Users} color="green"  />
            <StatCard title="Present" value={analyticsData.overview.totalPresent.toLocaleString()} subtitle="Attended events" icon={BarChart3} color="purple" />
            <StatCard title="Absent" value={analyticsData.overview.totalAbsent.toLocaleString()} subtitle="Missed events" icon={Clock} color="red" />
            <StatCard title="Attendance Rate" value={`${analyticsData.overview.attendanceRate}%`} subtitle="Overall attendance" icon={Target} color="orange" />
            <StatCard title="Avg Participants" value={analyticsData.overview.avgParticipantsPerEvent} subtitle="Per event" icon={Award} color="indigo" />
          </div>
        </div>
        <div className="px-8 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <LineChart data={analyticsData.monthlyTrends} title="Monthly Participation Trends" sliderIndex={monthSliderIndex} setSliderIndex={setMonthSliderIndex} itemsPerView={6} />
            <AttendanceChart data={analyticsData.monthlyTrends} title="Monthly Attendance Breakdown" sliderIndex={monthSliderIndex} setSliderIndex={setMonthSliderIndex} itemsPerView={3} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <DonutChart data={analyticsData.tagDistribution} title="Popular Event Tags" />
            <DonutChart data={analyticsData.typeDistribution} title="Event Type Distribution" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <SliderChart data={analyticsData.eventPerformance} title="Event Participation" xKey="name" yKey="participants" color="blue" sliderIndex={eventSliderIndex} setSliderIndex={setEventSliderIndex} itemsPerView={6} />
            <SliderChart data={analyticsData.locationAnalytics} title="Participants by Location" xKey="city" yKey="participants" color="green" sliderIndex={locationSliderIndex} setSliderIndex={setLocationSliderIndex} itemsPerView={6} />
          </div>
          <EventPerformanceTable data={analyticsData.eventPerformance} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold">Most Popular Event</h3><Target className="h-6 w-6" /></div>
              <p className="text-2xl font-bold mb-2">{analyticsData.eventPerformance.length > 0 ? analyticsData.eventPerformance.reduce((max, event) => event.participants > max.participants ? event : max).name : 'N/A'}</p>
              <p className="text-blue-100">{analyticsData.eventPerformance.length > 0 ? analyticsData.eventPerformance.reduce((max, event) => event.participants > max.participants ? event : max).participants : 0} participants</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold">Best Fill Rate</h3><Users className="h-6 w-6" /></div>
              <p className="text-2xl font-bold mb-2">{analyticsData.eventPerformance.length > 0 ? Math.max(...analyticsData.eventPerformance.map(e => (e.maxParticipants > 0 ? (e.participants / e.maxParticipants) * 100 : 0))).toFixed(1) : 0}%</p>
              <p className="text-green-100">Highest capacity utilization</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold">Top Event Tag</h3><Tag className="h-6 w-6" /></div>
              <p className="text-2xl font-bold mb-2">{analyticsData.tagDistribution[0]?.tag || 'N/A'}</p>
              <p className="text-purple-100">Used in {analyticsData.tagDistribution[0]?.count || 0} events</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyticsSection;