import { Link } from 'react-router-dom';
import { Twitter, Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-navy-950 text-white transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">EF</span>
              </div>
              <span className="ml-2 text-xl font-display font-bold text-white">
                EventFesta
              </span>
            </div>
            <p className="text-gray-300 dark:text-gray-400 mb-4">
              Your ultimate destination for discovering and managing amazing events. Connect, learn, and grow with EventFesta.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/your-profile" target="_blank" rel="noopener noreferrer" className="text-gray-300 dark:text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://facebook.com/your-profile" target="_blank" rel="noopener noreferrer" className="text-gray-300 dark:text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/your-profile" target="_blank" rel="noopener noreferrer" className="text-gray-300 dark:text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/your-company" target="_blank" rel="noopener noreferrer" className="text-gray-300 dark:text-gray-400 hover:text-primary-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 dark:text-gray-400 hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-300 dark:text-gray-400 hover:text-primary-400 transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 dark:text-gray-400 hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 dark:text-gray-400 hover:text-primary-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 dark:text-gray-400 hover:text-primary-400 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-300 dark:text-gray-400 hover:text-primary-400 transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Events */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Events</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events/1" className="text-gray-300 dark:text-gray-400 hover:text-primary-400 transition-colors">
                  TechConf 2025
                </Link>
              </li>
              <li>
                <Link to="/events/2" className="text-gray-300 dark:text-gray-400 hover:text-primary-400 transition-colors">
                  AI Summit
                </Link>
              </li>
              <li>
                <Link to="/events/3" className="text-gray-300 dark:text-gray-400 hover:text-primary-400 transition-colors">
                  Developer Days
                </Link>
              </li>
              <li>
                <Link to="/events/4" className="text-gray-300 dark:text-gray-400 hover:text-primary-400 transition-colors">
                  Startup Showcase
                </Link>
              </li>
              <li>
                <Link to="/events/5" className="text-gray-300 dark:text-gray-400 hover:text-primary-400 transition-colors">
                  Cloud Computing Expo
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 dark:text-gray-400">
                  123 Tech Avenue, San Francisco, CA 94107
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-primary-400 flex-shrink-0" />
                <a href="tel:+14155552671" className="text-gray-300 dark:text-gray-400 hover:text-primary-400 transition-colors">
                  (415) 555-2671
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary-400 flex-shrink-0" />
                <a href="mailto:info@techevents.com" className="text-gray-300 dark:text-gray-400 hover:text-primary-400 transition-colors">
                  info@eventfesta.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-navy-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            &copy; {currentYear} EventFesta. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 dark:text-gray-500 text-sm hover:text-primary-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 dark:text-gray-500 text-sm hover:text-primary-400 transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-gray-400 dark:text-gray-500 text-sm hover:text-primary-400 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;