import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, User, Mail, MapPin, Building, Globe, Calendar, Phone } from 'lucide-react';

const ProfileUpdatePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'TechConf Solutions',
    email: 'contact@techconf.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'https://techconf.com',
    organizationType: 'Event Management Company',
    foundedYear: '2020',
    about: 'We are a leading event management company specializing in technology conferences and workshops. Our mission is to connect tech professionals and foster innovation through exceptional events.',
    profilePhoto: null,
    coverPhoto: null,
    socialLinks: {
      linkedin: 'https://linkedin.com/company/techconf',
      twitter: 'https://twitter.com/techconf',
      facebook: 'https://facebook.com/techconf'
    },
    contactPerson: {
      name: 'Sarah Johnson',
      role: 'Event Manager',
      email: 'sarah@techconf.com',
      phone: '+1 (555) 123-4568'
    }
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Update Profile - TechEvents";
  }, []);

  const organizationTypes = [
    'Technology Company',
    'Educational Institution',
    'Non-Profit Organization',
    'Government Agency',
    'Startup',
    'Consulting Firm',
    'Research Institute',
    'Event Management Company',
    'Other'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!profileData.name.trim()) newErrors.name = 'Organization name is required';
    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!profileData.location.trim()) newErrors.location = 'Location is required';
    if (!profileData.organizationType) newErrors.organizationType = 'Organization type is required';
    if (!profileData.foundedYear) newErrors.foundedYear = 'Founded year is required';
    if (!profileData.about.trim()) newErrors.about = 'About section is required';
    
    // Contact person validation
    if (!profileData.contactPerson.name.trim()) newErrors.contactPersonName = 'Contact person name is required';
    if (!profileData.contactPerson.email.trim()) {
      newErrors.contactPersonEmail = 'Contact person email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.contactPerson.email)) {
      newErrors.contactPersonEmail = 'Contact person email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (name.startsWith('contactPerson.')) {
      const field = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        contactPerson: {
          ...prev.contactPerson,
          [field]: value
        }
      }));
    } else if (name.startsWith('socialLinks.')) {
      const field = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [field]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: type === 'file' ? files[0] : value
      }));
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('Profile updated:', profileData);
        
        // Redirect back to dashboard
        navigate('/dashboard/organization');
      } catch (error) {
        console.error('Error updating profile:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link 
              to="/dashboard/organization"
              className="flex items-center text-gray-600 hover:text-primary-500 transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Dashboard
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Update <span className="text-primary-500">Profile</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Keep your organization profile up to date to attract more participants to your events.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Basic Information</h2>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Your organization name"
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="contact@organization.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={profileData.location}
                      onChange={handleChange}
                      className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                        errors.location ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="City, Country"
                    />
                  </div>
                  {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={profileData.website}
                      onChange={handleChange}
                      className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                      placeholder="https://yourorganization.com"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-2">
                    About Organization <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="about"
                    name="about"
                    value={profileData.about}
                    onChange={handleChange}
                    rows={4}
                    className={`px-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                      errors.about ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Tell us about your organization..."
                  />
                  {errors.about && <p className="mt-1 text-sm text-red-500">{errors.about}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Organization Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Organization Details</h2>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="organizationType" className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="organizationType"
                    name="organizationType"
                    value={profileData.organizationType}
                    onChange={handleChange}
                    className={`px-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors bg-white ${
                      errors.organizationType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select organization type</option>
                    {organizationTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.organizationType && <p className="mt-1 text-sm text-red-500">{errors.organizationType}</p>}
                </div>

                <div>
                  <label htmlFor="foundedYear" className="block text-sm font-medium text-gray-700 mb-2">
                    Founded Year <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      id="foundedYear"
                      name="foundedYear"
                      value={profileData.foundedYear}
                      onChange={handleChange}
                      min="1900"
                      max={new Date().getFullYear()}
                      className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                        errors.foundedYear ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="2020"
                    />
                  </div>
                  {errors.foundedYear && <p className="mt-1 text-sm text-red-500">{errors.foundedYear}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Person */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Primary Contact Person</h2>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contactPerson.name" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="contactPerson.name"
                      name="contactPerson.name"
                      value={profileData.contactPerson.name}
                      onChange={handleChange}
                      className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                        errors.contactPersonName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Contact person name"
                    />
                  </div>
                  {errors.contactPersonName && <p className="mt-1 text-sm text-red-500">{errors.contactPersonName}</p>}
                </div>

                <div>
                  <label htmlFor="contactPerson.role" className="block text-sm font-medium text-gray-700 mb-2">
                    Role/Title
                  </label>
                  <input
                    type="text"
                    id="contactPerson.role"
                    name="contactPerson.role"
                    value={profileData.contactPerson.role}
                    onChange={handleChange}
                    className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    placeholder="Event Manager"
                  />
                </div>

                <div>
                  <label htmlFor="contactPerson.email" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="contactPerson.email"
                      name="contactPerson.email"
                      value={profileData.contactPerson.email}
                      onChange={handleChange}
                      className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                        errors.contactPersonEmail ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="contact@organization.com"
                    />
                  </div>
                  {errors.contactPersonEmail && <p className="mt-1 text-sm text-red-500">{errors.contactPersonEmail}</p>}
                </div>

                <div>
                  <label htmlFor="contactPerson.phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      id="contactPerson.phone"
                      name="contactPerson.phone"
                      value={profileData.contactPerson.phone}
                      onChange={handleChange}
                      className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Social Media Links</h2>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="socialLinks.linkedin" className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    id="socialLinks.linkedin"
                    name="socialLinks.linkedin"
                    value={profileData.socialLinks.linkedin}
                    onChange={handleChange}
                    className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    placeholder="https://linkedin.com/company/yourorg"
                  />
                </div>

                <div>
                  <label htmlFor="socialLinks.twitter" className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter
                  </label>
                  <input
                    type="url"
                    id="socialLinks.twitter"
                    name="socialLinks.twitter"
                    value={profileData.socialLinks.twitter}
                    onChange={handleChange}
                    className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    placeholder="https://twitter.com/yourorg"
                  />
                </div>

                <div>
                  <label htmlFor="socialLinks.facebook" className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook
                  </label>
                  <input
                    type="url"
                    id="socialLinks.facebook"
                    name="socialLinks.facebook"
                    value={profileData.socialLinks.facebook}
                    onChange={handleChange}
                    className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    placeholder="https://facebook.com/yourorg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Photos</h2>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Photo
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      id="profilePhoto"
                      name="profilePhoto"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="profilePhoto"
                      className="flex items-center px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-300"
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      Choose Photo
                    </label>
                    {profileData.profilePhoto && (
                      <span className="text-sm text-gray-600">{profileData.profilePhoto.name}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="coverPhoto" className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Photo
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      id="coverPhoto"
                      name="coverPhoto"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="coverPhoto"
                      className="flex items-center px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-300"
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      Choose Photo
                    </label>
                    {profileData.coverPhoto && (
                      <span className="text-sm text-gray-600">{profileData.coverPhoto.name}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8">
              <div className="flex justify-end space-x-4">
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
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating Profile...
                    </div>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Update Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdatePage;