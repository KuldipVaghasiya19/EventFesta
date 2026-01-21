import './animations.css'; // Make sure this path is correct

const HeroSection = () => {
  return (
    <section className="relative h-96 flex items-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-navy-900 dark:via-slate-800 dark:to-navy-900">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-primary-400/30 to-primary-500/20 animate-shimmer"></div>
        {/* Additional flowing animation */}
        <div className="absolute inset-0 bg-gradient-to-l from-primary-600/10 via-transparent to-primary-400/10 animate-flow"></div>
        {/* Pulse overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-primary-600/5 animate-pulse-slow"></div>
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[length:20px_20px]"></div>
        </div>
        {/* Floating elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary-500/20 rounded-full blur-xl animate-float-bounce"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-primary-400/20 rounded-full blur-xl animate-float-delayed-bounce"></div>
        <div className="absolute bottom-16 left-1/4 w-12 h-12 bg-primary-600/20 rounded-full blur-xl animate-float-slow-bounce"></div>
        <div className="absolute bottom-20 right-1/3 w-24 h-24 bg-primary-300/20 rounded-full blur-xl animate-float-delayed-bounce"></div>
      </div>
      {/* Hero Content */}
      <div className="container mx-auto px-4 md:px-6 z-20 relative">
        <div className="text-center text-white animate-slide-up-enhanced">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 leading-tight animate-text-glow">
            Discover Amazing <span className="text-primary-400 drop-shadow-lg animate-text-pulse">Tech Events</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto drop-shadow-sm animate-fade-in-up">
            Find and join the most innovative tech events, from conferences and workshops to hackathons and meetups.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;