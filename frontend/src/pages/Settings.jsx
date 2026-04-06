import { useState, useRef } from "react";
import Layout from "../components/Layout";
import { Settings as SettingsIcon, Bell, Shield, User, Smartphone, Globe, Cloud, Camera } from "lucide-react";

export default function Settings() {
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);

  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create local preview URL
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };

  return (
    <Layout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto">
        <div className="mb-8 p-6 glass-card border border-brand-200/50 bg-white/40 shadow-sm rounded-3xl">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
             <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-600 to-indigo-500">Settings</span>
          </h1>
          <p className="text-sm text-gray-500 mt-2">Manage your account preferences and application settings.</p>
        </div>

        <div className="space-y-8">
            
            {/* Profile Section */}
            <div className="glass-card overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
               <div className="px-8 py-5 border-b border-gray-100/60 bg-white/40 flex items-center gap-2">
                 <User className="w-5 h-5 text-brand-600" />
                 <h2 className="text-xl font-bold text-gray-900">Profile Details</h2>
               </div>
               
               <div className="p-8 bg-white/30 backdrop-blur-sm space-y-6">
                  <div className="flex items-center gap-6 mb-8">
                     <div className={`w-24 h-24 rounded-2xl bg-linear-to-br from-brand-100 to-indigo-100 text-brand-600 flex items-center justify-center font-bold text-3xl shadow-inner border border-white/50 overflow-hidden relative group ${avatar ? '' : 'backdrop-blur-sm'}`}>
                       {avatar ? (
                         <img src={avatar} alt="Profile Avatar" className="w-full h-full object-cover" />
                       ) : (
                         "AA"
                       )}
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Camera className="w-6 h-6 text-white" />
                       </div>
                     </div>
                     <div>
                        <input 
                           type="file" 
                           accept="image/jpeg, image/png, image/gif" 
                           className="hidden" 
                           ref={fileInputRef} 
                           onChange={handleAvatarSelect} 
                        />
                        <button 
                           onClick={() => fileInputRef.current?.click()}
                           className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:text-brand-600 hover:border-brand-300 hover:bg-brand-50 rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer"
                        >
                           Change Avatar
                        </button>
                        <p className="text-xs text-gray-400 mt-2">JPG, GIF or PNG. 1MB max.</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
                       <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none text-sm bg-white/60" defaultValue="Aaquib Ahmad" />
                     </div>
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                       <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none text-sm bg-gray-100 text-gray-500" defaultValue="Admin Account" readOnly />
                     </div>
                     <div className="sm:col-span-2">
                       <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                       <input type="email" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none text-sm bg-white/60" defaultValue="admin@anvaya.com" />
                     </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                     <button className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95">
                        Save Changes
                     </button>
                  </div>
               </div>
            </div>

            {/* Application Settings Section */}
            <div className="glass-card overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
               <div className="px-8 py-5 border-b border-gray-100/60 bg-white/40 flex items-center gap-2">
                 <SettingsIcon className="w-5 h-5 text-brand-600" />
                 <h2 className="text-xl font-bold text-gray-900">Application Preferences</h2>
               </div>
               
               <div className="p-8 bg-white/30 backdrop-blur-sm space-y-6">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100/50">
                     <div>
                        <h3 className="font-bold text-gray-900 text-sm">Dark Mode</h3>
                        <p className="text-xs text-gray-500 mt-1">Toggle dark mode interface</p>
                     </div>
                     <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-not-allowed opacity-50">
                        <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
                     </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-gray-100/50">
                     <div>
                        <h3 className="font-bold text-gray-900 text-sm">Email Notifications</h3>
                        <p className="text-xs text-gray-500 mt-1">Receive alerts for new leads</p>
                     </div>
                     <div className="w-12 h-6 bg-brand-500 rounded-full relative cursor-pointer shadow-inner">
                        <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
                     </div>
                  </div>
               </div>
            </div>

        </div>
      </div>
    </Layout>
  );
}
