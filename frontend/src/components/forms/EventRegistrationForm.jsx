import { useState } from 'react';
import { User, Mail, Phone, MessageSquare, GraduationCap, Building, CreditCard } from 'lucide-react';

const EventRegistrationForm = ({ event, onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    participantName: '',
    registeredEmail: '',
    contactEmail: '',
    phoneNumber: '',
    collegeOrOrganization: '',
    yearOrDesignation: '',
    expectation: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.participantName.trim()) newErrors.participantName = 'Participant name is required';
    if (!formData.registeredEmail.trim()) {
      newErrors.registeredEmail = 'Registered email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.registeredEmail)) {
      newErrors.registeredEmail = 'Registered email is invalid';
    }
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Contact email is invalid';
    }
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.collegeOrOrganization.trim()) newErrors.collegeOrOrganization = 'College/Organization is required';
    if (!formData.yearOrDesignation.trim()) newErrors.yearOrDesignation = 'Year/Designation is required';
    if (!formData.expectation.trim()) newErrors.expectation = 'Expectation is required';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms and conditions';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const registrationFee = event?.registrationFees || 0;

  return (
    <div className="max-w-4xl mx-auto pt-24 px-4 pb-8">
      <div className="space-y-8">
        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-primary-500 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Personal Information</h2>
            <p className="text-primary-100 mt-2">Tell us about yourself</p>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="participantName" className="block text-sm font-medium text-gray-700 mb-2">
                  Participant Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="participantName"
                    name="participantName"
                    value={formData.participantName}
                    onChange={handleChange}
                    className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                      errors.participantName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.participantName && <p className="mt-1 text-sm text-red-500">{errors.participantName}</p>}
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                      errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+91 12345 67890"
                  />
                </div>
                {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>}
              </div>

              <div>
                <label htmlFor="registeredEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Registered Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="registeredEmail"
                    name="registeredEmail"
                    value={formData.registeredEmail}
                    onChange={handleChange}
                    className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                      errors.registeredEmail ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="your.registered@example.com"
                  />
                </div>
                {errors.registeredEmail && <p className="mt-1 text-sm text-red-500">{errors.registeredEmail}</p>}
                <p className="mt-1 text-xs text-gray-500">This email will receive the QR code for attendance</p>
              </div>

              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                      errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="your.contact@example.com"
                  />
                </div>
                {errors.contactEmail && <p className="mt-1 text-sm text-red-500">{errors.contactEmail}</p>}
                <p className="mt-1 text-xs text-gray-500">Alternative email for communication</p>
              </div>
            </div>
          </div>
        </div>

        {/* Academic/Professional Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-primary-500 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Academic/Professional Information</h2>
            <p className="text-primary-100 mt-2">Your educational and professional background</p>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="collegeOrOrganization" className="block text-sm font-medium text-gray-700 mb-2">
                  College/Organization <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="collegeOrOrganization"
                    name="collegeOrOrganization"
                    value={formData.collegeOrOrganization}
                    onChange={handleChange}
                    className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                      errors.collegeOrOrganization ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your college or organization name"
                  />
                </div>
                {errors.collegeOrOrganization && <p className="mt-1 text-sm text-red-500">{errors.collegeOrOrganization}</p>}
              </div>

              <div>
                <label htmlFor="yearOrDesignation" className="block text-sm font-medium text-gray-700 mb-2">
                  Year/Designation <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="yearOrDesignation"
                    name="yearOrDesignation"
                    value={formData.yearOrDesignation}
                    onChange={handleChange}
                    className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                      errors.yearOrDesignation ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 3rd Year, Software Engineer, etc."
                  />
                </div>
                {errors.yearOrDesignation && <p className="mt-1 text-sm text-red-500">{errors.yearOrDesignation}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Event Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-primary-500 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Event Information</h2>
            <p className="text-primary-100 mt-2">Your expectations from the event</p>
          </div>
          <div className="p-8">
            <div>
              <label htmlFor="expectation" className="block text-sm font-medium text-gray-700 mb-2">
                What do you expect from this event? <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  id="expectation"
                  name="expectation"
                  value={formData.expectation}
                  onChange={handleChange}
                  rows={4}
                  className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                    errors.expectation ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Share your expectations from this event..."
                />
              </div>
              {errors.expectation && <p className="mt-1 text-sm text-red-500">{errors.expectation}</p>}
            </div>
          </div>
        </div>

        {/* Terms and Payment */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-primary-500 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Terms & Payment</h2>
            <p className="text-primary-100 mt-2">Review and confirm your registration</p>
          </div>
          <div className="p-8">
            <div className="space-y-6">
              {/* Registration Fee Display */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="h-6 w-6 text-gray-600 mr-3" />
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Registration Fee</h3>
                      <p className="text-gray-600">One-time payment for event access</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary-600">
                      {registrationFee === 0 || registrationFee === '0' ? 'FREE' : `₹${registrationFee}`}
                    </div>
                    <p className="text-sm text-gray-500">per person</p>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="agreeTerms" className="text-gray-700">
                      I agree to the{' '}
                      <a href="#" className="text-primary-600 hover:text-primary-700 underline">
                        Terms and Conditions
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-primary-600 hover:text-primary-700 underline">
                        Privacy Policy
                      </a>{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    {errors.agreeTerms && (
                      <p className="mt-1 text-sm text-red-500">{errors.agreeTerms}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full flex justify-center items-center px-8 py-4 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Registration...
                </div>
              ) : (
                <>
                  {registrationFee === 0 || registrationFee === '0' ? (
                    'Register for Free'
                  ) : (
                    `Pay ₹${registrationFee} & Register`
                  )}
                  <CreditCard className="ml-3 h-6 w-6" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationForm;