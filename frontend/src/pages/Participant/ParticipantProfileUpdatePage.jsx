import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, User, Mail, Building, GraduationCap, AlertCircle } from 'lucide-react';

const ParticipantProfileUpdatePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    university: '',
    course: '',
    currentlyStudyingOrNot: true,
  });
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('techevents_user') || sessionStorage.getItem('techevents_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData && userData.id) { // Check for valid user object
        setUser(userData);
        setProfileData({
          name: userData.name || '',
          email: userData.email || '',
          university: userData.university || '',
          course: userData.course || '',
          currentlyStudyingOrNot: userData.currentlyStudyingOrNot !== undefined ? userData.currentlyStudyingOrNot : true,
        });
      } else {
        // If data is malformed, clear it and redirect
        localStorage.removeItem('techevents_user');
        sessionStorage.removeItem('techevents_user');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
    window.scrollTo(0, 0);
    document.title = "Update Profile - TechEvents";
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!profileData.name.trim()) newErrors.name = 'Name is required';
    if (!profileData.university.trim()) newErrors.university = 'University is required';
    if (!profileData.course.trim()) newErrors.course = 'Course is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null })); // Changed from '' to null for consistency
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch(`http://localhost:8080/api/participants/update/${user.id}`, {
        method: 'PUT',
        credentials: 'include', // Include session cookie
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          university: profileData.university,
          course: profileData.course,
          currentlyStudyingOrNot: profileData.currentlyStudyingOrNot
        }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('API endpoint not found. Please check if the server is running and the endpoint exists.');
        }
        if (response.status === 403) {
          throw new Error('Authorization failed. Your session may have expired. Please log in again.');
        }
        
        // Try to parse error response, but handle cases where it's not JSON
        let errorMessage = 'An unknown error occurred. Failed to update profile.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          // If response is not JSON, use status-based error message
          errorMessage = `Server error (${response.status}): ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const updatedUser = await response.json();
      
      // Update the user object in storage
      const storage = localStorage.getItem('techevents_user') ? localStorage : sessionStorage;
      storage.setItem('techevents_user', JSON.stringify(updatedUser));

      navigate('/dashboard/participant');

    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ api: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Display loading state until profile data is ready
  if (!profileData || !user) {
    return <div className="flex justify-center items-center min-h-screen">Loading Profile...</div>;
  }

  return (
    <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link to="/dashboard/participant" className="flex items-center text-gray-600 hover:text-primary-500 transition-colors mr-4">
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Dashboard
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Update <span className="text-primary-500">Profile</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Keep your profile up to date to get the best event recommendations.
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
              <h2 className="text-xl font-bold text-white">Personal Information</h2>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="text" id="name" name="name" value={profileData.name} onChange={handleChange} className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300'}`} placeholder="Your full name" />
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
                      placeholder="your.email@example.com"
                  />
              </div>
              <p className="mt-1 text-xs text-gray-500">Email address cannot be modified after registration</p>
              </div>

            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Educational Information</h2>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">University/College <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="text" id="university" name="university" value={profileData.university} onChange={handleChange} className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${errors.university ? 'border-red-500' : 'border-gray-300'}`} placeholder="Your university or college" />
                </div>
                {errors.university && <p className="mt-1 text-sm text-red-500">{errors.university}</p>}
              </div>
              <div>
                <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">Course/Program <span className="text-red-500">*</span></label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="text" id="course" name="course" value={profileData.course} onChange={handleChange} className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${errors.course ? 'border-red-500' : 'border-gray-300'}`} placeholder="Your course or program" />
                </div>
                {errors.course && <p className="mt-1 text-sm text-red-500">{errors.course}</p>}
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="currentlyStudyingOrNot" name="currentlyStudyingOrNot" checked={profileData.currentlyStudyingOrNot} onChange={handleChange} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                <label htmlFor="currentlyStudyingOrNot" className="ml-2 block text-sm text-gray-700">I am currently studying</label>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8 flex justify-end space-x-4">
              <Link to="/dashboard/participant" className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">Cancel</Link>
              <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center">
                {isSubmitting ? (
                  <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Updating...</>
                ) : (
                  <><Save className="h-5 w-5 mr-2" /> Update Profile</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParticipantProfileUpdatePage;