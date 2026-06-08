import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative z-20 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-white/10 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* COLUMN 1: BRANDING */}
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
              BookLibrary
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Your gateway to the best study spaces in Bokaro. Book your seat, focus better, and achieve your dreams.
            </p>
          </div>

          {/* COLUMN 2: QUICK LINKS */}
          <div>
            {/* ✅ FIXED: Dark text for light mode, white for dark mode */}
            <h3 className="text-gray-900 dark:text-white font-bold mb-4 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors text-sm">Home</Link></li>
              <li><Link to="/libraries" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors text-sm">All Libraries</Link></li>
              <li><Link to="/login" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors text-sm">Student Login</Link></li>
              <li><Link to="/signup" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors text-sm">Register</Link></li>
            </ul>
          </div>

          {/* COLUMN 3: CONTACT INFO */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold mb-4 uppercase tracking-wider text-sm">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400 text-sm">
                <span>📞</span>
                <a href="tel:+918434190090" className="hover:text-blue-600 dark:hover:text-white transition-colors">+91 8434190090</a>
              </li>
              <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400 text-sm">
                <span>✉️</span>
                <a href="mailto:amarkantreal@gmail.com" className="hover:text-blue-600 dark:hover:text-white transition-colors">amarkantreal@gmail.com</a>
              </li>
              <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400 text-sm">
                <span>📍</span>
                <span>Bokaro, Jharkhand, India</span>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: SOCIALS */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold mb-4 uppercase tracking-wider text-sm">Connect</h3>
            <div className="flex gap-4">
              {/* GitHub */}
              <a 
                href="https://github.com/amarhacksyou" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-white/20 hover:text-black dark:hover:text-white transition-all border border-gray-300 dark:border-white/10"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
              </a>

              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/in/amarkantreal/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-600 hover:text-blue-600 dark:hover:text-white transition-all border border-gray-300 dark:border-white/10"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
              </a>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 dark:border-white/10 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-500">
          <p>&copy; {new Date().getFullYear()} BookLibrary. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
             <span className="hover:text-blue-600 dark:hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
             <span className="hover:text-blue-600 dark:hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;