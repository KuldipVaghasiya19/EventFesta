import { Mail, MapPin, Building, GraduationCap, Edit, Phone, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ProfileSection = ({
  user,
  coverGradient = "from-slate-600 to-slate-800",
}) => {
  const [role, setRole] = useState(null);
  const [editProfilePath, setEditProfilePath] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('techevents_user') || sessionStorage.getItem('techevents_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      const userRole = userData.role.toLowerCase();
      setRole(userRole);
      setEditProfilePath(userRole === 'organization'
        ? '/dashboard/organization/profile/update'
        : '/dashboard/participant/profile/update');
    }
  }, []);

  const gradients = {
    participant: "from-indigo-600 via-purple-600 to-blue-800",
    organization: "from-emerald-600 via-teal-600 to-blue-800"
  };

  const selectedGradient = gradients[role] || coverGradient;

  // Reusable component for the info badges
  const InfoBadge = ({ icon: Icon, text }) => (
    <div className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-sm text-white/90 transition-all shadow-sm group cursor-default">
      <Icon className="h-4 w-4 text-white/70 group-hover:text-white transition-colors" />
      <span className="font-medium truncate max-w-[200px] sm:max-w-xs">{text}</span>
    </div>
  );

  return (
    <div className="relative w-full">
      {/* Hero Banner Background */}
      <div className={`h-80 sm:h-[22rem] bg-gradient-to-r ${selectedGradient} relative overflow-hidden transition-all duration-500`}>
        
        {/* Abstract Decorative Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse duration-[10000ms]"></div>
          <div className="absolute top-1/2 right-10 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse duration-[8000ms] delay-700"></div>
          <div className="absolute -bottom-20 left-1/3 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
        </div>

        {/* Dark bottom gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

        {/* Main Content Container */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 pb-16 sm:pb-20">
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 sm:gap-8 relative z-10">
              
              {/* Profile Avatar Area */}
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 bg-white/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="relative w-32 h-32 sm:w-44 sm:h-44 rounded-3xl object-cover border-4 border-white/20 backdrop-blur-sm shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]"
                />
                {/* Status Indicator */}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-navy-800 rounded-2xl flex items-center justify-center shadow-xl border border-gray-100 dark:border-navy-700 transform rotate-3 group-hover:rotate-12 transition-transform duration-300">
                  <div className={`w-5 h-5 rounded-xl ${role === 'participant' ? 'bg-indigo-500 shadow-indigo-500/50' : 'bg-emerald-500 shadow-emerald-500/50'} shadow-inner`}></div>
                </div>
              </div>

              {/* Profile Details Area */}
              <div className="flex-grow flex flex-col sm:flex-row justify-between items-start sm:items-end w-full gap-6">
                
                <div className="flex flex-col gap-3">
                  {/* Name and Role Title */}
                  <div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-md mb-2">
                      {user.name}
                    </h1>
                    
                    {role === "organization" ? (
                      <div className="flex flex-col gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-white/90 text-sm font-semibold tracking-wider uppercase w-max backdrop-blur-md">
                          {user.type} Organization
                        </span>
                        {user.about && (
                          <p className="text-white/80 text-sm sm:text-base max-w-2xl line-clamp-2 mt-1 drop-shadow">
                            {user.about}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-white/90 text-sm font-semibold tracking-wider uppercase w-max backdrop-blur-md">
                        {role}
                      </span>
                    )}
                  </div>

                  {/* Information Badges */}
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <InfoBadge icon={Mail} text={user.email} />
                    
                    {role === "participant" ? (
                      <>
                        <InfoBadge icon={Building} text={user.university || 'Not Specified'} />
                        <InfoBadge icon={GraduationCap} text={user.course || 'Not Specified'} />
                      </>
                    ) : (
                      <>
                        <InfoBadge icon={MapPin} text={user.location || 'Location Pending'} />
                        <InfoBadge icon={Phone} text={user.contact || 'No Contact'} />
                      </>
                    )}
                  </div>
                </div>

                {/* Edit Button Action */}
                <div className="shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                  <Link
                    to={editProfilePath}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-300 shadow-lg shadow-black/20 font-bold hover:scale-105 active:scale-95 group w-full sm:w-auto"
                  >
                    <Edit className="h-4 w-4 text-gray-600 group-hover:text-gray-900 transition-colors" />
                    Edit Profile
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;