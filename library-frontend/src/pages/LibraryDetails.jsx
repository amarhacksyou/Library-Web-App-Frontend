import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Star, MessageSquare, MapPin, Clock, CheckCircle, Wifi, Zap, Droplets, Lock, ShieldCheck, Car } from 'lucide-react';
import Loading from '../components/Loading';
const LibraryDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  
  const [library, setLibrary] = useState(null);
  const [reviews, setReviews] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLibraryDetails = async () => {
      try {
        const libResponse = await api.get(`/libraries/${id}`);
        setLibrary(libResponse.data);
        const reviewResponse = await api.get(`/reviews/library/${id}`);
        setReviews(reviewResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching details:", err);
        setError("Failed to load library details.");
        setLoading(false);
      }
    };
    fetchLibraryDetails();
  }, [id]);

  if (loading) {
    return <Loading message="Loading library details..." />;
  }

  if (error) return <div className="min-h-screen pt-24 flex items-center justify-center text-red-500">{error}</div>;
  if (!library) return null;

  const mainImage = (library.images && library.images.length > 0) 
   ? library.images[0]
    : "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2670&auto=format&fit=crop";

  const ratingValue = library.averageRating || library.average_rating || 0;

  // 🛠️ HELPER: Display correct Icon and Short Name
  const getAmenityConfig = (amenityItem) => {
    // 1. Clean the name (Handle "LIBRARYAMENITY..." etc)
    let name = amenityItem.name || amenityItem;
    if (typeof name === 'string' && name.includes('NAME=')) {
        const match = name.match(/NAME=([^,)]+)/);
        if (match) name = match[1];
    }
    const lowerName = name.toString().toLowerCase().trim();

    // 2. Return Config based on name
    if (lowerName.includes('wi-fi') || lowerName.includes('wifi')) return { label: 'Wi-Fi', icon: <Wifi size={14} /> };
    if (lowerName.includes('air conditioning') || lowerName.includes('ac')) return { label: 'AC', icon: <Zap size={14} /> };
    if (lowerName.includes('water')) return { label: 'Water', icon: <Droplets size={14} /> };
    if (lowerName.includes('locker')) return { label: 'Locker', icon: <Lock size={14} /> };
    if (lowerName.includes('cctv')) return { label: 'CCTV', icon: <ShieldCheck size={14} /> };
    if (lowerName.includes('power') || lowerName.includes('backup')) return { label: 'Power', icon: <Zap size={14} /> };
    if (lowerName.includes('parking')) return { label: 'Parking', icon: <Car size={14} /> };

    // Default
    return { label: name, icon: <CheckCircle size={14} /> };
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <Link to="/libraries" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white mb-6 inline-flex items-center gap-2 transition-colors font-medium">
          &larr; Back to Libraries
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* LEFT COLUMN: Images & Reviews */}
          <div className="space-y-12">
            <div className="space-y-4">
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 h-96 relative group">
                <img src={mainImage} alt={library.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/60 backdrop-blur-md px-4 py-1 rounded-full text-sm font-bold border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white shadow-lg">
                    📍 {library.locationTag || "Bokaro"}
                </div>
                </div>
                {library.images && library.images.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        {library.images.slice(1).map((img, idx) => (
                            <img key={idx} src={img} alt="Gallery" className="w-24 h-24 rounded-xl object-cover border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-80 transition-opacity shadow-sm" />
                        ))}
                    </div>
                )}
            </div>

            {/* REVIEWS SECTION */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <MessageSquare className="text-blue-500" />
                        Student Feedback
                    </h2>
                    <span className="text-sm font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                        {reviews.length} Verified Reviews
                    </span>
                </div>

                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.id} className="p-6 bg-white dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:border-blue-500/30">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                                            {review.user?.name?.charAt(0) || "S"}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white text-sm">{review.user?.name || "Student"}</p>
                                            <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200 dark:text-gray-700"} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed italic">"{review.comment}"</p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/20 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                            <Star size={40} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-gray-500 font-bold">No reviews yet</h3>
                            <p className="text-gray-400 text-sm">Be the first student to rate this library!</p>
                        </div>
                    )}
                </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Details */}
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none sticky top-28">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{library.name}</h1>
                    <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <MapPin size={16} /> {library.address || "Address not available"}
                    </p>
                </div>
                <div className="text-center bg-blue-50 dark:bg-blue-900/20 p-3 rounded-2xl border border-blue-100 dark:border-blue-800/50">
                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400 flex items-center gap-1 justify-center">
                        {ratingValue > 0 ? Number(ratingValue) : "N/A"}
                        <Star size={20} className="fill-blue-600 dark:fill-blue-400" />
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">Rating</p>
                </div>
            </div>

            <div className="bg-blue-50 dark:bg-gray-900/80 rounded-2xl p-6 mb-8 border border-blue-100 dark:border-gray-700 flex justify-between items-center">
                <div>
                    <p className="text-gray-400 dark:text-gray-500 text-sm line-through">₹{library.originalPrice}</p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-green-400">₹{library.offerPrice}<span className="text-sm text-gray-500 dark:text-gray-400">/mo</span></p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-orange-500 dark:text-orange-400 font-bold mb-1">Limited Seats!</p>
                    <div className="bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-300 px-3 py-1 rounded-lg text-xs font-bold border border-orange-200 dark:border-orange-500/30">
                        {library.totalSeats} Seats Total
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-600/50">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Opening Hours</p>
                    <p className="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
                        <Clock size={16} /> {library.openingHours || "6 AM - 10 PM"}
                    </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-600/50">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Owner Contact</p>
                    <p className="text-gray-900 dark:text-white font-semibold">📞 {library.contactNumber || "Not Available"}</p>
                </div>
            </div>

            {/* ✅ FIXED AMENITIES LIST */}
            <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Amenities</h3>
                <div className="flex flex-wrap gap-3">
                    {library.amenities && library.amenities.length > 0 ? (
                        library.amenities.map((item, index) => {
                            const { label, icon } = getAmenityConfig(item);
                            return (
                                <span key={index} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-300 rounded-lg text-sm font-medium border border-blue-100 dark:border-blue-500/30 flex items-center gap-1">
                                    {icon} {label}
                                </span>
                            );
                        })
                    ) : (
                        <span className="text-gray-500">No specific amenities listed.</span>
                    )}
                </div>
            </div>

            <button 
                onClick={() => navigate(`/book/${library.id}`)}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-xl rounded-xl shadow-lg shadow-orange-500/20 transform transition hover:-translate-y-1 active:scale-95"
            >
                Book My Seat Now
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryDetails;