import React from 'react';
import { Search, FileText, Globe, Target, Settings, Bell, Users } from 'lucide-react';

// Custom CSS for 3D flip animation
const flipCardStyles = `
  .flip-card {
    perspective: 1000px;
  }
  
  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }
  
  .flip-card:hover .flip-card-inner {
    transform: rotateY(180deg);
  }
  
  .flip-card-front, .flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
  
  .flip-card-back {
    transform: rotateY(180deg);
  }
`;

const WhyChooseUs = () => {
  // Inject custom CSS
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = flipCardStyles;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const features = [
    {
      title: "Curated Tech Events",
      description: "Discover events specifically curated for the tech community, from workshops to conferences with expert speakers and cutting-edge topics.",
      icon: Search,
      color: "bg-blue-500"
    },
    {
      title: "Easy Registration",
      description: "Simple and secure registration process for both event organizers and participants with instant confirmations and seamless payment integration.",
      icon: FileText,
      color: "bg-green-500"
    },
    {
      title: "Network Opportunities",
      description: "Connect with industry professionals, experts, and like-minded tech enthusiasts through our integrated networking features and community platform.",
      icon: Globe,
      color: "bg-purple-500"
    },
    {
      title: "Personalized Recommendations",
      description: "Get event suggestions tailored to your interests, skills, and previous attendance using our advanced AI-powered recommendation engine.",
      icon: Target,
      color: "bg-yellow-500"
    },
    {
      title: "Event Management",
      description: "Powerful tools for organizers to create, promote, and manage successful events with analytics, attendee management, and marketing support.",
      icon: Settings,
      color: "bg-red-500"
    },
    {
      title: "Real-time Updates",
      description: "Stay informed with instant notifications about event changes, updates, and exclusive opportunities delivered directly to your preferred channels.",
      icon: Bell,
      color: "bg-indigo-500"
    },
    {
      title: "Community Building",
      description: "Foster lasting connections through post-event discussions, collaborative projects, and mentorship opportunities within our vibrant tech community.",
      icon: Users,
      color: "bg-teal-500"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
            Why Choose <span className="text-primary-400">EventFesta</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The best platform for discovering, managing, and hosting tech events with features designed for the tech community.
          </p>
        </div>
        
        {/* Improved Grid Layout */}
        <div className="max-w-7xl mx-auto">
          {/* Top Row - 2 cards */}
          <div className="flex justify-center gap-16 mb-16">
            {features.slice(0, 2).map((feature, index) => (
              <HexagonCard key={index} feature={feature} />
            ))}
          </div>
          
          {/* Middle Row - 3 cards */}
          <div className="flex justify-center gap-16 mb-16">
            {features.slice(2, 5).map((feature, index) => (
              <HexagonCard key={index + 2} feature={feature} />
            ))}
          </div>
          
          {/* Bottom Row - 2 cards */}
          <div className="flex justify-center gap-16">
            {features.slice(5, 7).map((feature, index) => (
              <HexagonCard key={index + 5} feature={feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const HexagonCard = ({ feature }) => {
  const IconComponent = feature.icon;
  
  return (
    <div className="flip-card w-80 h-80">
      <div className="flip-card-inner">
        {/* Front Face */}
        <div className="flip-card-front">
          <div className="relative w-full h-full">
            {/* Hexagon Shape */}
            <div className="absolute inset-0 bg-white shadow-xl transform rotate-12 rounded-3xl hover:shadow-2xl transition-all duration-500"></div>
            <div className="absolute inset-3 bg-gradient-to-br from-blue-500 to-blue-600 transform rotate-12 rounded-3xl"></div>
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-10">
              <div className="mb-8 transform hover:scale-110 transition-transform duration-500">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <IconComponent className="w-12 h-12 text-primary-400" />
                </div>
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-3 leading-tight">
                {feature.title}
              </h3>
              <div className="w-20 h-1 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Back Face */}
        <div className="flip-card-back">
          <div className="relative w-full h-full">
            {/* Hexagon Shape */}
            <div className="absolute inset-0 bg-white shadow-xl transform rotate-12 rounded-3xl"></div>
            <div className="absolute inset-3 bg-gradient-to-br from-gray-800 to-gray-900 transform rotate-12 rounded-3xl"></div>
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-10">
              <div className="mb-6">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <IconComponent className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-6">
                {feature.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;