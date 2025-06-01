import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Award, Users, Clock, MapPin, Calendar, Check, ArrowRight } from 'lucide-react';

const AboutUsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "About Us - TechEvents";
  }, []);

  return (
    <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-6 leading-tight">
              Building Connections in the Tech Community
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              We're on a mission to bring tech professionals together through exceptional events that inspire innovation and foster collaboration.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">
                Our <span className="text-primary-500">Story</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                TechEvents was founded in 2020 by a group of tech enthusiasts who were frustrated with the fragmented nature of tech event discovery and management. We saw a need for a centralized platform that could connect tech professionals with quality events while giving organizers the tools they needed to succeed.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                What started as a simple event listing website has evolved into a comprehensive platform that serves thousands of tech professionals and organizers worldwide. Our team's passion for technology and community building drives everything we do.
              </p>
              <p className="text-lg text-gray-600">
                Today, we're proud to be the leading destination for tech event discovery, with a growing community of users who share our vision of a more connected and collaborative tech ecosystem.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="TechEvents team" 
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white rounded-xl shadow-lg p-6 max-w-xs">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-primary-100 text-primary-600 p-3 rounded-full">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">5+ Years</h4>
                    <p className="text-gray-600 text-sm">Connecting the tech community</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-100 text-primary-600 p-3 rounded-full">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">50,000+</h4>
                    <p className="text-gray-600 text-sm">Tech professionals in our network</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">
              Our <span className="text-primary-500">Mission</span>
            </h2>
            <p className="text-lg text-gray-600">
              We're driven by the belief that meaningful connections and knowledge sharing drive innovation in the tech industry. Our platform exists to:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Connect Communities",
                description: "Bring together tech professionals, experts, enthusiasts, and organizations through exceptional events.",
                icon: <Users className="h-6 w-6" />
              },
              {
                title: "Empower Organizers",
                description: "Provide event creators with powerful tools to plan, promote, and manage successful tech events.",
                icon: <Briefcase className="h-6 w-6" />
              },
              {
                title: "Foster Innovation",
                description: "Create environments where knowledge sharing and collaboration lead to new ideas and opportunities.",
                icon: <Award className="h-6 w-6" />
              }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 transition-all duration-300 hover:shadow-md hover:transform hover:-translate-y-1">
                <div className="bg-primary-100 text-primary-600 p-3 rounded-full inline-block mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-display font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Milestones */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">
              Our <span className="text-primary-500">Journey</span>
            </h2>
            <p className="text-lg text-gray-600">
              Key milestones in our mission to transform tech event management
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
            
            <div className="space-y-12 md:space-y-0 relative">
              {[
                {
                  year: "2020",
                  title: "TechEvents Founded",
                  description: "Started as a simple listing platform for tech events in San Francisco.",
                  isLeft: true
                },
                {
                  year: "2021",
                  title: "National Expansion",
                  description: "Expanded to cover tech events across the United States with enhanced search features.",
                  isLeft: false
                },
                {
                  year: "2022",
                  title: "Organizer Tools Launch",
                  description: "Introduced comprehensive tools for event organizers to manage registrations and promotions.",
                  isLeft: true
                },
                {
                  year: "2023",
                  title: "Global Reach",
                  description: "Expanded globally with events in over 50 countries and translation into 10 languages.",
                  isLeft: false
                },
                {
                  year: "2024",
                  title: "Virtual Event Platform",
                  description: "Launched integrated virtual event capabilities to support hybrid and online-only formats.",
                  isLeft: true
                },
                {
                  year: "2025",
                  title: "TechEvents Community",
                  description: "Introduced community features allowing professionals to connect beyond events.",
                  isLeft: false
                }
              ].map((milestone, index) => (
                <div 
                  key={index} 
                  className={`md:flex items-center ${index % 2 === 0 ? 'md:justify-end' : ''} relative mb-12 md:mb-24`}
                >
                  {/* Timeline dot */}
                  <div className="hidden md:block absolute left-1/2 w-4 h-4 bg-primary-500 rounded-full transform -translate-x-1/2 z-10"></div>
                  
                  {/* Content box */}
                  <div className={`bg-white rounded-xl shadow-md p-6 md:max-w-md relative ${
                    index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'
                  }`}>
                    <div className="absolute top-6 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full -left-3">
                      {milestone.year}
                    </div>
                    <div className="pl-10">
                      <h3 className="text-xl font-display font-bold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">
              Meet Our <span className="text-primary-500">Team</span>
            </h2>
            <p className="text-lg text-gray-600">
              The passionate individuals behind TechEvents who are dedicated to connecting the tech community
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Alex Chen",
                role: "CEO & Co-Founder",
                bio: "Former software engineer with a passion for community building and event management.",
                image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              },
              {
                name: "Sarah Johnson",
                role: "CTO & Co-Founder",
                bio: "Full-stack developer who loves creating tools that help people connect and collaborate.",
                image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              },
              {
                name: "Michael Rodriguez",
                role: "Head of Partnerships",
                bio: "Experienced event manager who specializes in building strategic relationships with organizers.",
                image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              },
              {
                name: "Emily Wong",
                role: "Lead Designer",
                bio: "UX/UI specialist focused on creating intuitive and delightful experiences for our users.",
                image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              }
            ].map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-display font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              {
                value: "500+",
                label: "Tech Events Monthly",
                icon: <Calendar className="h-8 w-8 mb-4 mx-auto text-primary-300" />
              },
              {
                value: "50,000+",
                label: "Active Users",
                icon: <Users className="h-8 w-8 mb-4 mx-auto text-primary-300" />
              },
              {
                value: "200+",
                label: "Cities Worldwide",
                icon: <MapPin className="h-8 w-8 mb-4 mx-auto text-primary-300" />
              },
              {
                value: "1M+",
                label: "Hours of Networking",
                icon: <Clock className="h-8 w-8 mb-4 mx-auto text-primary-300" />
              }
            ].map((stat, index) => (
              <div key={index} className="p-6">
                {stat.icon}
                <h3 className="text-4xl font-display font-bold mb-2">{stat.value}</h3>
                <p className="text-primary-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">
              Our <span className="text-primary-500">Values</span>
            </h2>
            <p className="text-lg text-gray-600">
              The principles that guide us in our mission to connect the tech community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Community First",
                description: "We prioritize the needs of our community in every decision we make, ensuring our platform serves tech professionals and organizers effectively."
              },
              {
                title: "Innovation",
                description: "We continuously improve our platform with cutting-edge features that address the evolving needs of the tech event ecosystem."
              },
              {
                title: "Inclusivity",
                description: "We're committed to making tech events accessible to everyone, regardless of background, experience level, or location."
              },
              {
                title: "Quality",
                description: "We maintain high standards for the events on our platform, ensuring our users have access to valuable, well-organized experiences."
              }
            ].map((value, index) => (
              <div key={index} className="flex">
                <div className="bg-primary-100 text-primary-600 p-3 rounded-full h-min mt-1 mr-4">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-8 md:p-12">
                <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
                  Join the TechEvents Community
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Whether you're looking to attend events or organize them, we're here to help you connect with the tech community.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/signup?role=participant" 
                    className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors inline-flex items-center justify-center"
                  >
                    Join as Participant <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link 
                    to="/signup?role=organization" 
                    className="px-6 py-3 bg-white border-2 border-primary-500 text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors inline-flex items-center justify-center"
                  >
                    Register as Organizer
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 bg-primary-600 p-8 md:p-12 text-white">
                <h3 className="text-2xl font-display font-bold mb-4">Contact Us</h3>
                <p className="mb-6">
                  Have questions or feedback? We'd love to hear from you!
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-3 text-primary-300" />
                    <span>123 Tech Avenue, San Francisco, CA 94107</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-5 w-5 mr-3 flex items-center justify-center text-primary-300">
                      📧
                    </div>
                    <a href="mailto:info@techevents.com" className="hover:underline">
                      info@techevents.com
                    </a>
                  </div>
                  <div className="flex items-center">
                    <div className="h-5 w-5 mr-3 flex items-center justify-center text-primary-300">
                      📞
                    </div>
                    <a href="tel:+14155552671" className="hover:underline">
                      (415) 555-2671
                    </a>
                  </div>
                </div>
                <div className="mt-6">
                  <Link 
                    to="/contact" 
                    className="px-6 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center"
                  >
                    Get in Touch
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;