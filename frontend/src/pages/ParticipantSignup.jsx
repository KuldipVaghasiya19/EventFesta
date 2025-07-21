import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Upload, User, Mail, Building, GraduationCap, KeyRound, MessageSquare } from 'lucide-react';

const ParticipantSignup = ({ onSubmit, onSendOtp, isSubmitting, submitError, otpMessage }) => {
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
    agreeTerms: false,
    otp: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [interestInput, setInterestInput] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

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
    if (isOtpSent && !formData.otp.trim()) newErrors.otp = 'OTP is required';
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

  const handleSendOtpClick = async () => {
    const otpSentSuccessfully = await onSendOtp(formData.email);
    if (otpSentSuccessfully) {
      setIsOtpSent(true);
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
        profilePhoto: formData.profilePhoto,
        otp: formData.otp
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
            {/* Name, Email, OTP */}
            <InputField id="name" name="name" placeholder="Full Name" icon={User} required value={formData.name} onChange={handleChange} error={errors.name} />

            {/* Email Field */}
            <InputField id="email" name="email" type="email" placeholder="Email Address" icon={Mail} required value={formData.email} onChange={handleChange} error={errors.email} disabled={isOtpSent} />

            {/* Send OTP Button - Now on its own line */}
            <button type="button" onClick={handleSendOtpClick} disabled={!formData.email || isOtpSent || isSubmitting} className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium">
                {isOtpSent ? 'OTP Sent' : 'Send OTP'}
            </button>

            {otpMessage && <p className="text-sm text-primary-600 -mt-4">{otpMessage}</p>}
            {isOtpSent && (
              <InputField id="otp" name="otp" placeholder="Enter OTP" icon={KeyRound} required value={formData.otp} onChange={handleChange} error={errors.otp} />
            )}

            {/* Profile Photo */}
            <div>
              <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700 mb-1">
                Profile Photo
              </label>
              <div className="flex items-center space-x-4">
                <input type="file" id="profilePhoto" name="profilePhoto" accept="image/*" onChange={handleChange} className="hidden" />
                <label htmlFor="profilePhoto" className="flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer border border-gray-300">
                  <Upload className="h-5 w-5 mr-2" />
                  Choose Photo
                </label>
                {formData.profilePhoto && (<span className="text-sm text-gray-600">{formData.profilePhoto.name}</span>)}
              </div>
            </div>
          </div>
        </div>

        {/* Educational Information */}
        <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Educational Background</h3>
            <div className="space-y-6">
                <InputField id="university" name="university" placeholder="University/College" icon={Building} required value={formData.university} onChange={handleChange} error={errors.university} />
                <InputField id="course" name="course" placeholder="Course/Field of Study" icon={GraduationCap} required value={formData.course} onChange={handleChange} error={errors.course} />
                <div className="flex items-center">
                    <input type="checkbox" id="currentlyStudyingOrNot" name="currentlyStudyingOrNot" checked={formData.currentlyStudyingOrNot} onChange={handleChange} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                    <label htmlFor="currentlyStudyingOrNot" className="ml-2 block text-sm text-gray-900">Currently Studying</label>
                </div>
            </div>
        </div>

        {/* Interests */}
        <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Interests</h3>
            <div className="flex flex-wrap gap-2 mb-4">
                {formData.interests.map(interest => (
                    <span key={interest} className="flex items-center bg-primary-100 text-primary-700 text-sm font-medium px-3 py-1 rounded-full">
                        {interest}
                        <button type="button" onClick={() => removeInterest(interest)} className="ml-2 text-primary-500 hover:text-primary-700">&times;</button>
                    </span>
                ))}
            </div>
            <div className="relative">
                <InputField id="interestInput" name="interestInput" placeholder="Add an interest and press Enter" icon={MessageSquare} value={interestInput} onChange={(e) => setInterestInput(e.target.value)} onKeyPress={handleKeyPress} />
            </div>
             <div className="flex flex-wrap gap-2 mt-2">
                {commonInterests.map(interest => (
                    <button type="button" key={interest} onClick={() => addInterest(interest)} className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-300">
                        {interest}
                    </button>
                ))}
            </div>
        </div>

        {/* Security Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PasswordField id="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} error={errors.password} show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
            <PasswordField id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />
          </div>
        </div>

        {/* Terms and Submit */}
        <div className="flex items-start">
          <input type="checkbox" id="agreeTerms" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1" />
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
            {errors.agreeTerms && (<p className="mt-1 text-sm text-red-500">{errors.agreeTerms}</p>)}
          </div>
        </div>

        <button type="submit" disabled={isSubmitting || !isOtpSent} className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {isSubmitting ? ('Creating account...') : (<><UserPlus className="h-5 w-5 mr-2" /> Create Participant Account</>)}
        </button>
      </form>
    </div>
  );
};

const InputField = ({ id, name, type = 'text', placeholder, icon: Icon, required = false, value, onChange, error, ...props }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{placeholder} {required && <span className="text-red-500">*</span>}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />}
        <input type={type} id={id} name={name} value={value} onChange={onChange} className={`${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${error ? 'border-red-500' : 'border-gray-300'}`} placeholder={placeholder} {...props} />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );

  const PasswordField = ({ id, name, placeholder, value, onChange, error, show, onToggle }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{placeholder} <span className="text-red-500">*</span></label>
      <div className="relative">
        <input type={show ? 'text' : 'password'} id={id} name={name} value={value} onChange={onChange} className={`px-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${error ? 'border-red-500' : 'border-gray-300'}`} placeholder="••••••••" />
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">{show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
);

export default ParticipantSignup;