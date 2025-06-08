import { Mail, MapPin, Building, GraduationCap, Edit, Phone } from 'lucide-react';

const ProfileSection = ({ 
  user, 
  coverGradient = "from-slate-600 to-slate-800",
  type = "participant" 
}) => {
  const gradients = {
    participant: "from-indigo-600 via-purple-600 to-blue-700",
    organization: "from-emerald-600 via-teal-600 to-blue-700"
  };

  const selectedGradient = gradients[type] || coverGradient;

  return (
    <div className="relative">
      {/* Cover Photo with Gradient */}
      <div className={`h-64 bg-gradient-to-r ${selectedGradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-10 right-20 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute top-20 right-10 w-16 h-16 bg-white rounded-full"></div>
        </div>
        
        {/* Profile Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex items-end gap-6">
              {/* Profile Photo */}
              <div className="relative">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <div className={`w-4 h-4 rounded-full ${type === 'participant' ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="text-white flex-grow pb-4">
                <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
                <p className="text-xl text-white/90 mb-4">{user.role}</p>
                
                {/* Contact Info Row */}
                <div className="flex flex-wrap gap-8 text-white/90">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-white/70" />
                    <span>{user.email}</span>
                  </div>
                  
                  {type === "participant" ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-white/70" />
                        <span>{user.organization}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-white/70" />
                        <span>Computer Science</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-white/70" />
                        <span>+1 234 567 890</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-white/70" />
                        <span>{user.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-white/70" />
                        <span>{user.organization}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              <div className="pb-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors backdrop-blur-sm">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;