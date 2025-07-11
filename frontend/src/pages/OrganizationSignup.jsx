import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Upload, Mail, MapPin, Building, Briefcase, Phone } from 'lucide-react';

// Reusable Input Component
const InputField = ({ 
  id, name, type = 'text', placeholder, icon: Icon, required = false, 
  value, onChange, error, ...props 
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {placeholder} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder={placeholder}
        {...props}
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

// Password Field Component
const PasswordField = ({ 
  id, name, placeholder, value, onChange, error, show, onToggle 
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {placeholder} <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`px-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder="••••••••"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

const OrganizationSignup = ({ onSubmit, isSubmitting, submitError }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    type: '',
    location: '',
    since: '',
    about: '',
    contact: '',
    profilePhoto: null,
    agreeTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const organizationTypes = [
    { value: 'EDUCATIONAL', label: 'Educational Institution' },
    { value: 'GOVERNMENT', label: 'Government Organization' },
    { value: 'CORPORATE', label: 'Corporate/Company' },
    { value: 'OTHER', label: 'Other' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Organization name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.type) newErrors.type = 'Organization type is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.since) newErrors.since = 'Since year is required';
    if (!formData.contact.trim()) newErrors.contact = 'Contact information is required';
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const organizationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        type: formData.type,
        location: formData.location,
        since: parseInt(formData.since),
        about: formData.about,
        contact: formData.contact,
        profilePhoto: formData.profilePhoto
      };
      onSubmit(organizationData);
    }
  };

  return (
    <div>
      {/* Submit Error */}
      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Information</h3>
          
          <div className="space-y-6">
            <InputField
              id="name"
              name="name"
              placeholder="Organization Name"
              icon={Building}
              required
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                id="email"
                name="email"
                type="email"
                placeholder="Email Address"
                icon={Mail}
                required
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />

              <InputField
                id="location"
                name="location"
                placeholder="Location"
                icon={MapPin}
                required
                value={formData.location}
                onChange={handleChange}
                error={errors.location}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors bg-white ${
                      errors.type ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select organization type</option>
                    {organizationTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
              </div>

              <InputField
                id="since"
                name="since"
                type="number"
                placeholder="Since Year"
                required
                value={formData.since}
                onChange={handleChange}
                error={errors.since}
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>

            <InputField
              id="contact"
              name="contact"
              placeholder="Contact Information"
              icon={Phone}
              required
              value={formData.contact}
              onChange={handleChange}
              error={errors.contact}
            />

            <div>
              <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">
                About Organization
              </label>
              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows={3}
                className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                placeholder="Tell us about your organization..."
              />
            </div>

            <div>
              <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer border border-gray-300"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Choose Photo
                </label>
                {formData.profilePhoto && (
                  <span className="text-sm text-gray-600">{formData.profilePhoto.name}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PasswordField
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              show={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
            />
            
            <PasswordField
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              show={showConfirmPassword}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>
        </div>
        
        {/* Terms and Submit */}
        <div className="flex items-start">
          <input
            type="checkbox"
            id="agreeTerms"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
          />
          <div className="ml-3 text-sm">
            <label htmlFor="agreeTerms" className="text-gray-700">
              I agree to the{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                Privacy Policy
              </Link>
            </label>
            {errors.agreeTerms && (
              <p className="mt-1 text-sm text-red-500">{errors.agreeTerms}</p>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <UserPlus className="h-5 w-5 mr-2" />
          )}
          {isSubmitting ? 'Creating account...' : 'Create Organization Account'}
        </button>
      </form>
    </div>
  );
};

export default OrganizationSignup;