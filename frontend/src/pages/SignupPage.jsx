import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import OrganizationSignup from './OrganizationSignup';
import ParticipantSignup from './ParticipantSignup';

// Main Signup Page Component
const SignupPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get('role') || 'participant';
  
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');


  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `Sign Up as ${role.charAt(0).toUpperCase() + role.slice(1)} - EventFesta`;
  }, [role]);

  const handleSendOtp = async (email) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setOtpMessage('Please enter a valid email address.');
        return false;
    }
    setOtpMessage('Sending OTP...');
    try {
        const response = await fetch('http://localhost:8080/api/otp/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (response.ok) {
            setOtpMessage(data.message || 'OTP sent successfully!');
            return true;
        } else {
            setOtpMessage(data.message || 'Failed to send OTP.');
            return false;
        }
    } catch (error) {
        console.error('Error sending OTP:', error);
        setOtpMessage('Network error. Could not send OTP.');
        return false;
    }
  };


  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Prepare FormData for API
      const apiFormData = new FormData();
      
      // Add profile photo if exists
      if (formData.profilePhoto) {
        apiFormData.append('profilePhoto', formData.profilePhoto);
      }
      
      // Remove profilePhoto and otp from formData before JSON stringifying
      const { profilePhoto, otp, ...dataWithoutExtras } = formData;
      
      // Add JSON data to FormData
      apiFormData.append(role, JSON.stringify(dataWithoutExtras));
      
      // Make API call
      const response = await fetch(`http://localhost:8080/api/auth/register/${role}?otp=${otp}`, {
        method: 'POST',
        body: apiFormData
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Show success message
        setShowSuccess(true);
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate(`/login?role=${role}`, { 
            state: { 
              message: 'Account created successfully! Please login to continue.',
              email: formData.email 
            } 
          });
        }, 2000);
      } else {
        // Handle API errors
        const errorText = await response.text();
        setSubmitError(errorText || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show success message
  if (showSuccess) {
    return (
      <div className="pt-20 pb-16 bg-gray-50 min-h-screen flex items-center">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h2>
              <p className="text-gray-600 mb-4">
                Your {role} account has been created successfully.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to login page...
              </p>
              <div className="mt-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 bg-gray-50 min-h-screen flex items-center">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <Link to="/" className="inline-block">
                  <div className="flex items-center justify-center">
                    <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">EF</span>
                    </div>
                    <span className="ml-2 text-2xl font-display font-bold text-primary-700">
                      EventFesta
                    </span>
                  </div>
                </Link>
                <h1 className="text-2xl font-display font-bold text-gray-900 mt-6">
                  Sign Up as {role === 'organization' ? 'Organization' : 'Participant'}
                </h1>
                <p className="text-gray-600 mt-2">
                  Create your account to {role === 'organization' ? 'host events' : 'join events'}
                </p>
              </div>
              
              {/* Render appropriate signup form */}
              {role === 'organization' ? (
                <OrganizationSignup 
                  onSubmit={handleSubmit} 
                  onSendOtp={handleSendOtp}
                  isSubmitting={isSubmitting} 
                  submitError={submitError}
                  otpMessage={otpMessage}
                />
              ) : (
                <ParticipantSignup 
                  onSubmit={handleSubmit} 
                  onSendOtp={handleSendOtp}
                  isSubmitting={isSubmitting} 
                  submitError={submitError}
                  otpMessage={otpMessage}
                />
              )}
              
              {/* Footer Links */}
              <div className="text-center mt-6 space-y-2">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link 
                    to={`/login?role=${role}`}
                    className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
                
                <p className="text-sm text-gray-600">
                  {role === 'participant' ? 'Want to host events?' : 'Want to attend events?'}{' '}
                  <Link 
                    to={`/signup?role=${role === 'participant' ? 'organization' : 'participant'}`}
                    className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Sign up as {role === 'participant' ? 'organization' : 'participant'}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;