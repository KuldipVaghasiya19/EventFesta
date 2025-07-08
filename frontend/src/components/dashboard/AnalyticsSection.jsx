import { useState } from 'react';
import { Calendar, Users, TrendingUp, Eye, Download, Filter, BarChart3, PieChart, Activity, Target, Award, MapPin, Tag, Clock, ChevronLeft, ChevronRight, Fullscreen } from 'lucide-react';

const AnalyticsSection = ({ events }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('last30days');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [monthSliderIndex, setMonthSliderIndex] = useState(0);
  const [eventSliderIndex, setEventSliderIndex] = useState(0);
  const [locationSliderIndex, setLocationSliderIndex] = useState(0);

  // Calculate analytics data from actual events
  const calculateAnalytics = () => {
    const totalEvents = events.length;
    const totalParticipants = events.reduce((sum, event) => sum + event.currentParticipants, 0);
    const avgParticipantsPerEvent = Math.round(totalParticipants / totalEvents);
    
    // Mock attendance data (in real app, this would come from attendance records)
    const totalPresent = Math.round(totalParticipants * 0.85); // 85% attendance rate
    const totalAbsent = totalParticipants - totalPresent;
    const attendanceRate = Math.round((totalPresent / totalParticipants) * 100);

    // Calculate tag distribution
    const tagCounts = {};
    events.forEach(event => {
      event.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // Calculate event type distribution
    const typeCounts = {};
    events.forEach(event => {
      typeCounts[event.type] = (typeCounts[event.type] || 0) + 1;
    });

    // Calculate location distribution
    const locationCounts = {};
    events.forEach(event => {
      const city = event.location.split(',')[0].trim();
      locationCounts[city] = (locationCounts[city] || 0) + event.currentParticipants;
    });

    // Generate 12 months of data for slider
    const monthlyData = [
      { month: 'Jan', events: 2, participants: 420, present: 357, absent: 63 },
      { month: 'Feb', events: 1, participants: 180, present: 153, absent: 27 },
      { month: 'Mar', events: 3, participants: 650, present: 553, absent: 97 },
      { month: 'Apr', events: 2, participants: 380, present: 323, absent: 57 },
      { month: 'May', events: 1, participants: 220, present: 187, absent: 33 },
      { month: 'Jun', events: 3, participants: 720, present: 612, absent: 108 },
      { month: 'Jul', events: 4, participants: 890, present: 756, absent: 134 },
      { month: 'Aug', events: 2, participants: 340, present: 289, absent: 51 },
      { month: 'Sep', events: 3, participants: 560, present: 476, absent: 84 },
      { month: 'Oct', events: 5, participants: 1120, present: 952, absent: 168 },
      { month: 'Nov', events: 3, participants: 680, present: 578, absent: 102 },
      { month: 'Dec', events: 2, participants: 450, present: 383, absent: 67 }
    ];

    return {
      overview: {
        totalEvents,
        totalParticipants,
        totalPresent,
        totalAbsent,
        attendanceRate,
        avgParticipantsPerEvent,
        growthRate: 23.5
      },
      eventPerformance: events.map(event => ({
        name: event.title,
        participants: event.currentParticipants,
        maxParticipants: event.maxParticipants,
        attendanceRate: Math.round((event.currentParticipants / event.maxParticipants) * 100),
        type: event.type,
        location: event.location
      })),
      monthlyTrends: monthlyData,
      tagDistribution: Object.entries(tagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 8)
        .map(([tag, count]) => ({
          tag,
          count,
          percentage: Math.round((count / totalEvents) * 100)
        })),
      typeDistribution: Object.entries(typeCounts).map(([type, count]) => ({
        type,
        count,
        percentage: Math.round((count / totalEvents) * 100)
      })),
      locationAnalytics: Object.entries(locationCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([city, participants]) => ({
          city,
          participants,
          events: events.filter(e => e.location.includes(city)).length
        }))
    };
  };

  const analyticsData = calculateAnalytics();

  const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }) => {
    const colorClasses = {
      blue: 'border-l-blue-500 bg-blue-50',
      green: 'border-l-green-500 bg-green-50', 
      purple: 'border-l-purple-500 bg-purple-50',
      orange: 'border-l-orange-500 bg-orange-50',
      red: 'border-l-red-500 bg-red-50',
      indigo: 'border-l-indigo-500 bg-indigo-50'
    };

    const iconColors = {
      blue: 'text-blue-500 bg-blue-100',
      green: 'text-green-500 bg-green-100',
      purple: 'text-purple-500 bg-purple-100',
      orange: 'text-orange-500 bg-orange-100',
      red: 'text-red-500 bg-red-100',
      indigo: 'text-indigo-500 bg-indigo-100'
    };

    return (
      <div className={`p-6 rounded-xl border-l-4 ${colorClasses[color]} transition-all duration-300 hover:shadow-md`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
            <p className="font-medium text-gray-700 mb-1">{title}</p>
            <p className="text-sm text-gray-500">{subtitle}</p>
            {trend && (
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">+{trend}% from last month</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${iconColors[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    );
  };

  const SliderChart = ({ data, title, xKey, yKey, color = 'blue', sliderIndex, setSliderIndex, itemsPerView = 6 }) => {
    const maxValue = Math.max(...data.map(item => item[yKey]));
    const visibleData = data.slice(sliderIndex, sliderIndex + itemsPerView);
    
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      indigo: 'bg-indigo-500'
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
              className={`p-2 rounded-lg transition-colors ${
                canGoPrev 
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                  : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setSliderIndex(Math.min(data.length - itemsPerView, sliderIndex + itemsPerView))}
              disabled={!canGoNext}
              className={`p-2 rounded-lg transition-colors ${
                canGoNext 
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                  : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {visibleData.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-24 text-sm font-medium text-gray-700 truncate">
                {item[xKey]}
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-200 rounded-full h-3 relative overflow-hidden">
                  <div 
                    className={`h-full ${colorClasses[color]} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${(item[yKey] / maxValue) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-16 text-sm font-bold text-gray-900 text-right">
                {item[yKey].toLocaleString()}
              </div>
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
    const maxValue = Math.max(...visibleData.map(item => item.participants));
    
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
              className={`p-2 rounded-lg transition-colors ${
                canGoPrev 
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                  : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setSliderIndex(Math.min(data.length - itemsPerView, sliderIndex + itemsPerView))}
              disabled={!canGoNext}
              className={`p-2 rounded-lg transition-colors ${
                canGoNext 
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                  : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              }`}
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
                    className="bg-gradient-to-t from-primary-500 to-primary-300 rounded-t-lg transition-all duration-1000 ease-out hover:from-primary-600 hover:to-primary-400 cursor-pointer group"
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
    const colors = [
      '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', 
      '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#84CC16'
    ];
    
    // Calculate angles for each segment
    let currentAngle = 0;
    const segments = data.map((item, index) => {
      const percentage = (item.count / total) * 100;
      const angle = (item.count / total) * 360;
      const segment = {
        ...item,
        percentage,
        startAngle: currentAngle,
        endAngle: currentAngle + angle,
        color: colors[index % colors.length]
      };
      currentAngle += angle;
      return segment;
    });

    const createPath = (centerX, centerY, radius, startAngle, endAngle) => {
      const start = polarToCartesian(centerX, centerY, radius, endAngle);
      const end = polarToCartesian(centerX, centerY, radius, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      return [
        "M", centerX, centerY, 
        "L", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "Z"
      ].join(" ");
    };

    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
      const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
      };
    };
    
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 h-full">
        <h3 className="text-xl font-bold text-gray-900 mb-6">{title}</h3>
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg width="200" height="200" className="transform -rotate-90">
              {segments.map((segment, index) => (
                <path
                  key={index}
                  d={createPath(100, 100, 80, segment.startAngle, segment.endAngle)}
                  fill={segment.color}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
              {/* Inner circle for donut effect */}
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
                <div 
                  className="w-4 h-4 rounded-full mr-3" 
                  style={{ backgroundColor: item.color }}
                ></div>
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
              className={`p-2 rounded-lg transition-colors ${
                canGoPrev 
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                  : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-500 px-2">
              {tableSliderIndex + 1}-{Math.min(tableSliderIndex + itemsPerPage, data.length)} of {data.length}
            </span>
            <button
              onClick={() => setTableSliderIndex(Math.min(data.length - itemsPerPage, tableSliderIndex + itemsPerPage))}
              disabled={!canGoNext}
              className={`p-2 rounded-lg transition-colors ${
                canGoNext 
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                  : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
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
                const fillRate = ((event.participants / event.maxParticipants) * 100).toFixed(1);
                return (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{event.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {event.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {event.participants.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {event.maxParticipants.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2 max-w-20">
                          <div 
                            className={`h-2 rounded-full ${
                              fillRate >= 80 ? 'bg-green-500' : 
                              fillRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${fillRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{fillRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 text-sm">
                      {event.location}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const AttendanceChart = ({ data, title, sliderIndex, setSliderIndex, itemsPerView = 6 }) => {
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
              className={`p-2 rounded-lg transition-colors ${
                canGoPrev 
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                  : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setSliderIndex(Math.min(data.length - itemsPerView, sliderIndex + itemsPerView))}
              disabled={!canGoNext}
              className={`p-2 rounded-lg transition-colors ${
                canGoNext 
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                  : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {visibleData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{item.month}</span>
                <span className="text-sm text-gray-500">{item.present + item.absent} total</span>
              </div>
              <div className="flex rounded-full overflow-hidden h-3 bg-gray-200">
                <div 
                  className="bg-green-500 transition-all duration-1000"
                  style={{ width: `${(item.present / (item.present + item.absent)) * 100}%` }}
                ></div>
                <div 
                  className="bg-red-500 transition-all duration-1000"
                  style={{ width: `${(item.absent / (item.present + item.absent)) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Present: {item.present}</span>
                <span>Absent: {item.absent}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-center space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Present</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Absent</span>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          Showing {sliderIndex + 1}-{Math.min(sliderIndex + itemsPerView, data.length)} of {data.length} months
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen -mt-16 pt-20 relative z-10">
      {/* Header */}
      <div className="p-8 pb-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
            <p className="text-gray-600">Comprehensive insights into your event performance and attendance</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
            >
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last3months">Last 3 Months</option>
              <option value="last6months">Last 6 Months</option>
              <option value="lastyear">Last Year</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <StatCard
            title="Total Events"
            value={analyticsData.overview.totalEvents}
            subtitle="Events organized"
            icon={Calendar}
            color="blue"
            trend={12}
          />
          <StatCard
            title="Total Participants"
            value={analyticsData.overview.totalParticipants.toLocaleString()}
            subtitle="Across all events"
            icon={Users}
            color="green"
            trend={23}
          />
          <StatCard
            title="Present"
            value={analyticsData.overview.totalPresent.toLocaleString()}
            subtitle="Attended events"
            icon={Activity}
            color="purple"
            trend={18}
          />
          <StatCard
            title="Absent"
            value={analyticsData.overview.totalAbsent.toLocaleString()}
            subtitle="Missed events"
            icon={Clock}
            color="red"
          />
          <StatCard
            title="Attendance Rate"
            value={`${analyticsData.overview.attendanceRate}%`}
            subtitle="Overall attendance"
            icon={Target}
            color="orange"
            trend={5}
          />
          <StatCard
            title="Avg Participants"
            value={analyticsData.overview.avgParticipantsPerEvent}
            subtitle="Per event"
            icon={Award}
            color="indigo"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <LineChart 
            data={analyticsData.monthlyTrends} 
            title="Monthly Participation Trends"
            sliderIndex={monthSliderIndex}
            setSliderIndex={setMonthSliderIndex}
            itemsPerView={6}
          />

          <AttendanceChart 
            data={analyticsData.monthlyTrends} 
            title="Monthly Attendance Breakdown"
            sliderIndex={monthSliderIndex}
            setSliderIndex={setMonthSliderIndex}
            itemsPerView={3}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DonutChart 
            data={analyticsData.tagDistribution} 
            title="Popular Event Tags"
          />
          <DonutChart 
            data={analyticsData.typeDistribution} 
            title="Event Type Distribution"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SliderChart 
            data={analyticsData.eventPerformance} 
            title="Event Participation"
            xKey="name"
            yKey="participants"
            color="blue"
            sliderIndex={eventSliderIndex}
            setSliderIndex={setEventSliderIndex}
            itemsPerView={6}
          />
          <SliderChart 
            data={analyticsData.locationAnalytics} 
            title="Participants by Location"
            xKey="city"
            yKey="participants"
            color="green"
            sliderIndex={locationSliderIndex}
            setSliderIndex={setLocationSliderIndex}
            itemsPerView={6}
          />
        </div>

        {/* Event Performance Table */}
        <EventPerformanceTable data={analyticsData.eventPerformance} />

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Most Popular Event</h3>
              <Target className="h-6 w-6" />
            </div>
            <p className="text-2xl font-bold mb-2">
              {analyticsData.eventPerformance.reduce((max, event) => 
                event.participants > max.participants ? event : max
              ).name}
            </p>
            <p className="text-blue-100">
              {analyticsData.eventPerformance.reduce((max, event) => 
                event.participants > max.participants ? event : max
              ).participants} participants
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Best Fill Rate</h3>
              <Users className="h-6 w-6" />
            </div>
            <p className="text-2xl font-bold mb-2">
              {Math.max(...analyticsData.eventPerformance.map(e => (e.participants / e.maxParticipants) * 100)).toFixed(1)}%
            </p>
            <p className="text-green-100">Highest capacity utilization</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Top Event Tag</h3>
              <Tag className="h-6 w-6" />
            </div>
            <p className="text-2xl font-bold mb-2">
              {analyticsData.tagDistribution[0]?.tag || 'N/A'}
            </p>
            <p className="text-purple-100">
              Used in {analyticsData.tagDistribution[0]?.count || 0} events
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;