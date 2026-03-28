'use client';
import { useStore } from '@/store/useStore';
import { CheckCircle, PlaySquare } from 'lucide-react';

export default function RightSidebar() {
  const { userProfile } = useStore();

  return (
    <div className="w-full lg:w-80 xl:w-96 flex flex-col gap-6 shrink-0">
      {/* Overview Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 tracking-tight text-lg mb-4">Progress Overview</h3>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full border border-slate-200 overflow-hidden bg-indigo-50 flex items-center justify-center shrink-0 shadow-sm">
            {userProfile?.photoURL ? (
              <img src={userProfile.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-indigo-400">
                {(userProfile?.name || 'U').charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h4 className="font-bold text-slate-800">{userProfile.name}</h4>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-md w-max mt-1">
               <CheckCircle className="w-3.5 h-3.5" /> Profile 100%
            </div>
          </div>
        </div>

        <div className="mb-6">
           <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Current Skills</p>
           <div className="flex flex-wrap gap-2">
             {(userProfile?.skills || []).map(s => (
               <span key={s} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium border border-slate-200">
                 {s}
               </span>
             ))}
           </div>
        </div>

        <div className="mb-6">
           <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Interests</p>
           <div className="flex flex-wrap gap-2">
             {(userProfile?.interests || []).map(s => (
               <span key={s} className="px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full text-sm font-medium">
                 {s}
               </span>
             ))}
           </div>
        </div>
      </div>

      {/* Suggested Projects */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 tracking-tight text-lg mb-4">Suggested Projects</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl hover:shadow-sm cursor-pointer transition-shadow">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center shrink-0">
               <PlaySquare className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-slate-700">Build a Portfolio Website</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl hover:shadow-sm cursor-pointer transition-shadow">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
               <PlaySquare className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-slate-700">Simple Blog Application</span>
          </div>
        </div>
      </div>

    </div>
  );
}
