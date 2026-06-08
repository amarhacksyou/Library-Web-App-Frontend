import React, { useState } from 'react';
import api from '../services/api';

// Receive "setLoading" to trigger Skeletons in Home.jsx
const LibrarySearch = ({ onSearch, setLoading }) => {
  const [activeTab, setActiveTab] = useState('location');
  const [query, setQuery] = useState('');
  const [internalLoading, setInternalLoading] = useState(false); // Local loading for the button

  // 1. Define lists for both tabs
  const popularLocations = ['Chas', 'Sector 04', 'Sector 02'];
  const popularPrices = ['400', '500', '600'];

  // 2. Main Search Handler
  const handleSearch = async (overrideQuery = null) => {
    const searchTerm = overrideQuery !== null ? overrideQuery : query;

    // Prevent empty searches
    if (!searchTerm || !searchTerm.trim()) return;
    
    // --- SPEED FIX: Tell Home to show Skeletons immediately ---
    if (setLoading) setLoading(true); 
    setInternalLoading(true);

    try {
      // Call Backend API
      const response = await api.get(`/libraries/search?query=${searchTerm}`);
      
      // Pass data to Home (Home will handle turning off the Skeletons)
      onSearch(response.data); 
      
    } catch (error) {
      console.error("Search failed:", error);
      alert("Search failed. Please try again.");
      
      // If error, we must manually turn off Skeletons
      if (setLoading) setLoading(false);
    } finally {
      // Always stop the button spinner
      setInternalLoading(false);
    }
  };

  // 3. Helper for Quick Clicks (Popular Tags)
  const handleQuickClick = (value) => {
    setQuery(value);       
    handleSearch(value); // Search immediately
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="w-full max-w-md mx-auto lg:mx-0 mt-8 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Tabs */}
      <div className="flex space-x-2 p-1 mb-2">
        <button 
          onClick={() => { setActiveTab('location'); setQuery(''); }}
          className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'location' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          By Location
        </button>
        <button 
          onClick={() => { setActiveTab('budget'); setQuery(''); }}
          className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'budget' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-300 hover:bg-white/5 hover:text-white'
          }`}
        >
           By Price
        </button>
      </div>

      {/* Input Field */}
      <div className="relative flex items-center bg-white rounded-xl overflow-hidden shadow-inner">
        <div className="pl-4 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input 
          type={activeTab === 'budget' ? "number" : "text"} 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={activeTab === 'location' ? "Search 'Chas', 'Sector 04'..." : "Enter max price (e.g. 400)"}
          className="w-full py-3 px-4 text-gray-800 text-sm font-medium outline-none placeholder-gray-400"
        />

        <button 
            onClick={() => handleSearch()}
            disabled={internalLoading}
            className={`hidden sm:block m-1 px-8 py-3 text-white font-bold rounded-lg transition-colors disabled:bg-gray-400 ${
                activeTab === 'budget' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-700 hover:bg-blue-800'
            }`}
        >
          {internalLoading ? "..." : "Search"}
        </button>
      </div>

      {/* 4. Quick Filters */}
      <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start px-2">
        <span className="text-gray-400 font-medium uppercase tracking-wider py-1">Popular:</span>
        
        {/* Dynamic List Mapping */}
        {(activeTab === 'location' ? popularLocations : popularPrices).map((item) => (
          <button 
            key={item} 
            onClick={() => handleQuickClick(item)} 
            className="px-3 py-1 text-xs font-semibold rounded-full bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-all"
          >
            {activeTab === 'budget' ? `₹${item}` : item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LibrarySearch;