import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const location = useLocation();

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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen ? 'bg-white/95 backdrop-blur-sm shadow-md py-2' : 'bg-black/20 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">TE</span>
              </div>
              <span className={`ml-2 text-xl font-display font-bold ${
                isScrolled || isMenuOpen ? 'text-primary-700' : 'text-white'
              }`}>
                TechEvents
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
                    ? 'text-gray-800 hover:text-primary-500'
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
                    ? 'text-gray-800 hover:text-primary-500'
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
                    ? 'text-gray-800 hover:text-primary-500'
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
                    ? 'text-gray-800 hover:text-primary-500'
                    : 'text-white hover:text-primary-400'
              }`}
            >
              Contact Us
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full ${
                location.pathname === '/contact' ? 'w-full' : ''
              }`}></span>
            </Link>

            {/* Auth Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsAuthDropdownOpen(!isAuthDropdownOpen)}
                className={`flex items-center font-medium transition-all duration-300 relative group ${
                  isScrolled 
                    ? 'text-gray-800 hover:text-primary-500'
                    : 'text-white hover:text-primary-400'
                }`}
              >
                Login/Signup <ChevronDown className="ml-1 h-4 w-4" />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
              
              {isAuthDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 animate-fade-in">
                  <Link 
                    to="/login?role=participant" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-500 transition-colors"
                  >
                    Login as Participant
                  </Link>
                  <Link 
                    to="/login?role=organization" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-500 transition-colors"
                  >
                    Login as Organization
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <Link 
                    to="/signup?role=participant" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-500 transition-colors"
                  >
                    Signup as Participant
                  </Link>
                  <Link 
                    to="/signup?role=organization" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-500 transition-colors"
                  >
                    Signup as Organization
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? 
              <X className={`h-6 w-6 ${isScrolled ? 'text-gray-800' : 'text-white'}`} /> : 
              <Menu className={`h-6 w-6 ${isScrolled ? 'text-gray-800' : 'text-white'}`} />
            }
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-4 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className={`font-medium text-gray-800 hover:text-primary-500 transition-colors ${
                  location.pathname === '/' ? 'text-primary-500' : ''
                }`}
              >
                Home
              </Link>
              <Link 
                to="/events" 
                className={`font-medium text-gray-800 hover:text-primary-500 transition-colors ${
                  location.pathname === '/events' ? 'text-primary-500' : ''
                }`}
              >
                Events
              </Link>
              <Link 
                to="/about" 
                className={`font-medium text-gray-800 hover:text-primary-500 transition-colors ${
                  location.pathname === '/about' ? 'text-primary-500' : ''
                }`}
              >
                About Us
              </Link>
              <Link 
                to="/contact" 
                className={`font-medium text-gray-800 hover:text-primary-500 transition-colors ${
                  location.pathname === '/contact' ? 'text-primary-500' : ''
                }`}
              >
                Contact Us
              </Link>
              
              <div className="border-t border-gray-200 pt-3">
                <p className="text-sm font-medium text-gray-500 mb-2">Login/Signup</p>
                <Link 
                  to="/login?role=participant" 
                  className="block py-1.5 text-gray-700 hover:text-primary-500 transition-colors"
                >
                  Login as Participant
                </Link>
                <Link 
                  to="/login?role=organization" 
                  className="block py-1.5 text-gray-700 hover:text-primary-500 transition-colors"
                >
                  Login as Organization
                </Link>
                <Link 
                  to="/signup?role=participant" 
                  className="block py-1.5 text-gray-700 hover:text-primary-500 transition-colors"
                >
                  Signup as Participant
                </Link>
                <Link 
                  to="/signup?role=organization" 
                  className="block py-1.5 text-gray-700 hover:text-primary-500 transition-colors"
                >
                  Signup as Organization
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;