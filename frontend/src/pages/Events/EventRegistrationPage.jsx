import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, LogIn, ShieldOff, XCircle } from 'lucide-react';
import EventRegistrationForm from '../../components/forms/EventRegistrationForm';

const AlreadyRegisteredPage = ({ event }) => (
    <div className="text-center bg-white rounded-xl shadow-sm border p-8">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">You are already registered!</h3>
        <p className="text-gray-600 mb-6">
            You have already registered for <strong>{event.title}</strong>. You can view your event details in your dashboard.
        </p>
        <Link to="/dashboard/participant" className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg">
            Go to Dashboard
        </Link>
    </div>
);


const EventRegistrationPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [registrationStatus, setRegistrationStatus] = useState(null);
    const [user, setUser] = useState(null);
    const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);


    useEffect(() => {
        const storedUser = localStorage.getItem('techevents_user') || sessionStorage.getItem('techevents_user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
            } catch (error) {
                console.error('Error parsing user data:', error);
                setUser(null);
            }
        }
    }, []);

    useEffect(() => {
        const fetchEventAndCheckRegistration = async () => {
            if (!id) return;
            try {
                setLoading(true);
                setError(null);

                // Fetch event details
                const eventResponse = await fetch(`http://localhost:8080/api/events/${id}`);
                if (!eventResponse.ok) {
                    throw new Error(eventResponse.status === 404 ? 'Event not found' : 'Failed to fetch event details');
                }
                const eventData = await eventResponse.json();
                const transformedEvent = {
                    ...eventData,
                    id: eventData.id,
                    date: eventData.eventDate,
                    image: eventData.imageUrl,
                    registrationFees: eventData.registrationFees || 0,
                    currentParticipants: eventData.currentParticipants || 0,
                    maxParticipants: eventData.maxParticipants || null,
                    lastRegistertDate: eventData.lastRegistertDate || null,
                    type: eventData.type || 'Tech Event',
                    organizer: eventData.organizer ? eventData.organizer.name : 'Event Organizer'
                };
                setEvent(transformedEvent);
                document.title = `Register for ${transformedEvent.title} - EventFesta`;

                // Check registration status if user is logged in
                if (user) {
                    const regResponse = await fetch(`http://localhost:8080/api/participants/${user.id}/events/${id}/is-registered`);
                    if (regResponse.ok) {
                        const { isRegistered } = await regResponse.json();
                        setIsAlreadyRegistered(isRegistered);
                    }
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEventAndCheckRegistration();
        window.scrollTo(0, 0);
    }, [id, user]);

    const isRegistrationOpen = (event) => {
        if (!event) return false;
        const now = new Date();
        const registrationDeadline = event.lastRegistertDate ? new Date(event.lastRegistertDate) : null;
        const eventDate = new Date(event.date);
        if (now > eventDate) return false;
        if (registrationDeadline && now > registrationDeadline) return false;
        if (event.maxParticipants && (event.currentParticipants >= event.maxParticipants)) return false;
        return true;
    };
    
    const handleSubmit = async (formData) => {
        if (!user || user.role.toLowerCase() !== 'participant') {
            setError("Only participants can register for events.");
            return;
        }

        setIsSubmitting(true);
        setRegistrationStatus(null);
        
        const registrationFee = event?.registrationFees || 0;

        // --- Flow for FREE events ---
        if (registrationFee === 0) {
            try {
                const response = await fetch(`http://localhost:8080/api/participants/${user.id}/events/${id}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                    credentials: 'include',
                });
                if (!response.ok) throw new Error(await response.text() || 'Free registration failed.');
                
                setRegistrationStatus({ type: 'success', message: 'Registration Successful!', details: 'Check your email for your QR code and event details.' });
                setTimeout(() => navigate('/dashboard/participant'), 4000);

            } catch (err) {
                setRegistrationStatus({ type: 'error', message: 'Registration Failed', details: err.message });
            } finally {
                setIsSubmitting(false);
            }
            return;
        }

        // --- Flow for PAID events ---
        try {
            // Create the order, now sending participant and event IDs for pre-check
            const orderResponse = await fetch(`http://localhost:8080/api/payment/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: registrationFee,
                    participantId: user.id, // Send participantId for the check
                    eventId: id             // Send eventId for the check
                }),
                credentials: 'include'
            });

            if (!orderResponse.ok) {
                // This will now catch the 409 Conflict error from the backend
                const errorData = await orderResponse.json();
                throw new Error(errorData.error || 'Failed to create payment order.');
            }
            
            const orderData = await orderResponse.json();
            
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
                amount: orderData.amount,
                currency: "INR",
                name: "EventFesta",
                description: `Registration for ${event.title}`,
                image: event.image,
                order_id: orderData.id,
                handler: async (response) => {
                    try {
                        const verificationPayload = {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            participantId: user.id,
                            eventId: id,
                            registrationData: formData
                        };

                        const verifyResponse = await fetch(`http://localhost:8080/api/payment/verify-and-register`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(verificationPayload),
                            credentials: 'include'
                        });

                        const result = await verifyResponse.json();
                        
                        if (verifyResponse.ok && result.status === 'success') {
                            setRegistrationStatus({
                                type: 'success',
                                message: 'Payment & Registration Successful!',
                                details: result.message || 'Check your email for event details.'
                            });
                            setTimeout(() => navigate('/dashboard/participant'), 4000);
                        } else {
                            throw new Error(result.message || 'Verification or final registration failed.');
                        }
                    } catch (err) {
                        setRegistrationStatus({
                            type: 'error',
                            message: 'Post-Payment Step Failed',
                            details: err.message || 'Please contact support with your payment details.'
                        });
                    }
                },
                prefill: { name: user.name, email: user.email },
                theme: { color: "#3399cc" }
            };
            
            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', (response) => {
                setRegistrationStatus({
                    type: 'error',
                    message: 'Payment Failed!',
                    details: response.error.description || 'Please try again.'
                });
                setIsSubmitting(false); // Re-enable the button on failure
            });
            rzp1.open();

        } catch (err) {
            setRegistrationStatus({ type: 'error', message: 'An Error Occurred', details: err.message });
            setIsSubmitting(false);
        }
    };
    
    if (loading) return <div className="pt-20 pb-16 min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
    if (error && !event) return <div className="pt-20 pb-16 min-h-screen bg-gray-50 flex items-center justify-center">Error: {error}</div>;

    if (registrationStatus) {
        const isDuplicateError = registrationStatus.details && registrationStatus.details.toLowerCase().includes('already registered');
        
        return (
            <div className="pt-20 pb-16 min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-lg mx-auto">
                    {registrationStatus.type === 'success' ? (
                        <div className="bg-white p-10 rounded-xl shadow-lg">
                            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">{registrationStatus.message}</h2>
                            <p className="text-gray-600">{registrationStatus.details}</p>
                            <p className="text-gray-500 text-sm mt-4">Redirecting to your dashboard...</p>
                        </div>
                    ) : (
                        <div className="bg-white p-10 rounded-xl shadow-lg">
                            <XCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                {isDuplicateError ? 'Already Registered' : registrationStatus.message}
                            </h2>
                            <p className="text-gray-600 mb-6">
                                {isDuplicateError ? 'You can only register for an event once.' : registrationStatus.details}
                            </p>
                            {isDuplicateError ? (
                                <button 
                                    onClick={() => navigate('/events')} 
                                    className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg"
                                >
                                    Explore Other Events
                                </button>
                            ) : (
                                <button 
                                    onClick={() => setRegistrationStatus(null)} 
                                    className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg"
                                >
                                    Try Again
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }
    
    const canRegister = isRegistrationOpen(event);
    const isParticipant = user && user.role.toLowerCase() === 'participant';
    const isLoggedIn = !!user;

    return (
        <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mb-8">
                    <div className="flex items-center mb-4"><Link to={`/events/${id}`} className="flex items-center text-gray-600 hover:text-primary-500"><ArrowLeft className="h-5 w-5 mr-1" />Back to Event Details</Link></div>
                    <div className="text-center"><h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">Register for <span className="text-primary-500">{event.title}</span></h1></div>
                </div>
                <div className="max-w-2xl mx-auto">
                    {!isLoggedIn ? (
                        <div className="text-center bg-white rounded-xl shadow-sm border p-8"><LogIn className="h-12 w-12 text-primary-500 mx-auto mb-4" /><h3 className="text-xl font-bold text-gray-900 mb-2">Please Login to Register</h3><p className="text-gray-600 mb-6">You must be logged in as a participant to register for this event.</p><Link to={`/login?role=participant&redirect=/events/${id}/register`} className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg">Login as Participant</Link></div>
                    ) : !isParticipant ? (
                        <div className="text-center bg-white rounded-xl shadow-sm border p-8"><ShieldOff className="h-12 w-12 text-red-500 mx-auto mb-4" /><h3 className="text-xl font-bold text-gray-900 mb-2">Registration Not Available</h3><p className="text-gray-600 mb-6">Only participants can register for events.</p><Link to="/events" className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg">Browse Events</Link></div>
                    ) : isAlreadyRegistered ? (
                        <AlreadyRegisteredPage event={event} />
                    ) : !canRegister ? (
                        <div className="text-center bg-white rounded-xl shadow-sm border p-8"><AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" /><h3 className="text-lg font-bold text-gray-900 mb-2">Registration Is Closed</h3><p className="text-gray-600">Registration for this event is no longer available.</p></div>
                    ) : (
                        <EventRegistrationForm event={event} onSubmit={handleSubmit} isSubmitting={isSubmitting} initialUserData={{ name: user.name, email: user.email }} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventRegistrationPage;