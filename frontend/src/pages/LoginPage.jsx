import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get('role') || 'participant';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `Login as ${role.charAt(0).toUpperCase() + role.slice(1)} - TechEvents`;
  }, [role]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const loginUser = async (credentials) => {
    try {
      const endpoint = role === 'organization'
        ? 'http://localhost:8080/api/auth/login/organization'
        : 'http://localhost:8080/api/auth/login/participant';

      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: "include", 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        }),
      });

      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');

      if (!response.ok) {
        let errorMessage = 'Login failed';
        if (isJson) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (jsonError) {
            console.error('Failed to parse error response as JSON:', jsonError);
          }
        } else {
          try {
            const textResponse = await response.text();
            errorMessage = textResponse || errorMessage;
          } catch (textError) {
            console.error('Failed to read error response as text:', textError);
          }
        }
        throw new Error(errorMessage);
      }

      if (isJson) {
        const userData = await response.json();
        return userData;
      } else {
        throw new Error('Expected JSON response but received non-JSON content');
      }
    } catch (error) {
      console.error('Login request error:', error);
      throw error;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      setErrors({});

      try {
        const credentials = {
          email: formData.email,
          password: formData.password
        };

        const userData = await loginUser(credentials);

       
        console.log(userData);
        if (formData.rememberMe) {
          // If checked, store data in localStorage for persistence across browser sessions.
          localStorage.setItem('techevents_user', JSON.stringify(userData));
        } else {
          // If not checked, store in sessionStorage to be cleared when the browser tab is closed.
          sessionStorage.setItem('techevents_user', JSON.stringify(userData));
        }

        // Navigate to the correct dashboard after successful login
        if (userData.role === 'ORGANIZATION') {
          navigate('/dashboard/organization', { replace: true });
        } else if (userData.role === 'PARTICIPANT') {
          navigate('/dashboard/participant', { replace: true });
        } else {
          // Fallback navigation in case role is not standard
          navigate('/', { replace: true });
        }

      } catch (error) {
        console.error('Login error:', error);
        setErrors({
          submit: error.message || 'Login failed. Please check your credentials and try again.'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="pt-20 pb-16 bg-gray-50 min-h-screen flex items-center">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <Link to="/" className="inline-block">
                  <div className="flex items-center justify-center">
                    <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">TE</span>
                    </div>
                    <span className="ml-2 text-2xl font-display font-bold text-primary-700">
                      TechEvents
                    </span>
                  </div>
                </Link>
                <h1 className="text-2xl font-display font-bold text-gray-900 mt-6">
                  Login as {role === 'organization' ? 'Organization' : 'Participant'}
                </h1>
                <p className="text-gray-600 mt-2">
                  Welcome back! Please enter your details.
                </p>
              </div>

              {errors.submit && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{errors.submit}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`px-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="you@example.com"
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`px-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      disabled={isSubmitting}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      disabled={isSubmitting}
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <LogIn className="h-5 w-5 mr-2" />
                  )}
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                </div>
              </div>

              <p className="text-center text-sm text-gray-600 mt-6">
                Don't have an account?{' '}
                <Link
                  to={`/signup?role=${role}`}
                  className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Sign up
                </Link>
              </p>

              {role === 'participant' ? (
                <p className="text-center text-sm text-gray-600 mt-4">
                  Want to host events?{' '}
                  <Link
                    to="/login?role=organization"
                    className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Login as organization
                  </Link>
                </p>
              ) : (
                <p className="text-center text-sm text-gray-600 mt-4">
                  Want to attend events?{' '}
                  <Link
                    to="/login?role=participant"
                    className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Login as participant
                  </Link >
                </p >
              )}
            </div >
          </div >
        </div >
      </div >
    </div >
  );
};

export default LoginPage;