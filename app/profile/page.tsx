"use client";

import { User, LogOut, Settings, Mail, Info, MapPin, Calendar, ShieldCheck, X, Save, Camera, CheckCircle2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userData, setUserData] = useState({
    name: "Ajoy Roy",
    email: "abjoyroy12@gmail.com",
    bio: "Passionate Full-Stack Developer exploring Next.js, UI/UX, and modern web technologies.",
    role: "Admin",
    joined: "March 2026",
    location: "Bangladesh",
    profilePic: "" 
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [formData, setFormData] = useState({ ...userData });

  // 🆕 পেজ লোড হলে ডেটা রিস্টোর করার লজিক
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      
      // চেক করে দেখবে এই ইমেইলের কোনো পারমানেন্ট সেভ করা প্রোফাইল আছে কি না
      const savedProfileData = localStorage.getItem(`user_profile_${parsedUser.email}`);
      
      if (savedProfileData) {
        // যদি থাকে, তবে আগের ছবি ও আপডেট করা ইনফরমেশন রিস্টোর করবে
        const parsedProfile = JSON.parse(savedProfileData);
        setUserData(parsedProfile);
        setFormData(parsedProfile);
        
        // রিস্টোর করা ডেটা দিয়ে বর্তমান সেশনও আপডেট করে দিবে যাতে Navbar ছবি পায়
        localStorage.setItem('user', JSON.stringify(parsedProfile));
        window.dispatchEvent(new Event('userUpdated'));
      } else {
        // প্রথমবার লগইন করলে ডিফল্ট ডেটা সেট করবে
        setUserData(prev => ({ ...prev, ...parsedUser }));
        setFormData(prev => ({ ...prev, ...parsedUser }));
      }
    } else {
      // ইউজার লগইন না থাকলে হোমে পাঠিয়ে দিবে
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    // 🆕 লগআউটে শুধুমাত্র সেশন ডাটা মুছে ফেলা হচ্ছে, কিন্তু পারমানেন্ট প্রোফাইল ডেটা থেকে যাচ্ছে
    localStorage.removeItem('user'); 
    window.dispatchEvent(new Event('userUpdated')); 
    
    setShowLogoutPopup(true);
    
    setTimeout(() => {
      router.push("/"); 
    }, 1500);
  };

  const openSettings = () => {
    setFormData({ ...userData });
    setIsSettingsOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUserData({ ...formData });
    
    // 🆕 সেশন এবং পারমানেন্ট স্টোরেজ—উভয় জায়গায় ডেটা সেভ করা হচ্ছে
    localStorage.setItem('user', JSON.stringify(formData));
    localStorage.setItem(`user_profile_${formData.email}`, JSON.stringify(formData));
    
    window.dispatchEvent(new Event('userUpdated'));
    setIsSettingsOpen(false); 
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 300; 
          const MAX_HEIGHT = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

          setUserData((prev) => {
            const newData = { ...prev, profilePic: compressedBase64 };
            
            try {
              // 🆕 ছবি আপলোড করলেও তা পারমানেন্ট স্টোরেজে সেভ হয়ে থাকবে
              localStorage.setItem('user', JSON.stringify(newData)); 
              localStorage.setItem(`user_profile_${newData.email}`, JSON.stringify(newData)); 
              window.dispatchEvent(new Event('userUpdated')); 
            } catch (error) {
              console.error("Storage limit exceeded even after compression:", error);
              alert("The image is still too large. Please select a smaller file.");
            }
            
            return newData;
          });
          setFormData((prev) => ({ ...prev, profilePic: compressedBase64 }));
        };
        img.src = event.target?.result as string;
      };
      
      reader.readAsDataURL(file); 
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white pt-28 pb-12 px-6 transition-colors duration-300 relative">
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-3xl font-black mb-8 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400">
          Profile
        </h1>

        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-emerald-500/20 bg-white/60 dark:bg-[#064e3b]/20 p-10 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_0_40px_rgba(16,185,129,0.15)] backdrop-blur-xl flex flex-col md:flex-row gap-12 items-center md:items-start min-h-[360px] transition-all duration-300">
          
          <button 
            onClick={openSettings}
            className="absolute top-6 right-6 p-3 text-slate-500 dark:text-emerald-400/70 hover:text-emerald-600 dark:hover:text-white bg-slate-100 dark:bg-emerald-500/10 hover:bg-slate-200 dark:hover:bg-emerald-500/30 rounded-full transition-all duration-300 shadow-sm dark:shadow-md group"
          >
            <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
          </button>

          <div className="flex flex-col items-center gap-6 flex-shrink-0">
            <div 
              onClick={triggerFileInput}
              className="relative w-44 h-44 rounded-full border-4 border-emerald-500/30 bg-slate-100 dark:bg-[#022c22] shadow-[0_0_20px_rgba(52,211,153,0.2)] dark:shadow-[0_0_25px_rgba(52,211,153,0.3)] flex items-center justify-center overflow-hidden group cursor-pointer"
              title="Click to upload picture"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
              
              {userData.profilePic ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={userData.profilePic} 
                  alt="Profile Picture" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <User className="w-24 h-24 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
              )}

              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-300 border border-red-200 dark:border-red-500/20 rounded-xl transition-all duration-300 shadow-sm dark:shadow-[0_0_15px_rgba(239,68,68,0.15)] transform active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>

          <div className="flex-1 space-y-6 text-center md:text-left mt-4 md:mt-2">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white tracking-wide">{userData.name}</h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 mt-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/20 rounded-full border border-emerald-200 dark:border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                {userData.role}
              </span>
            </div>

            <div className="flex flex-col gap-3.5 text-slate-600 dark:text-emerald-100/80 text-base max-w-xl">
              <p className="flex items-start justify-center md:justify-start gap-3">
                <Info className="w-5 h-5 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>{userData.bio}</span>
              </p>
              
              <div className="h-[1px] bg-slate-200 dark:bg-emerald-500/10 my-1"></div>

              <p className="flex items-center justify-center md:justify-start gap-3 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">
                <Mail className="w-5 h-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                {userData.email}
              </p>

              <p className="flex items-center justify-center md:justify-start gap-3 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">
                <MapPin className="w-5 h-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                {userData.location}
              </p>

              <p className="flex items-center justify-center md:justify-start gap-3 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">
                <Calendar className="w-5 h-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                Joined: {userData.joined}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-emerald-50 border-b border-slate-300 dark:border-emerald-500/20 pb-3 inline-block">
            Your Current Information
          </h2>
          
          <div className="w-full min-h-[150px] rounded-2xl border border-dashed border-slate-300 dark:border-emerald-500/10 bg-slate-100/50 dark:bg-emerald-500/[0.02] flex items-center justify-center text-slate-400 dark:text-emerald-500/30 font-medium text-sm transition-colors duration-300">
            No dynamic logs available. Additional components can be added here later.
          </div>
        </div>

      </div>

      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/40 dark:bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 dark:border-emerald-500/30 bg-white dark:bg-[#0b0f19] p-8 shadow-2xl dark:shadow-[0_0_50px_rgba(16,185,129,0.3)] animate-in zoom-in-95 duration-300">
            
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                Edit Profile Information
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Update your basic details and profile configurations.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-emerald-400/80 uppercase tracking-wider mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-emerald-400/80 uppercase tracking-wider mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-emerald-400/80 uppercase tracking-wider mb-1.5">Bio</label>
                <textarea 
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-emerald-400/80 uppercase tracking-wider mb-1.5">Location</label>
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-emerald-400/80 uppercase tracking-wider mb-1.5">Joined Date</label>
                  <input 
                    type="text" 
                    value={formData.joined}
                    onChange={(e) => setFormData({ ...formData, joined: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-500 dark:to-teal-600 text-white rounded-xl shadow-md dark:shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-lg dark:hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLogoutPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-md transition-all duration-300 px-4">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes rgb-border-loop {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .animate-rgb-glow {
              background-size: 300% 300%;
              animation: rgb-border-loop 2s linear infinite;
            }
          `}} />
          
          <div className="relative p-[3px] rounded-3xl overflow-hidden max-w-sm w-full bg-gradient-to-r from-cyan-500 via-purple-500 via-pink-500 via-emerald-400 to-cyan-500 animate-rgb-glow shadow-[0_0_35px_rgba(6,182,212,0.4)] dark:shadow-[0_0_50px_rgba(16,185,129,0.3)]">
            <div className="bg-white dark:bg-[#090d16] rounded-[22px] p-8 flex flex-col items-center w-full">
              <div className="relative mb-5 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping opacity-75 duration-1000" />
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-8 h-8 text-white animate-in zoom-in duration-300" />
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 mb-2 text-center tracking-tight">
                Logout Successful
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 text-center leading-relaxed">
                You have been securely logged out. Redirecting to homepage...
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}