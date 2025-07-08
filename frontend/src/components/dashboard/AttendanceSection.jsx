import { useState, useRef, useEffect } from 'react';
import { QrCode, Camera, Users, Check, X, Calendar } from 'lucide-react';

const AttendanceSection = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [attendanceStats, setAttendanceStats] = useState({
    totalScanned: 0,
    presentCount: 0,
    absentCount: 0
  });
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const simulateQRScan = () => {
    // Simulate scanning a QR code with random data
    const mockQRCodes = [
      'QR_REG001_JOHN_DOE',
      'QR_REG002_SARAH_JOHNSON', 
      'QR_REG003_MICHAEL_CHEN',
      'QR_REG004_EMILY_DAVIS',
      'QR_REG005_DAVID_WILSON'
    ];
    
    const randomCode = mockQRCodes[Math.floor(Math.random() * mockQRCodes.length)];
    handleQRCodeScanned(randomCode);
  };

  const handleQRCodeScanned = async (qrCode) => {
    if (!selectedEvent) {
      alert('Please select an event first!');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate API call to backend to get participant info
      const response = await getParticipantInfo(qrCode, selectedEvent);
      
      // Display the participant info without marking attendance yet
      setScannedResult({
        ...response,
        qrCode: qrCode,
        attendanceMarked: false
      });

    } catch (error) {
      console.error('Error processing QR code:', error);
      setScannedResult({
        success: false,
        message: 'Error processing QR code. Please try again.',
        participantName: null,
        qrCode: qrCode,
        attendanceMarked: false
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getParticipantInfo = async (qrCode, eventId) => {
    // Simulate backend API call to get participant info
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock response from backend
        const mockParticipants = {
          'QR_REG001_JOHN_DOE': { name: 'John Doe', email: 'john.doe@example.com' },
          'QR_REG002_SARAH_JOHNSON': { name: 'Sarah Johnson', email: 'sarah.j@example.com' },
          'QR_REG003_MICHAEL_CHEN': { name: 'Michael Chen', email: 'michael.chen@example.com' },
          'QR_REG004_EMILY_DAVIS': { name: 'Emily Davis', email: 'emily.davis@example.com' },
          'QR_REG005_DAVID_WILSON': { name: 'David Wilson', email: 'david.w@example.com' }
        };

        const participant = mockParticipants[qrCode];
        
        if (participant) {
          resolve({
            success: true,
            message: 'Participant found! Please mark attendance.',
            participantName: participant.name,
            participantEmail: participant.email,
            timestamp: new Date().toLocaleString()
          });
        } else {
          resolve({
            success: false,
            message: 'Invalid QR code or participant not found!',
            participantName: null
          });
        }
      }, 1000); // Simulate network delay
    });
  };

  const markAttendance = async (isPresent) => {
    if (!scannedResult || !scannedResult.success) return;

    setIsProcessing(true);

    try {
      // Send attendance data to backend
      const attendanceData = {
        qrCode: scannedResult.qrCode,
        eventId: selectedEvent,
        participantName: scannedResult.participantName,
        participantEmail: scannedResult.participantEmail,
        isPresent: isPresent,
        timestamp: new Date().toISOString()
      };

      // Simulate backend API call
      await sendAttendanceToBackend(attendanceData);

      // Update the result to show attendance has been marked
      setScannedResult(prev => ({
        ...prev,
        isPresent: isPresent,
        attendanceMarked: true,
        message: isPresent ? 'Marked as Present!' : 'Marked as Absent!'
      }));

      // Update stats
      setAttendanceStats(prev => ({
        totalScanned: prev.totalScanned + 1,
        presentCount: isPresent ? prev.presentCount + 1 : prev.presentCount,
        absentCount: isPresent ? prev.absentCount : prev.absentCount + 1
      }));

    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Error marking attendance. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const sendAttendanceToBackend = async (attendanceData) => {
    // Simulate backend API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Sending to backend:', attendanceData);
        resolve({ success: true });
      }, 500);
    });
  };

  const clearResult = () => {
    setScannedResult(null);
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="p-8 pb-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">QR Code Attendance Scanner</h2>
            <p className="text-gray-600">Scan participant QR codes to mark attendance</p>
          </div>
          <div className="mt-4 md:mt-0">
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white min-w-[200px]"
            >
              <option value="">Select Event</option>
              {events.slice(0, 3).map((event) => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full mr-4">
                <QrCode className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{attendanceStats.totalScanned}</h3>
                <p className="text-gray-600">Total Scanned</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center">
              <div className="bg-green-100 text-green-600 p-3 rounded-full mr-4">
                <Check className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{attendanceStats.presentCount}</h3>
                <p className="text-gray-600">Present</p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center">
              <div className="bg-red-100 text-red-600 p-3 rounded-full mr-4">
                <X className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{attendanceStats.absentCount}</h3>
                <p className="text-gray-600">Absent</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Scanner Section */}
      <div className="px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Scanner Controls */}
          <div className="bg-gray-50 rounded-xl p-8 mb-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">QR Code Scanner</h3>
              <p className="text-gray-600">Point the camera at the participant's QR code</p>
            </div>
            
            {/* Camera Preview */}
            <div className="relative mb-6">
              <div className="bg-gray-200 rounded-lg overflow-hidden aspect-video flex items-center justify-center max-w-md mx-auto">
                {isScanning ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <Camera className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg font-medium">Camera Preview</p>
                    <p className="text-sm">Click "Start Scanner" to begin</p>
                  </div>
                )}
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Scanner Buttons */}
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={isScanning ? stopScanning : startScanning}
                disabled={!selectedEvent}
                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-colors ${
                  !selectedEvent 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isScanning 
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-primary-500 hover:bg-primary-600 text-white'
                }`}
              >
                <Camera className="h-5 w-5" />
                {isScanning ? 'Stop Scanner' : 'Start Scanner'}
              </button>
              
              <button
                onClick={simulateQRScan}
                disabled={!selectedEvent}
                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-colors ${
                  !selectedEvent
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                <QrCode className="h-5 w-5" />
                Simulate Scan
              </button>
            </div>

            {!selectedEvent && (
              <div className="text-center">
                <p className="text-orange-600 bg-orange-50 border border-orange-200 rounded-lg px-4 py-2 inline-block">
                  Please select an event to start scanning
                </p>
              </div>
            )}
          </div>

          {/* Scan Result Display */}
          {(scannedResult || isProcessing) && (
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              {isProcessing ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                  <p className="text-lg font-medium text-gray-900">Processing...</p>
                  <p className="text-gray-600">Please wait while we process the request</p>
                </div>
              ) : (
                <div className="text-center">
                  {/* Status Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    scannedResult.success 
                      ? scannedResult.attendanceMarked
                        ? scannedResult.isPresent 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                        : 'bg-blue-100 text-blue-600'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {scannedResult.success ? (
                      scannedResult.attendanceMarked ? (
                        scannedResult.isPresent ? <Check className="h-8 w-8" /> : <X className="h-8 w-8" />
                      ) : (
                        <Users className="h-8 w-8" />
                      )
                    ) : (
                      <X className="h-8 w-8" />
                    )}
                  </div>
                  
                  {/* Status Title */}
                  <h3 className={`text-2xl font-bold mb-2 ${
                    scannedResult.success 
                      ? scannedResult.attendanceMarked
                        ? scannedResult.isPresent 
                          ? 'text-green-600' 
                          : 'text-red-600'
                        : 'text-blue-600'
                      : 'text-red-600'
                  }`}>
                    {scannedResult.success ? (
                      scannedResult.attendanceMarked ? (
                        scannedResult.isPresent ? 'Marked as Present!' : 'Marked as Absent!'
                      ) : (
                        'Participant Found!'
                      )
                    ) : (
                      'Scan Failed'
                    )}
                  </h3>
                  
                  {/* Participant Info */}
                  {scannedResult.participantName && (
                    <div className="mb-4">
                      <p className="text-xl font-semibold text-gray-900">{scannedResult.participantName}</p>
                      {scannedResult.participantEmail && (
                        <p className="text-gray-600">{scannedResult.participantEmail}</p>
                      )}
                      {scannedResult.timestamp && (
                        <p className="text-sm text-gray-500 mt-2">
                          Scanned at: {scannedResult.timestamp}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Message */}
                  <p className={`text-lg mb-6 ${
                    scannedResult.success ? 'text-gray-700' : 'text-red-600'
                  }`}>
                    {scannedResult.message}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex justify-center gap-4">
                    {scannedResult.success && !scannedResult.attendanceMarked ? (
                      <>
                        <button
                          onClick={() => markAttendance(true)}
                          className="flex items-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                        >
                          <Check className="h-5 w-5" />
                          Mark as Present
                        </button>
                        <button
                          onClick={() => markAttendance(false)}
                          className="flex items-center gap-2 px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                        >
                          <X className="h-5 w-5" />
                          Mark as Absent
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={clearResult}
                        className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                      >
                        Scan Next
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceSection;