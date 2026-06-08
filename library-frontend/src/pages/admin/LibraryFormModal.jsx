import React, { useState, useEffect } from 'react';
import { X, Check, Loader2, UploadCloud, Wifi, Zap, Droplets, Lock, ShieldCheck, Trash2, Car } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../services/adminApi';

// 🛠️ CONFIG: Predefined Amenities List
const AMENITY_OPTIONS = [
  { id: 'High-Speed Wi-Fi', label: 'Wi-Fi', icon: <Wifi size={14} /> },
  { id: 'Air Conditioning', label: 'AC', icon: <Zap size={14} /> },
  { id: 'RO Water', label: 'Water', icon: <Droplets size={14} /> },
  { id: 'Locker Facility', label: 'Locker', icon: <Lock size={14} /> },
  { id: 'CCTV Surveillance', label: 'CCTV', icon: <ShieldCheck size={14} /> },
  { id: 'Power Backup', label: 'Power', icon: <Zap size={14} /> },
  { id: 'Parking Area', label: 'Parking', icon: <Car size={14} /> }
];

// ✅ SAFEGUARD: Default props
const LibraryFormModal = ({ isOpen, onClose, libraryToEdit = null, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '', address: '', locationTag: '', description: '',
    originalPrice: '', offerPrice: '', openingHours: '6 AM - 10 PM',
    totalSeats: '', contactNumber: '',
    amenities: [], // ✅ Array for Toggles
    images: []     // ✅ Array for Images
  });

  // Populate Data on Open
  useEffect(() => {
    if (isOpen) {
      if (libraryToEdit) {
        setFormData({
          ...libraryToEdit,
          // Ensure these are arrays even if backend sends null
          amenities: Array.isArray(libraryToEdit.amenities) ? libraryToEdit.amenities : [],
          images: Array.isArray(libraryToEdit.images) ? libraryToEdit.images : []
        });
      } else {
        // Reset for New Entry
        setFormData({
          name: '', address: '', locationTag: '', description: '',
          originalPrice: '', offerPrice: '', openingHours: '6 AM - 10 PM',
          totalSeats: '', contactNumber: '', amenities: [], images: []
        });
      }
    }
  }, [libraryToEdit, isOpen]);

  // Handle Text Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ LOGIC: Toggle Amenity Selection
  const toggleAmenity = (amenityId) => {
    setFormData(prev => {
      const exists = prev.amenities.includes(amenityId);
      let newAmenities;
      if (exists) {
        newAmenities = prev.amenities.filter(item => item !== amenityId); // Remove
      } else {
        newAmenities = [...prev.amenities, amenityId]; // Add
      }
      return { ...prev, amenities: newAmenities };
    });
  };

  // ✅ LOGIC: Upload Image
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      // Call the Generic Upload Endpoint
      const response = await api.post('/public/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Handle unwrapped response from interceptor
      const fileUrl = typeof response === 'string' ? response : (response.url || response);

      setFormData(prev => ({ ...prev, images: [...prev.images, fileUrl] }));
      toast.success("Image uploaded!");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed. Try a smaller JPG/PNG.");
    } finally {
      setUploading(false);
    }
  };

  // Logic: Remove Image
  const removeImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare payload (Convert numbers)
    // 1. Convert ["Wi-Fi", "AC"]  --->  [{ name: "Wi-Fi" }, { name: "AC" }]
    const formattedAmenities = formData.amenities.map(item => ({ name: item }));
    // 2. ⚠️ NEW FIX: Fix Images mapping
// Assuming your LibraryImage entity has a 'url' field

