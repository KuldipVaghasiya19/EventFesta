import React from 'react';
import { Search, FileText, Globe, Target, Settings, Bell, Users,BarChart } from 'lucide-react';

// Custom CSS for 3D flip animation
const flipCardStyles = `
  .flip-card {
    perspective: 1000px;
    height: 16rem; /* 256px, same as h-64 */
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
    border-radius: 1rem; /* rounded-2xl */
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  }
  
  .flip-card-back {
    transform: rotateY(180deg);
  }
`;


const WhyChooseUs = () => {
    // Inject custom CSS for the flip animation
    React.useEffect(() => {
        const style = document.createElement('style');
        style.textContent = flipCardStyles;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

  // The feature data for the cards, now with descriptions for the back
  const features = [
    {
      title: "Curated Tech Events",
      icon: Search,
      description: "Discover events specifically curated for the tech community, from workshops to conferences."
    },
    {
      title: "Easy Registration",
      icon: FileText,
      description: "A simple and secure registration process for both paid and free events."
    },
    {
      title: "Network Opportunities",
      icon: Globe,
      description: "Connect with industry professionals, experts, and like-minded tech enthusiasts."
    },
    {
      title: "Personalized Recommendations",
      icon: Target,
      description: "Get event suggestions tailored to your interests, skills, and previous attendance."
    },
    {
      title: "Organization Analytics",
      icon: BarChart,
      description: "Get detailed analytics and insights for all the events you organize to measure success."
    },
    {
      title: "Real-time Updates",
      icon: Bell,
      description: "Stay informed with instant notifications about event changes, updates, and opportunities."
    },
    {
      title: "Community Building",
      icon: Users,
      description: "Foster lasting connections through post-event discussions and collaborative projects."
    }
  ];

  // Slicing the features array to distribute them into three columns for the staggered layout
  const column1Features = features.slice(0, 2);
  const column2Features = features.slice(2, 5);
  const column3Features = features.slice(5, 7);

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
            Why Choose <span className="text-primary-400">EventFesta</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The best platform for discovering, managing, and hosting tech events with features designed for the tech community.
          </p>
        </div>
        
        {/* Responsive Staggered Grid Layout - UPDATED to items-center for better vertical alignment */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          
          {/* Column 1 */}
          <div className="w-full md:w-1/3 flex flex-col gap-8">
            {column1Features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
          
          {/* Column 2 - This column is pushed down on medium screens to create the staggered effect */}
          <div className="w-full md:w-1/3 flex flex-col gap-8 transform md:translate-y-16">
            {column2Features.map((feature, index) => (
              <FeatureCard key={index + 2} feature={feature} />
            ))}
          </div>

          {/* Column 3 */}
          <div className="w-full md:w-1/3 flex flex-col gap-8">
            {column3Features.map((feature, index) => (
              <FeatureCard key={index + 5} feature={feature} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ feature }) => {
  const IconComponent = feature.icon;
  
  return (
    <div className="flip-card">
        <div className="flip-card-inner">
            {/* Front Face */}
            <div className="flip-card-front bg-white p-8 flex flex-col items-center justify-center">
                <div className="mb-5">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                        <span className="absolute inset-0 bg-gradient-to-br from-primary-100 to-blue-100 rounded-xl transform -rotate-6"></span>
                        <div className="relative w-full h-full bg-white rounded-xl shadow-sm flex items-center justify-center">
                            <IconComponent className="w-10 h-10 text-primary-500" />
                        </div>
                    </div>
                </div>
                <h3 className="text-xl font-display font-bold text-gray-800 leading-tight">
                    {feature.title}
                </h3>
            </div>

            {/* Back Face - UPDATED with theme background color */}
            <div className="flip-card-back bg-primary-500 p-8 flex flex-col items-center justify-center">
                <h3 className="text-xl font-display font-bold text-white mb-4">
                    {feature.title}
                </h3>
                <p className="text-gray-100 text-base leading-relaxed">
                    {feature.description}
                </p>
            </div>
        </div>
    </div>
  );
};

export default WhyChooseUs;
