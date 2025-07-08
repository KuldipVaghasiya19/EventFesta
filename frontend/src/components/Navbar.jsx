import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check for authentication status from localStorage or context
    const authStatus = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('userRole');
    
    if (authStatus === 'true') {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, [location]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userToken');
    
    // Update state
    setIsLoggedIn(false);
    setUserRole(null);
    
    // Redirect to home page
    navigate('/');
    
    // Show logout success message (optional)
    // You can add a toast notification here if you have one
    console.log('User logged out successfully');
  };

  const getDashboardLink = () => {
    if (userRole === 'organization') {
      return '/dashboard/organization';
    } else if (userRole === 'participant') {
      return '/dashboard/participant';
    }
    return '/';
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen 
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-md py-2' 
          : 'bg-black/20 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">EF</span>
              </div>
              <span className={`ml-2 text-xl font-display font-bold ${
                isScrolled || isMenuOpen 
                  ? 'text-primary-700 dark:text-white' 
                  : 'text-white'
              }`}>
                EventFesta
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`font-medium transition-all duration-300 relative group ${
                location.pathname === '/' 
                  ? 'text-primary-500' 
                  : isScrolled 
                    ? 'text-gray-800 dark:text-gray-200 hover:text-primary-500'
                    : 'text-white hover:text-primary-400'
              }`}
            >
              Home
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full ${
                location.pathname === '/' ? 'w-full' : ''
              }`}></span>
            </Link>
            <Link 
              to="/events" 
              className={`font-medium transition-all duration-300 relative group ${
                location.pathname === '/events' 
                  ? 'text-primary-500' 
                  : isScrolled 
                    ? 'text-gray-800 dark:text-gray-200 hover:text-primary-500'
                    : 'text-white hover:text-primary-400'
              }`}
            >
              Events
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full ${
                location.pathname === '/events' ? 'w-full' : ''
              }`}></span>
            </Link>
            <Link 
              to="/about" 
              className={`font-medium transition-all duration-300 relative group ${
                location.pathname === '/about' 
                  ? 'text-primary-500' 
                  : isScrolled 
                    ? 'text-gray-800 dark:text-gray-200 hover:text-primary-500'
                    : 'text-white hover:text-primary-400'
              }`}
            >
              About Us
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full ${
                location.pathname === '/about' ? 'w-full' : ''
              }`}></span>
            </Link>
            <Link 
              to="/contact" 
              className={`font-medium transition-all duration-300 relative group ${
                location.pathname === '/contact' 
                  ? 'text-primary-500' 
                  : isScrolled 
                    ? 'text-gray-800 dark:text-gray-200 hover:text-primary-500'
                    : 'text-white hover:text-primary-400'
              }`}
            >
              Contact Us
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full ${
                location.pathname === '/contact' ? 'w-full' : ''
              }`}></span>
            </Link>

            {/* Authentication Section */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={getDashboardLink()}
                  className={`font-medium transition-all duration-300 relative group ${
                    location.pathname.includes('/dashboard') 
                      ? 'text-primary-500' 
                      : isScrolled 
                        ? 'text-gray-800 dark:text-gray-200 hover:text-primary-500'
                        : 'text-white hover:text-primary-400'
                  }`}
                >
                  Dashboard
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full ${
                    location.pathname.includes('/dashboard') ? 'w-full' : ''
                  }`}></span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsAuthDropdownOpen(!isAuthDropdownOpen)}
                  className={`flex items-center font-medium transition-all duration-300 relative group ${
                    isScrolled 
                      ? 'text-gray-800 dark:text-gray-200 hover:text-primary-500'
                      : 'text-white hover:text-primary-400'
                  }`}
                >
                  Login/Signup <ChevronDown className="ml-1 h-4 w-4" />
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
                
                {isAuthDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 z-50 animate-fade-in border dark:border-slate-700">
                    <Link 
                      to="/login?role=participant" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-slate-700 hover:text-primary-500 transition-colors"
                    >
                      Login as Participant
                    </Link>
                    <Link 
                      to="/login?role=organization" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-slate-700 hover:text-primary-500 transition-colors"
                    >
                      Login as Organization
                    </Link>
                    <div className="border-t border-gray-200 dark:border-slate-600 my-1"></div>
                    <Link 
                      to="/signup?role=participant" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-slate-700 hover:text-primary-500 transition-colors"
                    >
                      Signup as Participant
                    </Link>
                    <Link 
                      to="/signup?role=organization" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-slate-700 hover:text-primary-500 transition-colors"
                    >
                      Signup as Organization
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? 
                <X className={`h-6 w-6 ${isScrolled ? 'text-gray-800 dark:text-gray-200' : 'text-white'}`} /> : 
                <Menu className={`h-6 w-6 ${isScrolled ? 'text-gray-800 dark:text-gray-200' : 'text-white'}`} />
              }
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 animate-fade-in border dark:border-slate-700">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className={`font-medium text-gray-800 dark:text-gray-200 hover:text-primary-500 transition-colors ${
                  location.pathname === '/' ? 'text-primary-500' : ''
                }`}
              >
                Home
              </Link>
              <Link 
                to="/events" 
                className={`font-medium text-gray-800 dark:text-gray-200 hover:text-primary-500 transition-colors ${
                  location.pathname === '/events' ? 'text-primary-500' : ''
                }`}
              >
                Events
              </Link>
              <Link 
                to="/about" 
                className={`font-medium text-gray-800 dark:text-gray-200 hover:text-primary-500 transition-colors ${
                  location.pathname === '/about' ? 'text-primary-500' : ''
                }`}
              >
                About Us
              </Link>
              <Link 
                to="/contact" 
                className={`font-medium text-gray-800 dark:text-gray-200 hover:text-primary-500 transition-colors ${
                  location.pathname === '/contact' ? 'text-primary-500' : ''
                }`}
              >
                Contact Us
              </Link>
              
              <div className="border-t border-gray-200 dark:border-slate-600 pt-3">
                {isLoggedIn ? (
                  <div className="space-y-3">
                    <Link
                      to={getDashboardLink()}
                      className={`block font-medium text-gray-800 dark:text-gray-200 hover:text-primary-500 transition-colors ${
                        location.pathname.includes('/dashboard') ? 'text-primary-500' : ''
                      }`}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Login/Signup</p>
                    <Link 
                      to="/login?role=participant" 
                      className="block py-1.5 text-gray-700 dark:text-gray-200 hover:text-primary-500 transition-colors"
                    >
                      Login as Participant
                    </Link>
                    <Link 
                      to="/login?role=organization" 
                      className="block py-1.5 text-gray-700 dark:text-gray-200 hover:text-primary-500 transition-colors"
                    >
                      Login as Organization
                    </Link>
                    <Link 
                      to="/signup?role=participant" 
                      className="block py-1.5 text-gray-700 dark:text-gray-200 hover:text-primary-500 transition-colors"
                    >
                      Signup as Participant
                    </Link>
                    <Link 
                      to="/signup?role=organization" 
                      className="block py-1.5 text-gray-700 dark:text-gray-200 hover:text-primary-500 transition-colors"
                    >
                      Signup as Organization
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;