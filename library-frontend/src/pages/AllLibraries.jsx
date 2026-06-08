import React, { useState, useMemo } from 'react';
import api from '../services/api';
import LibraryCard from '../components/LibraryCard';
import { useQuery } from '@tanstack/react-query'; // ✅ Import useQuery
import Loading from '../components/Loading'; //
const AllLibraries = () => {
  // ✅ Removed 'libraries', 'loading', 'error' states (handled by React Query)
  const [searchQuery, setSearchQuery] = useState('');   
  const [activeFilter, setActiveFilter] = useState('All'); 
//   const [loading, setLoading] = useState(true); // or const { isLoading } = useQuery(...)

  // 🛠️ HELPER: Converts "Air Conditioning" -> "AC"
  const getShortAmenityName = (backendItem) => {
      let name = backendItem.name || backendItem; 
      if (typeof name === 'string' && name.includes('NAME=')) {
          const match = name.match(/NAME=([^,)]+)/);
          if (match) name = match[1];
      }
      const lowerName = name.toString().toLowerCase().trim();
      
      if (lowerName.includes('wi-fi') || lowerName.includes('wifi')) return 'Wi-Fi';
      if (lowerName.includes('air conditioning') || lowerName.includes('ac')) return 'AC';
      if (lowerName.includes('water')) return 'Water';
      if (lowerName.includes('locker')) return 'Locker';
      if (lowerName.includes('cctv')) return 'CCTV';
      if (lowerName.includes('power') || lowerName.includes('backup')) return 'Power';
      if (lowerName.includes('parking')) return 'Parking';
      if (lowerName.includes('discussion')) return 'Room';

      return name; 
  };

 // ✅ 1. THE FIXED FETCHER FUNCTION
  const fetchLibraries = async () => {
    try {
        const response = await api.get('/libraries');
        
        // 🔍 DEBUG: See exactly what we got
        console.log("API Response:", response); 

        // ✅ HANDLE BOTH CASES:
        // Case A: Interceptor returned the wrapper { data: [...] }
        // Case B: Interceptor returned just the array (if you change logic later)
        let libraryList = [];
        
        if (Array.isArray(response)) {
            libraryList = response;
        } else if (response && Array.isArray(response.data)) {
            libraryList = response.data; // <--- This extracts the list from the wrapper
        } else {
            console.error("Unexpected data structure:", response);
            return [];
        }

        return libraryList.map(lib => ({
            id: lib.id,
            name: lib.name,
            locationTag: lib.locationTag || lib.address || "Bokaro", 
            totalSeats: lib.totalSeats || 0,
            offerPrice: lib.offerPrice,
            originalPrice: lib.originalPrice,
            averageRating: lib.averageRating || 0, 
            totalReviews: lib.totalReviews || 0,
            amenities: (lib.amenities && lib.amenities.length > 0) 
                ? lib.amenities.map(item => getShortAmenityName(item)) 
                : ["Wi-Fi", "AC"], 
            images: lib.images || [],
            image: (lib.images && lib.images.length > 0) ? lib.images[0] : "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2670&auto=format&fit=crop"
        }));
    } catch (err) {
        console.error("Fetch failed:", err);
        throw err;
    }
  };

// ✅ 2. USE QUERY HOOK
  // Fix: Rename 'isLoading' to 'loading' and extract 'error' so your JSX works
  const { 
    data: libraries = [], 
    isLoading: loading,   // <--- Rename here
    error                 // <--- Extract error here
  } = useQuery({
    queryKey: ['libraries'], 
    queryFn: fetchLibraries, 
  });

  // ✅ 3. OPTIMIZED FILTERING (Replaces the old useEffect)
  // useMemo only recalculates when dependencies change
  const filteredData = useMemo(() => {
    let result = libraries;
    
    if (activeFilter === 'Chas') result = result.filter(lib => lib.locationTag.toLowerCase().includes('matwari'));
    else if (activeFilter === 'Sector 04') result = result.filter(lib => lib.locationTag.toLowerCase().includes('korrah')); // Fixed 'location' -> 'locationTag'
    else if (activeFilter === 'Under 400') result = result.filter(lib => lib.offerPrice <= 400);
    else if (activeFilter === 'AC') result = result.filter(lib => lib.amenities.includes('AC')); 

    if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        result = result.filter(lib => lib.name.toLowerCase().includes(lowerQuery) || lib.locationTag.toLowerCase().includes(lowerQuery));
    }
    return result;
  }, [libraries, searchQuery, activeFilter]);

  const FilterButton = ({ label, value }) => (
    <button 
      onClick={() => setActiveFilter(value)}
      className={`px-5 py-2 rounded-full font-medium text-sm transition-all shadow-sm border ${
        activeFilter === value 
          ? 'bg-blue-600 text-white border-blue-600 shadow-blue-500/30' 
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
      }`}
    >
      {label}
    </button>
  );

  if (loading) {
    return <Loading message="Finding best libraries..." />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 font-sans">
      <div className="relative z-10 pt-28 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Explore All Libraries
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Browse through our verified list of study spaces in Bokaro.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="max-w-4xl mx-auto mb-12 space-y-6">
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl opacity-30 group-hover:opacity-60 blur transition duration-500"></div>
                <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-blue-300 dark:border-gray-700 shadow-lg shadow-blue-200/50 dark:shadow-none">
                    <span className="pl-4 text-gray-400">🔍</span>
                    <input 
                        type="text"
                        placeholder="Search by library name, location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-3.5 px-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none text-base"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="pr-4 text-gray-500 hover:text-gray-700 dark:hover:text-white">✕</button>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
                <FilterButton label="All" value="All" />
                <FilterButton label="📍 Chas" value="Chas" />
                <FilterButton label="📍 Sector 04" value="Sector 04" />
                <FilterButton label="💰 Under ₹400" value="Under 400" />
                <FilterButton label="❄️ AC" value="AC" />
            </div>
        </div>
       
        
        {error && <div className="text-center text-red-500 dark:text-red-400 py-10">{error}</div>}

        {!loading && !error && (
            <>
                {filteredData.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredData.map((lib, index) => (
                            <div key={lib.id} className="relative animate-in fade-in zoom-in duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                                <div className="absolute -top-3 -left-3 w-8 h-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center font-bold text-sm shadow-xl z-10">
                                    {index + 1}
                                </div>
                                <LibraryCard library={lib} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white dark:bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-white/10">
                        <div className="text-4xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No libraries found</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            We couldn't find any libraries matching "{searchQuery}" or the selected filters.
                        </p>
                        <button 
                            onClick={() => {setSearchQuery(''); setActiveFilter('All');}}
                            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
};

export default AllLibraries;