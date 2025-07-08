import { useState } from 'react';
import { User, Mail, Phone, MessageSquare, GraduationCap, Building, MapPin, CreditCard } from 'lucide-react';

const EventRegistrationForm = ({ event, onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    designation: '',
    experience: '',
    expectations: '',
    dietaryRestrictions: '',
    emergencyContact: '',
    emergencyPhone: '',
    tshirtSize: '',
    linkedinProfile: '',
    githubProfile: '',
    portfolioWebsite: '',
    previousEvents: '',
    motivation: '',
    skills: '',
    agreeTerms: false,
    agreeMarketing: false
  });

  const [errors, setErrors] = useState({});

  const tshirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const experienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.organization.trim()) newErrors.organization = 'Organization is required';
    if (!formData.designation.trim()) newErrors.designation = 'Designation is required';
    if (!formData.experience) newErrors.experience = 'Experience level is required';
    if (!formData.expectations.trim()) newErrors.expectations = 'Expectations are required';
    if (!formData.emergencyContact.trim()) newErrors.emergencyContact = 'Emergency contact is required';
    if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = 'Emergency phone is required';
    if (!formData.tshirtSize) newErrors.tshirtSize = 'T-shirt size is required';
    if (!formData.motivation.trim()) newErrors.motivation = 'Motivation is required';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const registrationFee = event?.registrationFees || 0;

  return (
    <div className="max-w-5xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-primary-500 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Personal Information</h2>
            <p className="text-primary-100 mt-2">Tell us about yourself</p>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
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
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="your.email@example.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="tshirtSize" className="block text-sm font-medium text-gray-700 mb-2">
                  T-shirt Size <span className="text-red-500">*</span>
                </label>
                <select
                  id="tshirtSize"
                  name="tshirtSize"
                  value={formData.tshirtSize}
                  onChange={handleChange}
                  className={`px-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors bg-white ${
                    errors.tshirtSize ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select size</option>
                  {tshirtSizes.map((size, index) => (
                    <option key={index} value={size}>{size}</option>
                  ))}
                </select>
                {errors.tshirtSize && <p className="mt-1 text-sm text-red-500">{errors.tshirtSize}</p>}
              </div>

              <div>
                <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-gray-700 mb-2">
                  Dietary Restrictions
                </label>
                <input
                  type="text"
                  id="dietaryRestrictions"
                  name="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={handleChange}
                  className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  placeholder="Vegetarian, Vegan, Allergies, etc."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-primary-500 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Professional Information</h2>
            <p className="text-primary-100 mt-2">Your professional background</p>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                  Organization/Company <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                      errors.organization ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Your company or university"
                  />
                </div>
                {errors.organization && <p className="mt-1 text-sm text-red-500">{errors.organization}</p>}
              </div>

              <div>
                <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-2">
                  Designation/Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className={`px-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                    errors.designation ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Software Engineer, Student, etc."
                />
                {errors.designation && <p className="mt-1 text-sm text-red-500">{errors.designation}</p>}
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors bg-white ${
                      errors.experience ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select your experience level</option>
                    {experienceLevels.map((level, index) => (
                      <option key={index} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                {errors.experience && <p className="mt-1 text-sm text-red-500">{errors.experience}</p>}
              </div>

              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                  Technical Skills
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  placeholder="React, Python, Machine Learning, etc."
                />
              </div>

              <div>
                <label htmlFor="linkedinProfile" className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  id="linkedinProfile"
                  name="linkedinProfile"
                  value={formData.linkedinProfile}
                  onChange={handleChange}
                  className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div>
                <label htmlFor="githubProfile" className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub Profile
                </label>
                <input
                  type="url"
                  id="githubProfile"
                  name="githubProfile"
                  value={formData.githubProfile}
                  onChange={handleChange}
                  className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  placeholder="https://github.com/yourusername"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="portfolioWebsite" className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio Website
                </label>
                <input
                  type="url"
                  id="portfolioWebsite"
                  name="portfolioWebsite"
                  value={formData.portfolioWebsite}
                  onChange={handleChange}
                  className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>
          </div>
        </div> */}

        {/* Event Specific Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-primary-500 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Event Information</h2>
            <p className="text-primary-100 mt-2">Your expectations and motivation</p>
          </div>
          <div className="p-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="expectations" className="block text-sm font-medium text-gray-700 mb-2">
                  What kind of topics do you expect from future events? <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    id="expectations"
                    name="expectations"
                    value={formData.expectations}
                    onChange={handleChange}
                    rows={4}
                    className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                      errors.expectations ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Tell us what you hope to learn or achieve from this event..."
                  />
                </div>
                {errors.expectations && <p className="mt-1 text-sm text-red-500">{errors.expectations}</p>}
              </div>

              <div>
                <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 mb-2">
                  Why do you want to attend this event? <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="motivation"
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleChange}
                  rows={3}
                  className={`px-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                    errors.motivation ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Share your motivation for attending this event..."
                />
                {errors.motivation && <p className="mt-1 text-sm text-red-500">{errors.motivation}</p>}
              </div>

              {/* <div>
                <label htmlFor="previousEvents" className="block text-sm font-medium text-gray-700 mb-2">
                  Previous Tech Events Attended
                </label>
                <textarea
                  id="previousEvents"
                  name="previousEvents"
                  value={formData.previousEvents}
                  onChange={handleChange}
                  rows={3}
                  className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  placeholder="List any relevant tech events you've attended before..."
                />
              </div> */}
            </div>
          </div>
        </div>

        {/* Emergency Contact
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-primary-500 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Emergency Contact</h2>
            <p className="text-primary-100 mt-2">For safety and security purposes</p>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                      errors.emergencyContact ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Emergency contact name"
                  />
                </div>
                {errors.emergencyContact && <p className="mt-1 text-sm text-red-500">{errors.emergencyContact}</p>}
              </div>

              <div>
                <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    id="emergencyPhone"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                      errors.emergencyPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Emergency contact phone"
                  />
                </div>
                {errors.emergencyPhone && <p className="mt-1 text-sm text-red-500">{errors.emergencyPhone}</p>}
              </div>
            </div>
          </div>
        </div> */}

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

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="agreeMarketing"
                      name="agreeMarketing"
                      checked={formData.agreeMarketing}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="agreeMarketing" className="text-gray-700">
                      I agree to receive marketing communications about future events and updates
                    </label>
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
              type="submit"
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
      </form>
    </div>
  );
};

export default EventRegistrationForm;