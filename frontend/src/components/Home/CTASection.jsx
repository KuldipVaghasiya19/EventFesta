import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-16 bg-primary-600 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0 md:max-w-xl">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to Host Your Next Tech Event?
            </h2>
            <p className="text-lg text-primary-100">
              Join thousands of organizers who trust TechEvents to connect with the perfect audience for their events.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/signup?role=organization" 
              className="px-8 py-4 bg-white text-primary-600 font-bold rounded-lg hover:bg-gray-100 transition-colors text-center"
            >
              Register as Organizer
            </Link>
            <Link 
              to="/contact" 
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors text-center"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;