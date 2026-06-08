import React, { useState, useEffect, useRef } from 'react';
import LibrarySearch from '../components/LibrarySearch';
import LibraryCard from '../components/LibraryCard';
import WelcomeOffer from '../components/WelcomeOffer';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useQuery } from '@tanstack/react-query'; // ✅ 1. Import React Query
const Home = () => {
  
  const [searchResults, setSearchResults] = useState(null); 
 
  
  const resultsRef = useRef(null);

  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [isSearching, setIsSearching] = useState(false);

  const phrases = ["Focus Zone", "Best Library", "Study Space"];
  
  const gradients = [
    "from-purple-400 to-pink-400",
    "from-amber-200 to-yellow-500",
    "from-cyan-300 to-blue-500",
    "from-lime-300 to-emerald-400",
    "from-fuchsia-300 to-violet-400",
    "from-red-400 to-orange-400"
  ];

  const currentGradient = gradients[loopNum % gradients.length];

  // --- SKELETON CARD ---
  const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-white/5 shadow-xl">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div> 
      <div className="p-5 space-y-3">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div> 
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div> 
        <div className="flex justify-between pt-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];
      setText(isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1));
      setTypingSpeed(isDeleting ? 50 : 150);
      if (!isDeleting && text === fullText) { setTimeout(() => setIsDeleting(true), 2000); } 
      else if (isDeleting && text === '') { setIsDeleting(false); setLoopNum(loopNum + 1); }
    };
    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum]);

  const mapBackendDataToFrontend = (data) => {
    return data.map(lib => ({
        id: lib.id,
        name: lib.name,
        location: lib.locationTag || lib.address || "Bokaro", 
       // FIX 1: Keep the variable names consistent with Backend/DTO
        offerPrice: lib.offerPrice,      // Was 'price'
        originalPrice: lib.originalPrice, // Was 'oldPrice'
        totalSeats: lib.totalSeats || 0,  // Was 'seats'
        
        rating: lib.averageRating || 4.5, // Use backend rating if available
        amenities: lib.amenities || ["WiFi", "AC"], 
        
        // FIX 2: Pass the whole array AND the single image helper
        images: lib.images || [],
        image: (lib.images && lib.images.length > 0) 
                ? lib.images[0] 
                : "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2670&auto=format&fit=crop"
    }));
  };
  
// ✅ 3. REPLACE USE_EFFECT WITH USE_QUERY
// ✅ FIXED: Removed 'isLoading' completely
  const { data: trendingLibraries = [] } = useQuery({
    queryKey: ['libraries'], 
    queryFn: async () => {
        const response = await api.get('/libraries');
        
        let dataArray = [];
        if (response && Array.isArray(response.data)) {
             dataArray = response.data;
        } else if (Array.isArray(response)) {
             dataArray = response;
        }
        
        if (dataArray.length === 0) return [];

        const formattedData = mapBackendDataToFrontend(dataArray);
        return formattedData.slice(0, 5);
    },
    staleTime: 1000 * 60 * 5, 
  });
  
  const handleSearchResults = (data) => {
    const formattedData = mapBackendDataToFrontend(data);
    setSearchResults(formattedData);
    setIsSearching(false); 
    setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const clearSearch = () => {
    setSearchResults(null);
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      {/* SECTION 1: HERO */}
      <div className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden pb-10">
        <div className="absolute inset-0 z-0 bg-gray-900 ">
          <img 
            src="Background Image.webp" 
            alt="Bokaro Study Center" // ✅ FIX 2: Add 'loading="eager"' to force browser to prioritize this image
             loading="eager"
             fetchPriority="high"
            className="w-full h-full object-cover brightness-100 transition-opacity duration-700 opacity-100 "
          />
          {/* Overlay Adjustment */}
          <div className="absolute inset-0 bg-black/50 dark:bg-black/60"></div>
        </div>
      
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-24">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight drop-shadow-2xl mb-6 h-auto sm:h-32 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-orange-300">
                Find Your
              </span> <br className="hidden sm:block" />
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentGradient} transition-all duration-500`}>
                {text}
              </span>
            </h1>

            <p className="max-w-2xl text-lg text-gray-200 font-medium mb-8 drop-shadow-md mx-auto lg:mx-0">
              Join 1000+ students booking the best private libraries in Bokaro.
            </p>
            <div className="w-full max-w-xl mx-auto lg:mx-0">
              <LibrarySearch onSearch={handleSearchResults} />
            </div>
          </div>
      
          <div className="hidden lg:flex justify-end pr-8">
             <div className="w-full max-w-sm">
                <WelcomeOffer />
             </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: SEARCH RESULTS */}
      {(searchResults || isSearching) && (
        <div ref={resultsRef} className="relative z-20 py-12 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-white/10 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="text-blue-600 dark:text-blue-500">🔍</span> Search Results
                        </h2>
                        {!isSearching && searchResults && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                Found <span className="font-bold text-gray-900 dark:text-white">{searchResults.length}</span> libraries.
                            </p>
                        )}
                    </div>
                    {!isSearching && (
                         <button onClick={clearSearch} className="px-4 py-2 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500 hover:text-red-700 dark:hover:text-white rounded-lg text-sm font-bold transition-all border border-transparent dark:border-red-500/30">
                            ✕ Clear Search
                         </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isSearching ? (
                        <>
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </>
                    ) : searchResults && searchResults.length > 0 ? (
                        searchResults.map((lib) => (
                            <div key={`search-${lib.id}`} className="transform hover:scale-[1.02] transition-transform duration-300">
                                <LibraryCard library={lib} />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-10 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-300 dark:border-white/20">
                            <p className="text-xl text-gray-500 dark:text-gray-400">No libraries found.</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Try searching for "Chas", "Sector 04" or a different price.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* SECTION 3: TRENDING LIBRARIES */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Trending Libraries</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Most popular among students in Bokaro</p>
          </div>
            
          <Link to="/libraries" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">View All &rarr;</Link>
        </div>

        {/* --- SCROLLING CONTAINER (Fade removed) --- */}
        <div className="relative w-full overflow-hidden">
          
          <div className="animate-scroll flex gap-8 px-4 w-max hover:[animation-play-state:paused]">
            
            {/* ORIGINAL SET */}
            <div className="flex gap-8">
              {trendingLibraries.map((lib) => (
                <div key={`orig-${lib.id}`} className="w-[350px]">
                   <LibraryCard library={lib} />
                </div>
              ))}
            </div>

            {/* DUPLICATE SET */}
            <div className="flex gap-8">
              {trendingLibraries.map((lib) => (
                <div key={`dup-${lib.id}`} className="w-[350px]">
                   <LibraryCard library={lib} />
                </div>
              ))}
            </div>
            
             {/* TRIPLICATE SET */}
             <div className="flex gap-8">
              {trendingLibraries.map((lib) => (
                <div key={`tri-${lib.id}`} className="w-[350px]">
                   <LibraryCard library={lib} />
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;