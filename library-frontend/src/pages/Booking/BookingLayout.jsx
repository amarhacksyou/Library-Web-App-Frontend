import React, { useState, useEffect } from 'react';
import { useParams, Outlet, useNavigate } from 'react-router-dom';
import { getLibraryById } from '../../services/bookingApi';
import { MapPin, Loader2, Star, ShieldCheck } from 'lucide-react';

const BookingLayout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [library, setLibrary] = useState(null);

  useEffect(() => {
    const fetchLib = async () => {
      try {
        const data = await getLibraryById(id);
        
        // 🛠️ HELPER: Clean the messy "LibraryAmenity(id=...)" strings
        const cleanAmenity = (raw) => {
             if (!raw) return "";
             // If it looks like "LibraryAmenity(id=45, name=WiFi)", extract "WiFi"
             if (raw.includes("name=")) {
                 const match = raw.match(/name=([^,)]+)/);
                 if (match) return match[1];
             }
             return raw; // Otherwise return as is
        };

        const formatted = {
           id: data.id,
           name: data.name,
           location: data.locationTag || "Bokaro",
           image: data.images?.[0] || "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop",
           rating: 4.8,
           // ✅ FIX: Apply the cleaner function here
           amenities: data.amenities ? data.amenities.map(cleanAmenity) : ["WiFi", "AC", "Water"],
           offerPrice: data.offerPrice
        };
        setLibrary(formatted);
      } catch (err) {
        console.error(err);
        navigate('/libraries'); 
      }
    };
    fetchLib();
  }, [id, navigate]);

  if (!library) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#020617] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] text-gray-900 dark:text-white py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none opacity-0 dark:opacity-100"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none opacity-0 dark:opacity-100"></div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-5xl bg-white dark:bg-[#0f172a]/60 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[650px] transition-colors duration-300">
        
        {/* === LEFT SIDE: VISUALS === */}
        <div className="w-full md:w-[45%] relative h-64 md:h-auto group">
           <img src={library.image} alt={library.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
           <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent dark:from-[#0f172a] dark:via-[#0f172a]/60 dark:to-transparent"></div>
           
           <div className="absolute bottom-0 left-0 p-8 w-full z-20">
               <div className="flex items-center gap-2 mb-3">
                   <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider">
                       ⚡ Fast Filling
                   </div>
                   <div className="px-3 py-1 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30 rounded-full text-[10px] font-bold flex items-center gap-1">
                       <Star size={10} fill="currentColor" /> {library.rating}
                   </div>
               </div>

               <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 leading-tight drop-shadow-sm">{library.name}</h1>
               
               <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2 mb-6 text-sm font-medium">
                   <MapPin className="w-4 h-4 text-blue-500 dark:text-blue-400" /> {library.location}
               </p>

               {/* Amenities Chips */}
               <div className="flex flex-wrap gap-2">
                   {library.amenities.slice(0,4).map((am, i) => (
                       <span key={i} className="px-3 py-1.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 backdrop-blur-md">
                           {am}
                       </span>
                   ))}
               </div>
           </div>
        </div>

        {/* === RIGHT SIDE: FORM AREA === */}
        <div className="w-full md:w-[55%] p-6 md:p-12 flex flex-col justify-center bg-transparent relative">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 dark:opacity-20 pointer-events-none"></div>
            
            <div className="relative z-10 max-w-md mx-auto w-full">
                <Outlet context={{ library }} />
            </div>
            
            <div className="absolute bottom-6 left-0 w-full text-center">
                <p className="text-[10px] text-gray-900 dark:text-gray-600 flex items-center justify-center gap-1">
                    <ShieldCheck size={10}/> Powered by LibHub Secure
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default BookingLayout;