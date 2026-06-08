import React, { useEffect, useState } from 'react';
import adminApi from '../../services/adminApi';
import { Star, Eye, EyeOff, MessageSquare, Filter, ShieldCheck } from 'lucide-react';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState(0); 

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
     const data = await adminApi.getAllReviews();
      setReviews(Array.isArray(data) ? data : []);
    }catch (error) {
      console.error("Failed to load reviews", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (reviewId) => {
    try {
      const res = await adminApi.put(`/reviews/admin/toggle-visibility/${reviewId}`, null);
      if (res.status === 200) {
        const updated = res.data;
        setReviews(prev =>
          prev.map(r => r.id === reviewId ? { ...r, isVisible: updated.isVisible } : r)
        );
      }
    } catch (error) {
      console.error('toggleVisibility error', error);
      alert('Failed to update status.');
    }
  };

  const filteredReviews = filterRating === 0 
    ? reviews 
    : reviews.filter(r => r.rating === filterRating);

  const stats = {
    total: reviews.length,
    avg: reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) : 0,
    hidden: reviews.filter(r => !r.isVisible).length
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await adminApi.deleteReview(id);
      toast.success("Review deleted");
      fetchReviews();
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={<MessageSquare className="text-blue-400" />} label="Total Reviews" value={stats.total} />
        <StatCard icon={<Star className="text-yellow-400" />} label="Average Rating" value={`${stats.avg} / 5`} />
        <StatCard icon={<ShieldCheck className="text-red-400" />} label="Hidden Reviews" value={stats.hidden} />
      </div>

      {/* 2. Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-black text-white tracking-tight">Feedback </h2>
          <p className="text-gray-400 text-sm mt-1 font-medium">Manage and moderate student experiences.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-black/40 p-2 rounded-2xl border border-white/5">
            <Filter size={18} className="text-gray-500 ml-2" />
            <select 
                value={filterRating}
                onChange={(e) => setFilterRating(Number(e.target.value))}
                className="bg-transparent text-white text-sm font-bold outline-none cursor-pointer pr-4"
            >
                <option value={0} className="bg-gray-900">All Ratings</option>
                {[5, 4, 3, 2, 1].map(num => (
                    <option key={num} value={num} className="bg-gray-900">{num} Stars</option>
                ))}
            </select>
        </div>
      </div>

      {/* 3. Reviews List */}
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
                <p className="font-bold tracking-widest uppercase text-xs">Fetching Reviews...</p>
            </div>
        ) : filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
                <div 
                    key={review.id} 
                    className={`group relative p-8 rounded-[2rem] border transition-all duration-300 ${
                        review.isVisible 
                        ? 'bg-white/5 border-white/10 hover:border-blue-500/30' 
                        : 'bg-red-950/20 border-red-500/20 grayscale-[0.5]'
                    }`}
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex gap-5">
                            <div className="relative">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xl font-black shadow-xl ring-4 ring-white/5">
                                    {review.user.name.charAt(0)}
                                </div>
                                {!review.isVisible && (
                                    <div className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 border-2 border-black">
                                        <EyeOff size={12} className="text-white" />
                                    </div>
                                )}
                            </div>
                            
                            <div>
                                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                                    {review.user.name}
                                    <span className="hidden sm:inline text-xs font-bold text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full uppercase tracking-tighter">
                                        {review.library.name}
                                    </span>
                                </h4>
                                <div className="flex items-center gap-1 mt-1.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} className={`${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-700"} transition-all`} />
                                    ))}
                                    <span className="text-[10px] text-gray-500 font-mono ml-3 uppercase">
                                        {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => toggleVisibility(review.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${
                                review.isVisible 
                                ? 'bg-white/5 text-gray-400 hover:bg-red-600/10 hover:text-red-500' 
                                : 'bg-green-600 text-white shadow-lg shadow-green-600/20 hover:scale-105'
                            }`}
                        >
                            {review.isVisible ? <><EyeOff size={16} /> Hide Content</> : <><Eye size={16} /> Restore Content</>}
                        </button>
                    </div>

                    {/* ✅ FIXED COMMENT SECTION LOGIC */}
                    <div className={`mt-6 p-6 rounded-2xl border transition-all duration-300 ${
                        review.isVisible 
                        ? 'bg-black/40 border-white/5 text-gray-300' 
                        : 'bg-red-950/10 border-red-500/10 text-red-400/50 italic'
                    }`}>
                        <div className="relative">
                            <MessageSquare size={14} className={`absolute -top-1 -left-2 p-0.5 rounded shadow ${
                                review.isVisible ? 'text-gray-600 bg-gray-900' : 'text-red-900 bg-red-950'
                            }`} />
                            
                            {/* IF VISIBLE -> SHOW COMMENT. IF HIDDEN -> SHOW MESSAGE */}
                            {review.isVisible ? (
                                <span className="leading-relaxed">"{review.comment}"</span>
                            ) : (
                                <span className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest opacity-60">
                                    <EyeOff size={12} />
                                    Content Hidden by Admin
                                </span>
                            )}
                        </div>
                    </div>

                </div>
            ))
        ) : (
            <div className="text-center py-24 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10 flex flex-col items-center">
                <Star size={48} className="text-gray-800 mb-4" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No reviews found in this category</p>
            </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md flex items-center gap-4">
        <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{label}</p>
            <p className="text-2xl font-black text-white mt-1">{value}</p>
        </div>
    </div>
);

export default AdminReviews;