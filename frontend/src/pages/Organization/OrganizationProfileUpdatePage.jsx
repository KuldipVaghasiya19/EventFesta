import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Building, Mail, MapPin, Phone, Calendar, AlertCircle, FileText, Tag } from 'lucide-react';

const OrganizationProfileUpdatePage = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        location: '',
        contact: '',
        about: '',
        since: '',
        type: '',
    });
    const [errors, setErrors] = useState({});
    const [user, setUser] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Update Profile - EventFesta";

        // Retrieve the user object from storage.
        const storedUserString = localStorage.getItem('techevents_user') || sessionStorage.getItem('techevents_user');
        
        if (storedUserString) {
            // Since there's no token, the stored object is the user object itself.
            const userData = JSON.parse(storedUserString);
            
            if (userData && userData.id) { // Check for a valid user object.
                setUser(userData);
                setProfileData({
                    name: userData.name || '',
                    email: userData.email || '',
                    location: userData.location || '',
                    contact: userData.contact || '',
                    about: userData.about || '',
                    since: userData.since || '',
                    type: userData.type || '',
                });
            } else {
                // If data is malformed, clear it and redirect.
                localStorage.removeItem('techevents_user');
                sessionStorage.removeItem('techevents_user');
                navigate('/login');
            }
        } else {
            // If no user data is found, redirect to login.
            navigate('/login');
        }
    }, [navigate]);

    const organizationTypes = [
        'EDUCATIONAL', 'GOVERNMENT', 'CORPORATE', 'OTHER'
    ];

    const validateForm = () => {
        const newErrors = {};
        if (!profileData.name.trim()) newErrors.name = 'Organization name is required';
        if (!profileData.location.trim()) newErrors.location = 'Location is required';
        if (!profileData.type) newErrors.type = 'Organization type is required';
        if (!profileData.since) newErrors.since = 'Founding year is required';
        if (!profileData.about.trim()) newErrors.about = 'The "About" section is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !profileData || !validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const response = await fetch(`http://localhost:8080/api/organizations/${user.id}`, {
                method: 'PUT',
                credentials: 'include', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: profileData.name,
                    email: profileData.email,
                    location: profileData.location,
                    contact: profileData.contact,
                    about: profileData.about,
                    since: profileData.since,
                    type: profileData.type,
                }),
            });

            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error('Authorization failed. Your session may have expired. Please log in again.');
                }
                
                let errorMessage = 'An unknown error occurred. Failed to update profile.';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    errorMessage = `Server error (${response.status}): ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            const updatedUser = await response.json();

            // Update the user object in storage.
            const storage = localStorage.getItem('techevents_user') ? localStorage : sessionStorage;
            storage.setItem('techevents_user', JSON.stringify(updatedUser));

            navigate('/dashboard/organization');

        } catch (error) {
            console.error('Error updating profile:', error);
            setErrors({ api: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Display a loading state until the profile data is ready.
    if (!profileData || !user) {
        return <div className="flex justify-center items-center min-h-screen">Loading Profile...</div>;
    }

    return (
        <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <Link to="/dashboard/organization" className="flex items-center text-gray-600 hover:text-primary-500 transition-colors mr-4">
                            <ArrowLeft className="h-5 w-5 mr-1" />
                            Back to Dashboard
                        </Link>
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
                            Update <span className="text-primary-500">Profile</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Keep your organization's profile up to date to attract more participants.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
                    {errors.api && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center">
                            <AlertCircle className="h-6 w-6 mr-3"/>
                            <span>{errors.api}</span>
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
                            <h2 className="text-xl font-bold text-white">Basic Information</h2>
                        </div>
                        <div className="p-8 space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Organization Name <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input 
                                        type="text" 
                                        id="name" 
                                        name="name" 
                                        value={profileData.name} 
                                        onChange={handleChange} 
                                        className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300'}`} 
                                        placeholder="Your organization name"
                                    />
                                </div>
                                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                            </div>
                            
                            <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address <span className="text-red-500">*</span>
                                <span className="text-xs text-gray-500 ml-2">(Cannot be changed)</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    value={profileData.email} 
                                    readOnly
                                    className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed" 
                                    placeholder="contact@organization.com"
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Email address cannot be modified after registration</p>
                            </div>
                            
                            <div>
                                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input 
                                        type="tel" 
                                        id="contact" 
                                        name="contact" 
                                        value={profileData.contact} 
                                        onChange={handleChange} 
                                        className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors" 
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Location <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input 
                                        type="text" 
                                        id="location" 
                                        name="location" 
                                        value={profileData.location} 
                                        onChange={handleChange} 
                                        className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${errors.location ? 'border-red-500' : 'border-gray-300'}`} 
                                        placeholder="City, Country"
                                    />
                                </div>
                                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
                            <h2 className="text-xl font-bold text-white">Organization Details</h2>
                        </div>
                        <div className="p-8 space-y-6">
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">Organization Type <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <select 
                                        id="type" 
                                        name="type" 
                                        value={profileData.type} 
                                        onChange={handleChange} 
                                        className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors bg-white ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value="">Select organization type</option>
                                        {organizationTypes.map(type => 
                                            <option key={type} value={type}>
                                                {type.charAt(0) + type.slice(1).toLowerCase()}
                                            </option>
                                        )}
                                    </select>
                                </div>
                                {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
                            </div>
                            
                            <div>
                                <label htmlFor="since" className="block text-sm font-medium text-gray-700 mb-2">Founding Year <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input 
                                        type="number" 
                                        id="since" 
                                        name="since" 
                                        value={profileData.since} 
                                        onChange={handleChange} 
                                        min="1900" 
                                        max={new Date().getFullYear()} 
                                        className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${errors.since ? 'border-red-500' : 'border-gray-300'}`} 
                                        placeholder="e.g., 2020"
                                    />
                                </div>
                                {errors.since && <p className="mt-1 text-sm text-red-500">{errors.since}</p>}
                            </div>
                            
                            <div>
                                <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-2">About Organization <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <textarea 
                                        id="about" 
                                        name="about" 
                                        value={profileData.about} 
                                        onChange={handleChange} 
                                        rows={4} 
                                        className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${errors.about ? 'border-red-500' : 'border-gray-300'}`} 
                                        placeholder="Tell us about your organization, its mission, and what makes it unique..."
                                    />
                                </div>
                                {errors.about && <p className="mt-1 text-sm text-red-500">{errors.about}</p>}
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-8 flex justify-end space-x-4">
                            <Link 
                                to="/dashboard/organization" 
                                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </Link>
                            <button 
                                type="submit" 
                                disabled={isSubmitting} 
                                className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-5 w-5 mr-2" /> 
                                        Update Profile
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrganizationProfileUpdatePage;