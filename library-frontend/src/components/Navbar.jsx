import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { useTheme } from '../context/ThemeContext'; // ✅ Import Context

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth(); 
  
  // ✅ USE GLOBAL THEME CONTEXT (Removed local state & local useEffect)
  const { isDarkMode, toggleTheme } = useTheme(); 

  // Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // ✅ Dynamic Background: White (Light) / Gray-900 (Dark)
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 dark:bg-gray-900/90 backdrop-blur-md py-3 shadow-sm' 
        : 'bg-transparent py-5'
    }`}>
      <div className="w-full px-6 md:px-10">
        <div className="flex justify-between items-center">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-orange-400 p-2 rounded-lg text-white shadow-lg shadow-blue-500/20 transform group-hover:rotate-3 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-orange-400 leading-none tracking-tight">
                LibHub
              </span>
              {/* ✅ Text Color: Dark Gray (Light) / White (Dark) */}
       <span className="text-[10px] font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent dark:text-white uppercase tracking-widest leading-none mt-1">
  Bokaro
</span>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-4">
            
            {user ? (
              // SHOW PROFILE ICON IF LOGGED IN
              <div 
                onClick={() => navigate('/dashboard')}
                // ✅ Container Background
                className="flex items-center gap-3 cursor-pointer p-1.5 pr-4 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-all border border-gray-200 dark:border-white/10"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center text-white font-bold shadow-md text-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                {/* ✅ Text Color */}
                <span className="text-sm font-medium text-gray-700 dark:text-white">Profile</span>
              </div>
            ) : (
              // SHOW LOGIN/SIGNUP BUTTONS IF NOT LOGGED IN
              <>
                <Link to="/login" className="px-4.5 py-2.5 bg-orange-400 hover:bg-orange-300 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-0.5">
                  Login
                </Link>
                <Link to="/signup" className="px-4.5 py-2.5 bg-orange-400 hover:bg-orange-300 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-0.5">
                  Sign Up
                </Link>
              </>
            )}

            {/* DARK MODE TOGGLE */}
            <button 
              onClick={toggleTheme} 
              // ✅ Button Background
              className="ml-2 p-2 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 backdrop-blur-sm border border-gray-200 dark:border-white/10 transition-all transform hover:scale-110 shadow-lg"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                // Sun Icon (Yellow)
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="yellow" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-300">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                // Moon Icon (Dark Gray)
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
          </div>

          {/* MOBILE TOGGLE & BURGER */}
          <div className="md:hidden flex items-center gap-4">
             <button onClick={toggleTheme} className="text-gray-700 dark:text-white">
                {isDarkMode ? "☀️" : "🌙"}
             </button>

            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 dark:text-white p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`md:hidden absolute w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <div className="px-4 py-6 space-y-4">
          <Link to="/" className="block text-lg font-medium text-gray-800 dark:text-white hover:text-blue-400">Home</Link>
          <a href="#libraries" className="block text-lg font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Libraries</a>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-3">
            {user ? (
               <Link to="/dashboard" className="w-full py-3 text-center bg-blue-600 text-white font-bold rounded-xl shadow-lg">
                 Go to Dashboard
               </Link>
            ) : (
              <>
                <Link to="/login" className="w-full py-3 text-center text-gray-600 dark:text-gray-400 font-medium border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white">
                  Login
                </Link>
                <Link to="/signup" className="w-full py-3 text-center bg-orange-400 text-white font-bold rounded-xl hover:bg-orange-300 shadow-lg shadow-blue-900/20">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;