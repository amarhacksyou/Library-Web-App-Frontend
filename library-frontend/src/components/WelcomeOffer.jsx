import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import api from '../services/api'; 
// ✅ FIX: Added missing icons (Info, CheckCircle, FileText, Lock) 
// Kept ShieldCheck, Banknote, Clock, X as you had them originally
import { ShieldCheck, Banknote, Clock, X, Info, CheckCircle, FileText, Lock } from 'lucide-react';

const WelcomeOffer = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false); // New state for modal
  const { user } = useAuth();
  const navigate = useNavigate();

  // --- 1. SMART ELIGIBILITY CHECK ---
  useEffect(() => {
    const checkEligibility = async () => {
      // Case A: User is Guest -> Always Show
      if (!user) {
        setIsVisible(true);
        return;
      }

      // Case B: User is Logged In -> Ask Backend
      try {
        const response = await api.get(`/bookings/check-eligibility?userEmail=${user.email}`);
        setIsVisible(response.data); 
      } catch (error) {
        console.error("Failed to check offer eligibility", error);
        setIsVisible(true);
      }
    };

    checkEligibility();
  }, [user]);

  // --- 2. HANDLERS ---
  const handleClaim = () => {
    if (!user) {
        navigate("/signup");
    } else {
        navigate("/"); 
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* --- MAIN OFFER CARD --- */}
      <div className="w-full max-w-sm mx-auto 
        bg-white dark:bg-gray-900/90 
        border border-gray-200 dark:border-white/10 
        backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl 
        transform transition-all hover:scale-[1.02] duration-500 
        animate-in fade-in slide-in-from-bottom-8 relative z-40">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-600 p-6 text-center relative overflow-hidden">
          <button 
            onClick={handleClose}
            className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-black/10 text-white/80 hover:text-white hover:bg-black/30 transition-all backdrop-blur-sm"
            aria-label="Close offer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 rotate-12 scale-150 transform origin-bottom-left pointer-events-none"></div>
          <h2 className="text-3xl font-extrabold text-white relative z-10 drop-shadow-md">
            🎉 Student Exclusive!
          </h2>
          <div className="relative z-10 mt-3">
            <span className="inline-block bg-white/20 border border-white/40 backdrop-blur-md rounded-full px-4 py-1 text-white font-extrabold text-xs uppercase tracking-widest shadow-lg">
              Special Offer for New Students
            </span>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 bg-white dark:bg-gray-900 text-center relative">
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed font-medium">
            {user 
              ? `Hello ${user.name}! Use your one-time discount now:` 
              : "Welcome to LibHub! Create your account today to unlock exclusive rewards:"}
          </p>
          
          <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-xl border-2 border-dashed border-blue-200 dark:border-gray-600 mb-6 shadow-inner relative group overflow-hidden">
             <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors duration-300"></div>
             <span className="text-2xl font-black text-gray-900 dark:text-white block drop-shadow-sm relative z-10 tracking-tight">
               3 DAYS FREE TRIAL
             </span>
             <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide relative z-10 mt-1 block">
               + Full Access to AC & WiFi
             </span>
          </div>

          <button 
            onClick={handleClaim}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-1 active:scale-95"
          >
            {user ? "Book Now & Save 🚀" : "Claim Offer 🚀"}
          </button>
          
          {/* ✅ UPDATED: Clickable Terms Link (Only logic change here to trigger modal) */}
          <button 
            onClick={() => setShowTermsModal(true)}
            className="mt-4 text-[10px] text-gray-400 font-medium hover:text-blue-500 hover:underline decoration-dotted underline-offset-2 transition-colors"
          >
            *Valid for new students only. Click to view Terms & Refund Policy.
          </button>
        </div>
      </div>

      {/* --- 3. TERMS & CONDITIONS MODAL (POP-UP) --- */}
      {showTermsModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="bg-gray-50 dark:bg-gray-800 p-5 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  Terms & Conditions
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last Updated: December 2025</p>
              </div>
              <button 
                onClick={() => setShowTermsModal(false)}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all p-2 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-8">
              
              {/* Section 1: About LibHub */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-sm border-b pb-2 dark:border-gray-700 uppercase tracking-wide">
                  <Info className="w-4 h-4 text-blue-500" />
                  1. About BookLibrary Service
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
                  <strong>BookLibrary (Bokaro Libraries)</strong> acts as a digital aggregator connecting students with premium private study centers in Chas, Sector 04, and Sector 02. We provide a platform for discovery, booking, and payment management. We are not the owners of the physical library infrastructure but facilitate the reservation process.
                </p>
              </div>

              {/* Section 2: Offer Details */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-sm border-b pb-2 dark:border-gray-700 uppercase tracking-wide">
                  <Banknote className="w-4 h-4 text-green-500" />
                  2. Promotional Offer Details
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
                  The "Welcome Offer" is applicable strictly for <strong>first-time users</strong> registering on the BookLibrary platform.
                </p>
                <ul className="list-disc list-outside pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <li><strong>Base Subscription Fee:</strong> ₹400 per month.</li>
                    <li><strong>Discount Applied:</strong> Flat ₹50 off on the first month.</li>
                    <li><strong>Final Payable Amount:</strong> ₹350 for the first 30 days.</li>
                    <li><strong>Renewal:</strong> Subsequent months will be charged at the standard rate of ₹400.</li>
                </ul>
              </div>

              {/* Section 3: Refund Policy (Highlighted) */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-sm border-b pb-2 dark:border-gray-700 uppercase tracking-wide">
                  <Clock className="w-4 h-4 text-orange-500" />
                  3. Money Back Guarantee (Refund Policy)
                </h3>
                <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-500/20 rounded-xl p-4">
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed mb-3 font-medium">
                    We offer a "No Questions Asked" refund policy valid for <strong>72 Hours (3 Days)</strong> from the time of payment.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Eligibility:</strong> Refund requests must be raised within 3 days of booking. Requests made on Day 4 or later are not eligible.</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Process:</strong> Submit a request via the <em>"Help & Support"</em> section in your Dashboard.</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Timeline:</strong> Approved refunds of ₹350 will be credited back to the original source account within <strong>5-7 business days</strong>.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 4: Code of Conduct */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-sm border-b pb-2 dark:border-gray-700 uppercase tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-purple-500" />
                  4. User Conduct & Rights
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
                  While BookLibrary confirms your booking, the library owner reserves the <strong>Right to Admission</strong>. Students must adhere to the library's specific rules (silence, cleanliness, timing). Violation of rules may lead to subscription cancellation without refund.
                </p>
              </div>

               {/* Section 5: Privacy */}
               <div className="space-y-3">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-sm border-b pb-2 dark:border-gray-700 uppercase tracking-wide">
                  <Lock className="w-4 h-4 text-gray-500" />
                  5. Privacy Policy
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
                  Your personal data (Name, Phone, Email) is shared <strong>only</strong> with the specific library owner you book with for verification purposes. We do not sell your data to third-party advertisers.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-center flex-shrink-0">
              <button 
                onClick={() => setShowTermsModal(false)}
                className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:opacity-90 transition-all text-sm shadow-md"
              >
                I Have Read & Understood The Terms
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WelcomeOffer;