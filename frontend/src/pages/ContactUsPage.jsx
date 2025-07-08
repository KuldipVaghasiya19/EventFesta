import { useState, useEffect } from 'react';
import { MapPin, Mail, Phone, Send, Check } from 'lucide-react';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Contact Us - EventFesta";
  }, []);
  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulate API call
      setTimeout(() => {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }, 800);
    }
  };
  
  return (
    <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-600 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-6 leading-tight">
              Get in Touch
            </h1>
            <p className="text-xl text-primary-100">
              Have questions, feedback, or want to learn more about our platform? We're here to help.
            </p>
          </div>
        </div>
      </section>
      
      {/* Contact Information & Form */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="md:flex">
                {/* Contact Information */}
                <div className="md:w-2/5 bg-primary-600 p-8 md:p-12 text-white">
                  <h2 className="text-2xl font-display font-bold mb-6">
                    Contact Information
                  </h2>
                  <p className="text-primary-100 mb-8">
                    Reach out to us through any of these channels or fill out the form. Our team will get back to you shortly.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <MapPin className="h-6 w-6 mr-4 text-primary-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold mb-1">Our Location</h3>
                        <p className="text-primary-100">
                          123 Tech Avenue<br />
                          San Francisco, CA 94107<br />
                          United States
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Mail className="h-6 w-6 mr-4 text-primary-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold mb-1">Email Us</h3>
                        <p className="text-primary-100">
                          <a href="mailto:info@eventfesta.com" className="hover:underline">
                            info@eventfesta.com
                          </a><br />
                          <a href="mailto:support@eventfesta.com" className="hover:underline">
                            support@eventfesta.com
                          </a>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="h-6 w-6 mr-4 text-primary-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold mb-1">Call Us</h3>
                        <p className="text-primary-100">
                          <a href="tel:+14155552671" className="hover:underline">
                            (415) 555-2671
                          </a><br />
                          Monday-Friday, 9AM-6PM PST
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-12">
                    <h3 className="font-bold mb-4">Connect With Us</h3>
                    <div className="flex space-x-4">
                      <a 
                        href="#" 
                        className="bg-primary-700 hover:bg-primary-800 h-10 w-10 rounded-full flex items-center justify-center transition-colors"
                      >
                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                        </svg>
                      </a>
                      <a 
                        href="#" 
                        className="bg-primary-700 hover:bg-primary-800 h-10 w-10 rounded-full flex items-center justify-center transition-colors"
                      >
                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.126 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </a>
                      <a 
                        href="#" 
                        className="bg-primary-700 hover:bg-primary-800 h-10 w-10 rounded-full flex items-center justify-center transition-colors"
                      >
                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.982 8.378 19 12c-.018 3.629-.285 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z" />
                        </svg>
                      </a>
                      <a 
                        href="#" 
                        className="bg-primary-700 hover:bg-primary-800 h-10 w-10 rounded-full flex items-center justify-center transition-colors"
                      >
                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Contact Form */}
                <div className="md:w-3/5 p-8 md:p-12">
                  <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
                    Send Us a Message
                  </h2>
                  
                  {submitted ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 animate-fade-in">
                      <div className="flex items-center mb-4">
                        <div className="bg-green-100 text-green-600 p-2 rounded-full mr-4">
                          <Check className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-display font-bold text-gray-900">
                          Message Sent Successfully!
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-6">
                        Thank you for reaching out to us. Our team will review your message and get back to you shortly, usually within 24-48 business hours.
                      </p>
                      <button 
                        onClick={() => setSubmitted(false)}
                        className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`px-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="John Doe"
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address <span className="text-red-500">*</span>
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
                          placeholder="john.doe@example.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                          Subject <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className={`px-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                            errors.subject ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="How can we help you?"
                        />
                        {errors.subject && (
                          <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={6}
                          className={`px-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                            errors.message ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Please provide details about your inquiry..."
                        ></textarea>
                        {errors.message && (
                          <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                        )}
                      </div>
                      
                      <button
                        type="submit"
                        className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors flex items-center"
                      >
                        Send Message <Send className="ml-2 h-5 w-5" />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Visit Our <span className="text-primary-500">Office</span>
            </h2>
            <p className="text-lg text-gray-600">
              Located in the heart of San Francisco's tech district, our office is easy to reach by public transport.
            </p>
          </div>
          
          <div className="bg-gray-100 rounded-xl overflow-hidden h-96 shadow-md">
            {/* This would typically be an embedded map */}
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <div className="text-center p-8">
                <MapPin className="h-12 w-12 text-primary-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">TechEvents Headquarters</h3>
                <p className="text-gray-600">123 Tech Avenue, San Francisco, CA 94107</p>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 inline-block px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Frequently Asked <span className="text-primary-500">Questions</span>
            </h2>
            <p className="text-lg text-gray-600">
              Find quick answers to common questions about our platform
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "How do I register for an event?",
                answer: "To register for an event, navigate to the event page and click the 'Register' button. You'll need to create an account if you don't already have one, then follow the registration process."
              },
              {
                question: "What types of events are listed on your platform?",
                answer: "We list a wide range of tech events, including conferences, workshops, hackathons, meetups, webinars, and networking events focused on technology and innovation."
              },
              {
                question: "How can I list my event on TechEvents?",
                answer: "To list your event, sign up as an organizer and follow the event creation process. You'll be able to add details, set up ticketing, and promote your event to our community."
              },
              {
                question: "Are there fees for listing events?",
                answer: "Basic event listings are free. We offer premium features for event promotion and management at different pricing tiers. Visit our pricing page for details."
              },
              {
                question: "Can I get a refund for an event ticket?",
                answer: "Refund policies are set by individual event organizers. Please check the specific event's refund policy on their event page or contact the organizer directly."
              },
              {
                question: "How do I become a speaker at events?",
                answer: "Each event has its own speaker selection process. Look for 'Call for Speakers' or 'Call for Papers' announcements on event pages, or contact organizers directly."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Didn't find what you're looking for?
            </p>
            <a 
              href="mailto:support@eventfesta.com" 
              className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
            >
              Email our support team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUsPage;