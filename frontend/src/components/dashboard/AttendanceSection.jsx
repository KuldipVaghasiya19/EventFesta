import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, Users, Check, X, AlertCircle, RefreshCw } from 'lucide-react';

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
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text || "Unknown error occurred" };
      }

      console.log("Backend Response:", data);

      // 3. Handle Success/Error
      if (response.ok) {
        // Validation: Check if ticket belongs to selected event
        if (data.eventId && data.eventId !== selectedEvent) {
           setScannedResult({
            success: false,
            message: `Wrong Event! Ticket is for: ${data.eventName || 'Unknown Event'}`,
            qrCode: qrCode
          });
        } else {
          // SUCCESS: Set data to state
          setScannedResult({
            success: true,
            participantName: data.participantName,
            participantEmail: data.registeredEmail,
            currentStatus: data.isPresent,
            message: 'Participant Found!',
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
          message: data.message || 'Invalid QR Code',
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
        message: 'Network error. Is backend running?',
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

      if (response.ok) {
        setScannedResult(prev => ({
          ...prev,
          attendanceMarked: true,
          currentStatus: isPresent,
          message: `Successfully marked as ${isPresent ? 'PRESENT' : 'ABSENT'}`
        }));
      } else {
        alert("Failed to update attendance.");
      }
    } catch (error) {
      alert("Network error while marking attendance.");
    }
  };

  // Function to restart the scanner after finishing a participant
  const startNextScan = () => {
    setScannedResult(null);
    // The useEffect will re-initialize the scanner because scannedResult is null
  };

  // --- Scanner Lifecycle ---

  useEffect(() => {
    // Logic: Initialize scanner ONLY if an event is selected AND we don't have a result yet
    if (selectedEvent && !scannedResult && !scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true
        },
        /* verbose= */ false
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

    // Cleanup
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => console.error("Failed to clear scanner", error));
        scannerRef.current = null;
      }
    };
  }, [selectedEvent, scannedResult]); // Dependencies ensure scanner restarts when result is cleared

  return (
    <div className="bg-white min-h-screen p-6">
      
      {/* Header & Event Selection */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center bg-gray-50 p-4 rounded-xl">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mark Attendance</h2>
          <p className="text-gray-500">Select an event to start scanning</p>
        </div>
        <div className="mt-4 md:mt-0">
          <select
            value={selectedEvent}
            onChange={(e) => {
              setSelectedEvent(e.target.value);
              setScannedResult(null); // Reset when event changes
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white min-w-[250px]"
          >
            <option value="">-- Select Event --</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>{event.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        
        {/* State 1: No Event Selected */}
        {!selectedEvent && (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed">
                <QrCode className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No Event Selected</h3>
                <p className="text-gray-500">Please select an event from the dropdown above</p>
            </div>
        )}

        {/* State 2: Scanning Mode (Only visible if selectedEvent is true AND no result yet) */}
        {selectedEvent && !scannedResult && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 bg-gray-800 text-white text-center">
                    <p className="font-medium">Camera Active</p>
                    <p className="text-xs text-gray-400">Point at a QR Code</p>
                </div>
                <div className="p-4">
                    <div id="reader" className="overflow-hidden rounded-lg"></div>
                </div>
                {isProcessing && (
                    <div className="p-4 text-center text-primary-600 font-medium animate-pulse">
                        Verifying Ticket...
                    </div>
                )}
            </div>
        )}

        {/* State 3: Result Mode (Replaces Scanner) */}
        {scannedResult && (
            <div className="bg-white border rounded-xl shadow-lg p-8 text-center animate-fade-in">
                <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
                    scannedResult.success 
                    ? (scannedResult.attendanceMarked ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600')
                    : 'bg-red-100 text-red-600'
                }`}>
                    {scannedResult.success ? <Check className="h-12 w-12" /> : <AlertCircle className="h-12 w-12" />}
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {scannedResult.success ? scannedResult.participantName : 'Scan Failed'}
                </h3>
                
                <p className={`text-lg mb-6 ${scannedResult.success ? 'text-gray-600' : 'text-red-500 font-medium'}`}>
                    {scannedResult.message}
                </p>

                {scannedResult.success && (
                    <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left border border-gray-100">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Email</p>
                                <p className="font-medium text-gray-900 break-all">{scannedResult.participantEmail}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Current Status</p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    scannedResult.currentStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {scannedResult.currentStatus ? 'Checked In' : 'Not Checked In'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {/* Action Buttons */}
                    {scannedResult.success && !scannedResult.attendanceMarked && (
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => markAttendance(true)}
                                className="flex items-center justify-center gap-2 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-md"
                            >
                                <Check className="h-5 w-5" /> Mark Present
                            </button>
                            <button
                                onClick={() => markAttendance(false)}
                                className="flex items-center justify-center gap-2 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-md"
                            >
                                <X className="h-5 w-5" /> Mark Absent
                            </button>
                        </div>
                    )}

                    {/* Reset Button (Always visible in result mode) */}
                    <button
                        onClick={startNextScan}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors border border-gray-200"
                    >
                        <RefreshCw className="h-5 w-5" />
                        {scannedResult.attendanceMarked ? "Scan Next Person" : "Cancel & Scan Next"}
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default AttendanceSection;