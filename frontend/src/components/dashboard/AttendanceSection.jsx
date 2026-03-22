import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, Users, Check, X, AlertCircle, RefreshCw, Camera } from 'lucide-react';

const AttendanceSection = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [scannedResult, setScannedResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const scannerRef = useRef(null);

  // API Base URL
  const API_BASE_URL = "http://localhost:8080/api/organizations/attendance";

  // --- Backend Integration ---

  const verifyCode = async (qrCode) => {
    console.log("Verifying Code:", qrCode);
    setIsProcessing(true);

    try {
      // 1. Fetch Data
      const response = await fetch(`${API_BASE_URL}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendanceCode: qrCode }),
        credentials: 'include' // Sends JSESSIONID cookie
      });

      // 2. Safe JSON Parsing
      const contentType = response.headers.get("content-type");
      let apiResponse;
      if (contentType && contentType.includes("application/json")) {
        apiResponse = await response.json();
      } else {
        const text = await response.text();
        apiResponse = { success: response.ok, message: text || "Unknown error occurred", data: null };
      }

      console.log("Backend Response:", apiResponse);

      // 3. Handle Success/Error
      if (response.ok && apiResponse.success !== false) {
        // Extract the actual data payload
        const payload = apiResponse.data || apiResponse;

        // Validation: Check if ticket belongs to selected event
        if (payload.eventId && payload.eventId !== selectedEvent) {
           setScannedResult({
            success: false,
            message: `Wrong Event! Ticket is for: ${payload.eventName || 'Unknown Event'}`,
            qrCode: qrCode
          });
        } else {
          // SUCCESS: Set data to state
          setScannedResult({
            success: true,
            participantName: payload.participantName,
            participantEmail: payload.registeredEmail || payload.email, 
            currentStatus: payload.isPresent,
            message: apiResponse.message || 'Participant Found!',
            qrCode: qrCode,
            attendanceMarked: false
          });
        }
        
        // STOP SCANNER immediately on success so Result UI can take over
        if (scannerRef.current) {
          scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
        }

      } else {
        // FAIL: Show error message
        setScannedResult({
          success: false,
          message: apiResponse.message || 'Invalid or Expired QR Code',
          qrCode: qrCode
        });
        
        // Stop scanner on error too, so user sees the error message clearly
        if (scannerRef.current) {
          scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
        }
      }

    } catch (error) {
      console.error("Network Error:", error);
      setScannedResult({
        success: false,
        message: 'Network error. Is the backend running?',
        qrCode: qrCode
      });
      if (scannerRef.current) {
         scannerRef.current.clear().catch(e => console.error(e));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const markAttendance = async (isPresent) => {
    if (!scannedResult || !scannedResult.qrCode) return;

    try {
      const response = await fetch(`${API_BASE_URL}/mark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          attendanceCode: scannedResult.qrCode,
          isPresent: isPresent
        }),
        credentials: 'include'
      });

      const apiResponse = await response.json();

      if (response.ok && apiResponse.success !== false) {
        setScannedResult(prev => ({
          ...prev,
          attendanceMarked: true,
          currentStatus: isPresent,
          message: apiResponse.message || `Successfully marked as ${isPresent ? 'PRESENT' : 'ABSENT'}`
        }));
      } else {
        alert(apiResponse.message || "Failed to update attendance.");
      }
    } catch (error) {
      alert("Network error while marking attendance.");
    }
  };

  const startNextScan = () => {
    setScannedResult(null);
  };

  // --- Scanner Lifecycle ---

  useEffect(() => {
    if (selectedEvent && !scannedResult && !scannerRef.current) {
      // Kept exactly as your original code so the upload and camera logic remains untouched
      const scanner = new Html5QrcodeScanner(
        "reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true
        },
        false
      );

      scanner.render(
        (decodedText) => {
          if (!isProcessing) {
             verifyCode(decodedText);
          }
        }, 
        (errorMessage) => {
          // Ignore read errors
        }
      );

      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => console.error("Failed to clear scanner", error));
        scannerRef.current = null;
      }
    };
  }, [selectedEvent, scannedResult]);

  return (
    <div className="p-6 sm:p-8 w-full">
      
      {/* Header & Event Selection */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-navy-800 p-6 rounded-2xl border border-gray-100 dark:border-navy-700 shadow-sm gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <QrCode className="h-6 w-6 text-green-500" />
            Scanner Gateway
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Select an event to start processing arrivals</p>
        </div>
        <div className="w-full md:w-auto">
          <select
            value={selectedEvent}
            onChange={(e) => {
              setSelectedEvent(e.target.value);
              setScannedResult(null);
            }}
            className="w-full md:w-72 px-4 py-3 border border-gray-200 dark:border-navy-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 dark:bg-navy-900 text-gray-800 dark:text-gray-200 font-medium transition-all shadow-inner"
          >
            <option value="">-- Select Active Event --</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>{event.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        
        {/* State 1: No Event Selected */}
        {!selectedEvent && (
            <div className="text-center py-16 px-6 bg-gray-50/50 dark:bg-navy-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-navy-700 transition-all">
                <div className="w-20 h-20 bg-white dark:bg-navy-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Camera className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ready to Scan</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  Please select an event from the dropdown above to activate the camera and begin check-ins.
                </p>
            </div>
        )}

        {/* State 2: Scanning Mode */}
        {selectedEvent && !scannedResult && (
            <div className="bg-white dark:bg-navy-800 rounded-3xl shadow-xl border border-gray-100 dark:border-navy-700 relative">
                <div className="p-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-center flex justify-between items-center rounded-t-3xl">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                      <p className="font-semibold text-sm tracking-wide">SCANNER ACTIVE</p>
                    </div>
                    <p className="text-xs text-gray-400 font-medium bg-white/10 px-3 py-1 rounded-full">Camera or Upload</p>
                </div>
                
                {/* FIX: Removed 'overflow-hidden' and 'bg-black' to ensure the default file upload UI renders fully */}
                <div className="p-4 sm:p-8 bg-gray-50 dark:bg-navy-900/50 rounded-b-3xl">
                    <div id="reader" className="mx-auto w-full max-w-lg border-0"></div>
                </div>

                {isProcessing && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-navy-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-3xl">
                        <div className="animate-spin rounded-full h-16 w-16 border-y-4 border-green-500 mb-4"></div>
                        <p className="text-gray-900 dark:text-white font-bold text-lg animate-pulse">Verifying Ticket...</p>
                    </div>
                )}
            </div>
        )}

        {/* State 3: Result Mode */}
        {scannedResult && (
            <div className="bg-white dark:bg-navy-800 border border-gray-100 dark:border-navy-700 rounded-3xl shadow-xl p-8 sm:p-10 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg ${
                    scannedResult.success 
                    ? (scannedResult.attendanceMarked ? 'bg-green-100 text-green-600 shadow-green-500/20' : 'bg-blue-100 text-blue-600 shadow-blue-500/20')
                    : 'bg-red-100 text-red-600 shadow-red-500/20'
                }`}>
                    {scannedResult.success ? <Check className="h-10 w-10 stroke-[3]" /> : <AlertCircle className="h-10 w-10 stroke-[3]" />}
                </div>

                <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                    {scannedResult.success ? scannedResult.participantName : 'Scan Failed'}
                </h3>
                
                <p className={`text-lg mb-8 font-medium ${scannedResult.success ? 'text-gray-500 dark:text-gray-400' : 'text-red-500'}`}>
                    {scannedResult.message}
                </p>

                {scannedResult.success && (
                    <div className="bg-gray-50 dark:bg-navy-900/50 rounded-2xl p-6 mb-8 text-left border border-gray-100 dark:border-navy-700 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Registered Email</p>
                                <p className="font-semibold text-gray-900 dark:text-gray-200 break-all">{scannedResult.participantEmail}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Current Status</p>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                                    scannedResult.currentStatus 
                                      ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' 
                                      : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                                }`}>
                                    {scannedResult.currentStatus ? 'Already Checked In' : 'Pending Check-In'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-4 max-w-lg mx-auto">
                    {/* Action Buttons */}
                    {scannedResult.success && !scannedResult.attendanceMarked && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => markAttendance(true)}
                                className="flex items-center justify-center gap-2 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all transform hover:-translate-y-1 shadow-lg shadow-green-500/30"
                            >
                                <Check className="h-5 w-5" /> Mark Present
                            </button>
                            <button
                                onClick={() => markAttendance(false)}
                                className="flex items-center justify-center gap-2 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all transform hover:-translate-y-1 shadow-lg shadow-red-500/30"
                            >
                                <X className="h-5 w-5" /> Mark Absent
                            </button>
                        </div>
                    )}

                    {/* Reset Button */}
                    <button
                        onClick={startNextScan}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-white dark:bg-navy-800 hover:bg-gray-50 dark:hover:bg-navy-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition-all border-2 border-gray-200 dark:border-navy-600 hover:border-gray-300 dark:hover:border-navy-500"
                    >
                        <RefreshCw className="h-5 w-5" />
                        {scannedResult.attendanceMarked ? "Scan Next Participant" : "Cancel & Scan Next"}
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default AttendanceSection;