const formattedImages = formData.images.map(imgUrl => ({ imageUrl: imgUrl }));

    const payload = {
      ...formData,
      amenities: formattedAmenities,
      images: formattedImages,
      originalPrice: Number(formData.originalPrice),
      offerPrice: Number(formData.offerPrice),
      totalSeats: Number(formData.totalSeats)
    };

    try {
      if (libraryToEdit) {
        await api.put(`/libraries/${libraryToEdit.id}`, payload);
        toast.success("Library Updated!");
      } else {
        await api.post('/libraries', payload);
        toast.success("Library Created!");
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to save. Check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputClass = "w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-sm";
  const labelClass = "block text-xs font-medium text-gray-400 mb-1.5 ml-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-white/10 bg-[#0f172a]/95 backdrop-blur-md">
          <h2 className="text-xl font-bold text-white">
            {libraryToEdit ? 'Edit Library' : 'Add New Branch'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <div>
               <label className={labelClass}>Library Name</label>
               <input required name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="e.g. Saraswati Library" />
             </div>
             <div>
               <label className={labelClass}>Location Tag</label>
               <input required name="locationTag" value={formData.locationTag} onChange={handleChange} className={inputClass} placeholder="e.g. Chas" />
             </div>
          </div>

          <div>
            <label className={labelClass}>Full Address</label>
            <textarea required name="address" value={formData.address} onChange={handleChange} className={`${inputClass} min-h-[60px]`} placeholder="Detailed address..." />
          </div>

          {/* Pricing & Seats */}
          <div className="grid grid-cols-3 gap-4">
             <div>
               <label className={labelClass}>Price (₹)</label>
               <input required type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className={inputClass} />
             </div>
             <div>
               <label className={labelClass}>Offer (₹)</label>
               <input required type="number" name="offerPrice" value={formData.offerPrice} onChange={handleChange} className={inputClass} />
             </div>
             <div>
               <label className={labelClass}>Seats</label>
               <input required type="number" name="totalSeats" value={formData.totalSeats} onChange={handleChange} className={inputClass} />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className={labelClass}>Contact Number</label>
                <input required name="contactNumber" value={formData.contactNumber} onChange={handleChange} className={inputClass} />
             </div>
             <div>
                <label className={labelClass}>Opening Hours</label>
                <input name="openingHours" value={formData.openingHours} onChange={handleChange} className={inputClass} />
             </div>
          </div>

          {/* --- AMENITIES TOGGLES --- */}
          <div>
            <label className={labelClass}>Select Amenities</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {AMENITY_OPTIONS.map((item) => {
                const isSelected = formData.amenities.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleAmenity(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                      isSelected
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-black/20 border-white/10 text-gray-400 hover:bg-white/5'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                    {isSelected && <Check size={12} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* --- IMAGE UPLOAD SECTION --- */}
          <div>
            <label className={labelClass}>Library Photos</label>
            <div className="flex flex-wrap items-center gap-4 mt-2">
                
                {/* Upload Button */}
                <div className="relative group">
                    <input 
                        type="file" 
                        id="imgUpload" 
                        accept="image/png, image/jpeg, image/jpg , image/webp" 
                        onChange={handleFileUpload} 
                        className="hidden" 
                        disabled={uploading}
                    />
                    <label 
                        htmlFor="imgUpload" 
                        className={`flex flex-col items-center justify-center w-24 h-24 bg-black/30 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-500/10 transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {uploading ? <Loader2 className="animate-spin text-blue-500"/> : <UploadCloud className="text-gray-400 mb-1"/>}
                        <span className="text-[10px] text-gray-400">{uploading ? 'Uploading...' : 'Add Photo'}</span>
                    </label>
                </div>

                {/* Image Previews */}
                {formData.images.map((url, index) => (
                  <div key={index} className="relative w-24 h-24 group rounded-xl overflow-hidden border border-white/10">
                    <img src={url} alt="Preview" className="w-full h-full object-cover"/>
                    {/* Delete Button Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="bg-red-500 p-1.5 rounded-full text-white hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-white/10 flex gap-3">
             <button type="submit" disabled={loading || uploading} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all">
                {loading ? <Loader2 className="animate-spin" /> : <Check size={18} />}
                {libraryToEdit ? 'Save Changes' : 'Create Library'}
             </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LibraryFormModal;