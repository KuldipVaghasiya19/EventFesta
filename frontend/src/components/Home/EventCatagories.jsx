import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const EventCategories = () => {
  const categories = [
    {
      name: "Conferences",
      count: 15,
      icon: "🎤",
      color: "bg-blue-100 text-blue-800",
      description: "Large-scale industry gatherings"
    },
    {
      name: "Workshops",
      count: 24,
      icon: "🛠️",
      color: "bg-green-100 text-green-800",
      description: "Hands-on learning sessions"
    },
    {
      name: "Hackathons",
      count: 8,
      icon: "💻",
      color: "bg-purple-100 text-purple-800",
      description: "Competitive coding events"
    },
    {
      name: "Meetups",
      count: 32,
      icon: "👥",
      color: "bg-yellow-100 text-yellow-800",
      description: "Local community gatherings"
    },
    {
      name: "Webinars",
      count: 19,
      icon: "🖥️",
      color: "bg-red-100 text-red-800",
      description: "Online learning sessions"
    },
    {
      name: "Exhibitions",
      count: 12,
      icon: "🏢",
      color: "bg-indigo-100 text-indigo-800",
      description: "Product showcases"
    }
  ];
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
            Explore Event <span className="text-primary-500">Categories</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect tech event format that matches your interests and learning style.
          </p>
        </div>
        
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={{
            prevEl: '.categories-prev',
            nextEl: '.categories-next',
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            480: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
            1280: {
              slidesPerView: 5,
            },
          }}
          className="relative"
        >
          {categories.map((category, index) => (
            <SwiperSlide key={index}>
              <Link 
                to={`/events?type=${category.name.toLowerCase()}`}
                className="group block bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-2 h-full"
              >
                <div className="p-6 text-center h-full flex flex-col justify-between">
                  <div>
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary-500 transition-colors">{category.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${category.color}`}>
                    {category.count} events
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <div className="flex justify-center items-center mt-8 gap-4">
          <button className="categories-prev bg-white hover:bg-primary-50 text-primary-600 p-3 rounded-full shadow-md transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button className="categories-next bg-white hover:bg-primary-50 text-primary-600 p-3 rounded-full shadow-md transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default EventCategories;