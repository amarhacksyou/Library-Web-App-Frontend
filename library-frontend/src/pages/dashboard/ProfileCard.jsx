import React, { useRef } from 'react';

const ProfileCard = ({ user, uploading, uploadStatus, handleImageChange, triggerFileInput, fileInputRef }) => {
  
  const getProfileImage = () => {
    if (!user.profilePicture) return null;
    if (user.profilePicture.startsWith("http")) return user.profilePicture;
    return `https://booklibrary-6izs.onrender.com${user.profilePicture}`; 
  };

  return (
    <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white text-center shadow-2xl relative overflow-hidden group border border-white/10 transition-all duration-300">
      
      {/* Profile Image Container */}
      <div className="relative w-24 h-24 mx-auto mb-3 group/image">
        <div className="w-full h-full rounded-full border-4 border-white/30 shadow-lg overflow-hidden bg-white/20 flex items-center justify-center text-3xl font-bold">
          {getProfileImage() ? (
            <img 
                src={getProfileImage()} 
                alt="Profile" 
                className="w-full h-full object-cover" 
            />
          ) : (
            user.name ? user.name.charAt(0).toUpperCase() : 'U'
          )}
        </div>

        {/* Camera Icon Overlay */}
        <div 
          onClick={triggerFileInput}
          className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity cursor-pointer z-10"
        >
          {uploading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          ) : (
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          )}
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageChange} 
          accept="image/png, image/jpeg, image/jpg"
          className="hidden" 
        />
      </div>

      {/* Status Message Area */}
      <div className="h-6 mb-2 flex items-center justify-center">
          {uploadStatus && (
              <div className={`text-[10px] font-bold px-3 py-1 rounded-full animate-in fade-in slide-in-from-top-2 border shadow-sm ${
                  uploadStatus.type === 'error' 
                  ? 'bg-red-500 text-white border-red-400' 
                  : 'bg-emerald-500 text-white border-emerald-400'
              }`}>
                  {uploadStatus.msg}
              </div>
          )}
      </div>

      <h2 className="text-xl font-bold tracking-tight">{user.name}</h2>
      <p className="text-white/80 text-xs mb-4 font-mono">{user.email}</p>
      
      <div className="bg-black/20 rounded-lg p-2 backdrop-blur-sm inline-block border border-white/10">
        <p className="text-[10px] uppercase tracking-widest opacity-70 mb-1">Phone</p>
        <p className="text-sm font-mono font-bold tracking-wider">{user.phoneNumber}</p>
      </div>
    </div>
  );
};

export default ProfileCard;