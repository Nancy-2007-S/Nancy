import React, { useState } from 'react';
import { Sparkles, LayoutDashboard, User, LogOut, Bot, X, Send } from 'lucide-react';

export default function Recommendations({ data, userInfo, onNavigateDashboard, onNavigateRoadmap, onNavigateProfile }) {
  const goal = userInfo?.career_goal || "Software Engineer";
  const name = userInfo?.name || "Explorer";
  const missingSkills = data?.missing_skills || ["HTML", "CSS", "React", "Node.js", "Express", "MongoDB", "SQL", "Git"];
  const currentSkills = userInfo?.skills || ["JavaScript"];
  const allTargetSkills = [...currentSkills, ...missingSkills].slice(0, 15); // Combine and limit for UI

  const offers = data?.advanced_offers;

  return (
    <div className="min-h-screen bg-[#f8fbfe] text-slate-900 font-sans flex flex-col items-center pb-20">
      {/* Top Navbar */}
      <header className="w-full bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigateRoadmap}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 shadow-lg shadow-indigo-500/20 flex items-center justify-center border-2 border-white">
            <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-800">Career Mentor</h1>
        </div>

        <nav className="flex items-center gap-12 font-bold text-sm">
          <button className="text-slate-400 hover:text-slate-700 transition-colors" onClick={onNavigateDashboard}>Dashboard</button>
          <button className="text-emerald-500 border-b-2 border-emerald-500 pb-1">Recommendations</button>
          <button className="text-slate-400 hover:text-slate-700 transition-colors" onClick={onNavigateProfile}>Profile</button>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={onNavigateRoadmap}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <LayoutDashboard size={18} />
          </button>
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 font-black flex items-center justify-center border border-indigo-100">
            {name.charAt(0).toUpperCase()}
          </div>
          <button className="text-slate-400 hover:text-slate-700">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-6xl mx-auto pt-10 px-6 space-y-8">
        
        {/* Banner Widget */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex items-start gap-6">
           <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100 shadow-inner">
             <Sparkles className="w-8 h-8 text-indigo-500" />
           </div>
           <div>
             <h2 className="text-2xl font-black text-slate-800">AI Suggested Resources</h2>
             <p className="text-slate-500 font-medium mt-2 leading-relaxed text-lg">
               Based on your goal to become a <strong className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{goal}</strong> and your current skills, we found <strong className="text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">{missingSkills.length}</strong> <strong className="text-rose-500">missing technologies</strong> you should learn.
             </p>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
           
           {/* Left Column Widgets */}
           <div className="w-full lg:w-[320px] shrink-0 space-y-8">
              {/* Skill Gaps Identified */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                 <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-6 flex items-center gap-2">
                   <span className="text-rose-500">{'>'}</span> Skill Gaps Identified
                 </h3>
                 <div className="flex flex-wrap gap-2">
                    {missingSkills.map(skill => (
                      <span key={skill} className="px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100 font-bold text-xs shadow-sm flex items-center gap-1.5 hover:bg-rose-100 cursor-default transition-colors">
                        <div className="w-1 h-1 bg-rose-500 rounded-full text-[10px] items-center justify-center flex"/> {skill}
                      </span>
                    ))}
                 </div>
              </div>

              {/* Target Skills */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                 <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-6">Target Skills For Your Goal</h3>
                 <div className="flex flex-wrap gap-2">
                    {allTargetSkills.map(skill => {
                       const isLearned = currentSkills.includes(skill);
                       return (
                         <span key={skill} className={`px-3 py-1.5 rounded-md border font-bold text-xs ${isLearned ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                           {skill} {isLearned && '✓'}
                         </span>
                       );
                    })}
                 </div>
              </div>
           </div>

           {/* Right Column Courses */}
           <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="bg-slate-50/80 p-5 font-black text-slate-800 border-b border-slate-200 flex items-center gap-3">
                 <div className="w-8 h-8 rounded bg-white text-indigo-500 flex items-center justify-center shadow-sm border border-slate-100 text-lg">📚</div>
                 Recommended Courses
               </div>

               <div className="flex flex-col">
                  {!offers ? (
                     <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
                        <Sparkles className="animate-spin text-indigo-500 mb-4" size={36} />
                        <h4 className="font-black text-slate-800 text-lg">Scanning API via Apify...</h4>
                        <p className="text-sm font-medium text-slate-500 mt-2">Fetching live targeted Udemy courses & Internships based on your stack</p>
                     </div>
                  ) : offers.length === 0 ? (
                     <div className="p-12 text-center text-slate-400 font-bold">No dynamic courses found yet. Check your internet connection.</div>
                  ) : offers.map((offer, idx) => (
                    <div key={idx} onClick={() => offer.url && window.open(offer.url, "_blank")} className="flex items-center gap-6 p-6 border-b border-slate-100 hover:bg-white transition-colors group cursor-pointer hover:shadow-lg">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border font-black text-2xl shadow-sm group-hover:scale-105 transition-transform ${offer.type === 'Internship' ? 'bg-amber-50 text-amber-500 border-amber-200' : 'bg-indigo-50 text-emerald-500 border-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.2)]'}`}>
                          {offer.type === 'Internship' ? '💼' : '🎓'}
                       </div>
                       <div className="flex-1">
                          <div className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-1.5 ${offer.type === 'Internship' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
                             {offer.type}
                          </div>
                          <h4 className="font-black text-slate-800 text-lg leading-tight line-clamp-2">{offer.name}</h4>
                          <p className="text-xs font-bold text-slate-500 mt-2">{offer.company || offer.provider} • <span className="text-emerald-500 relative top-px">● Live Match</span></p>
                       </div>
                    </div>
                  ))}
                  <div className="p-4 text-center">
                    <button className="text-indigo-600 font-bold text-sm bg-indigo-50 px-6 py-2 rounded-xl hover:bg-indigo-100 transition-colors">View More Courses</button>
                  </div>
               </div>
           </div>

        </div>
      </main>
    </div>
  );
}
