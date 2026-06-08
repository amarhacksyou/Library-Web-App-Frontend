import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ShieldCheck, Loader2, CreditCard, Lock } from 'lucide-react';
import { createOrderAPI, verifyPaymentAPI } from '../../services/bookingApi';
import { useAuth } from '../../context/AuthContext';

const StepPayment = () => {
  const { library } = useOutletContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // --- PRICING LOGIC ---
  const finalPrice = library.offerPrice || 350;
  
  // Visual assumption: Original price is 50 higher
  const originalPrice = finalPrice + 50; 
  const savedAmount = originalPrice - finalPrice;
  
  // Gateway fee estimation for display
  const estimatedFee = Math.round(finalPrice * 0.03);
  const totalDisplay = finalPrice + estimatedFee;

  const handlePayment = async () => {
    if (!user) return alert("Please login first");
    setIsProcessing(true);

    try {
      const orderData = await createOrderAPI(user.email, library.id);
      
      const options = {
        key: "rzp_live_RzPFjSSMCXY7aV", // Replace with your key
        amount: orderData.amountPaid * 100,
        currency: "INR",
        name: "BookLibrary",
        description: `Seat at ${library.name}`,
        order_id: orderData.razorpayOrderId,
        handler: async function (response) {
            try {
                await verifyPaymentAPI({
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                    userEmail: user.email
                });
                navigate(`/book/${library.id}/success`);
            } catch (err) {
                alert("Verification Failed");
            } finally {
                setIsProcessing(false);
            }
        },
        theme: { color: "#2563EB" }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => setIsProcessing(false));
      rzp.open();

    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
        
        {/* Progress Bars (Kept Large as requested) */}
        <div className="flex gap-3 mb-8">
            <div className="w-60 h-2.5 rounded-full bg-green-500 transition-all"></div>
            <div className="w-60 h-2.5 rounded-full bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-all"></div>
        </div>

        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

        {/* Pricing Card */}
        <div className="bg-white dark:bg-gradient-to-br dark:from-[#1e293b] dark:to-[#0f172a] rounded-2xl p-6 border border-gray-200 dark:border-white/10 shadow-xl relative overflow-hidden mb-6">
            
            <div className="space-y-5 relative z-10">
                
                {/* --- Row 1: Subscription Name & Original Price --- */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                         <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Subscription</span>
                         <span className="text-gray-900 dark:text-white text-base font-bold">1 Month Plan</span>
                    </div>

                    {/* ✅ FIX: Perfect Alignment (Inline Badge) */}
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-lg border border-gray-100 dark:border-white/10">
                        <span className="text-sm text-gray-400 line-through decoration-red-500/50">₹{originalPrice}</span>
                        <div className="text-[10px] font-bold bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/30 px-2 py-0.5 rounded-full">
                            SAVED ₹{savedAmount}
                        </div>
                    </div>
                </div>
                
                {/* --- Row 2: Offer Price --- */}
                <div className="flex justify-between items-center bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-white/5">
                    <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Offer Price</span>
                    <span className="text-green-600 dark:text-green-400 text-xl font-bold">₹{finalPrice}</span>
                </div>
                
                {/* --- Row 3: Fees --- */}
                <div className="flex justify-between text-gray-500 dark:text-gray-500 text-xs italic px-1">
                    <span>Gateway Fee (Est. 3%)</span>
                    <span>+ ₹{estimatedFee}</span>
                </div>

                <div className="h-px bg-gray-200 dark:bg-white/10"></div>
                
                {/* --- Row 4: Total --- */}
                <div className="flex justify-between items-center">
                    <span className="text-gray-900 dark:text-white font-medium text-lg">Total to Pay</span>
                    <span className="text-4xl font-black text-blue-600 dark:text-white tracking-tight">₹{totalDisplay}</span>
                </div>
            </div>
        </div>

        {/* Security Badge */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-500/20 mb-8">
            <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-full">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">100% Secure Payment</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Encrypted transaction via Razorpay</p>
            </div>
        </div>

        {/* Payment Button */}
        <button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
        >
            {isProcessing ? <Loader2 className="animate-spin w-5 h-5" /> : (
                <>
                    <CreditCard className="w-5 h-5" /> Proceed to Pay
                </>
            )}
        </button>

        <p className="mt-4 text-[10px] text-gray-400 dark:text-gray-500 text-center flex items-center justify-center gap-1">
             <Lock size={10} /> Powered by BookLibrary Secure
        </p>
    </div>
  );
};

export default StepPayment;