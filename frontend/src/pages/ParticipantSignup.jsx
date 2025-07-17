import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Upload, User, Mail, Building, GraduationCap } from 'lucide-react';

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

const ParticipantSignup = ({ onSubmit, isSubmitting, submitError }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    course: '',
    currentlyStudyingOrNot: true,
    interests: [],
    profilePhoto: null,
    agreeTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [interestInput, setInterestInput] = useState('');

  const commonInterests = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Machine Learning', 
              'DevOps', 'Cloud Computing', 'Cybersecurity', 'Data Science', 
              'Mobile Development', 'Blockchain', 'AI/ML', 'UI/UX Design',
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
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
    if (!formData.university.trim()) newErrors.university = 'University is required';
    if (!formData.course.trim()) newErrors.course = 'Course is required';
    
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

  const addInterest = (interest) => {
    if (interest && !formData.interests.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
    setInterestInput('');
  };

  const removeInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInterest(interestInput);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const participantData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        university: formData.university,
        course: formData.course,
        currentlyStudyingOrNot: formData.currentlyStudyingOrNot,
        interest: formData.interests,
        profilePhoto: formData.profilePhoto
      };
      onSubmit(participantData);
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          
          <div className="space-y-6">
            <InputField
              id="name"
              name="name"
              placeholder="Full Name"
              icon={User}
              required
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />

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

        {/* Educational Information */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Educational Information</h3>
          
          <div className="space-y-6">
            <InputField
              id="university"
              name="university"
              placeholder="University/College Name"
              icon={Building}
              required
              value={formData.university}
              onChange={handleChange}
              error={errors.university}
            />

            <InputField
              id="course"
              name="course"
              placeholder="Course/Program"
              icon={GraduationCap}
              required
              value={formData.course}
              onChange={handleChange}
              error={errors.course}
            />

            <div className="flex items-center">
              <input
                type="checkbox"
                id="currentlyStudyingOrNot"
                name="currentlyStudyingOrNot"
                checked={formData.currentlyStudyingOrNot}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="currentlyStudyingOrNot" className="ml-2 text-sm text-gray-700">
                I am currently studying
              </label>
            </div>
          </div>
        </div>

        {/* Interests Section */}
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interests</h3>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {commonInterests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => addInterest(interest)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    formData.interests.includes(interest)
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add custom interest..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
              <button
                type="button"
                onClick={() => addInterest(interestInput)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add
              </button>
            </div>

            {formData.interests.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-700 mb-2">Selected interests:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm flex items-center gap-1"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
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
          {isSubmitting ? 'Creating account...' : 'Create Participant Account'}
        </button>
      </form>
    </div>
  );
};

export default ParticipantSignup;