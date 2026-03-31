import React, { useState } from 'react';
import { LayoutDashboard, Sparkles, User, LogOut, CheckCircle2, PlayCircle, Bot, X, Send, Lock } from 'lucide-react';
import DailyCheckinTab from './DailyCheckinTab';

export default function Dashboard({ data, userInfo, onNavigateRoadmap, onNavigateRecommendations, onNavigateProfile, onMarkComplete, onAddStreakDate }) {
  const goal = userInfo?.career_goal || "Machine Learning Engineer";
  const name = userInfo?.name || "Explorer";
  const roadmapItems = data?.roadmap || ["Python & Math", "Data Handling", "Machine Learning Algorithms", "Deep Learning"];
  const missingSkills = data?.missing_skills || [];
  
  const total = roadmapItems.length;
  const chunk = Math.ceil(total / 3);
  const levels = {
    'Beginner Level': roadmapItems.slice(0, chunk),
    'Intermediate Level': roadmapItems.slice(chunk, chunk * 2),
    'Advanced Level': roadmapItems.slice(chunk * 2)
  };

  const getCompletedCount = (items) => items.filter(i => !missingSkills.includes(i)).length;
  
  const [activeLevel, setActiveLevel] = useState('Beginner Level');
  const [activeTab, setActiveTab] = useState('daily_checkin');

  return (
    <div className="min-h-screen bg-[#f8fbfe] text-slate-900 font-sans flex flex-col items-center">
      {/* Top Navbar */}
      <header className="w-full bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigateRoadmap}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 shadow-lg shadow-indigo-500/20 flex items-center justify-center border-2 border-white">
            <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-800">Career Mentor</h1>
        </div>

        <nav className="flex items-center gap-12 font-bold text-sm">
          <button className="text-emerald-500 border-b-2 border-emerald-500 pb-1 cursor-default">Dashboard</button>
          <button className="text-slate-400 hover:text-slate-700 transition-colors" onClick={onNavigateRecommendations}>Recommendations</button>
          <button className="text-slate-400 hover:text-slate-700 transition-colors cursor-default" onClick={onNavigateProfile}>Profile</button>
        </nav>

        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
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

      {/* Main Content Toggles */}
      <div className="w-full max-w-7xl mx-auto pt-6 px-6">
        <div className="flex gap-4 border-b border-slate-200">
            <button 
                onClick={() => setActiveTab('daily_checkin')}
                className={`py-3 px-6 font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'daily_checkin' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-slate-400 hover:text-slate-700'}`}
            >
                 Daily Check-In
            </button>
            <button 
                onClick={() => setActiveTab('learning_path')}
                className={`py-3 px-6 font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'learning_path' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-slate-400 hover:text-slate-700'}`}
            >
                Learning Path
            </button>
        </div>
      </div>

      {activeTab === 'daily_checkin' ? (
          <DailyCheckinTab userInfo={userInfo} onAddStreakDate={onAddStreakDate} />
      ) : (
      <main className="w-full max-w-7xl mx-auto py-8 flex flex-col lg:flex-row gap-8 px-6 animate-in slide-in-from-left-8 fade-in duration-500">
        
        {/* Left Column (Roadmap Steps) */}
        <div className="flex-1 space-y-8">
          
          {/* AI Banner */}
          <div className="w-full bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 font-bold text-sm flex items-center gap-3 shadow-sm">
            <span>🧠</span> 
            Your roadmap was updated! — Added challenge project node — you're progressing fast!
            <button className="ml-auto text-amber-500 hover:text-amber-700"><X size={16}/></button>
          </div>

          <div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Your {goal} Roadmap</h2>
            <p className="text-slate-500 font-medium">Welcome back, {name}! Here's your personalized learning path to become a {goal}.</p>
          </div>

          {/* Level Tabs */}
          <div className="flex gap-4">
             <button 
               onClick={() => setActiveLevel('Beginner Level')}
               className={`flex-1 rounded-2xl p-6 border text-left transition-all ${activeLevel === 'Beginner Level' ? 'bg-white border-emerald-500 shadow-lg shadow-emerald-500/10' : 'bg-white/50 border-slate-200 hover:border-slate-300'}`}
             >
               <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-xl ${activeLevel === 'Beginner Level' ? 'bg-emerald-500 shadow-md shadow-emerald-500/20' : 'bg-emerald-400'}`}>1</div>
                 <div>
                   <h3 className="font-black text-lg text-slate-800">Beginner Level</h3>
                   <p className="text-xs font-bold text-slate-400 mt-1">{getCompletedCount(levels['Beginner Level'])} / {levels['Beginner Level'].length} Steps Completed</p>
                   <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
                     <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${(getCompletedCount(levels['Beginner Level']) / (levels['Beginner Level'].length || 1)) * 100}%` }}></div>
                   </div>
                 </div>
               </div>
             </button>

             <button 
               onClick={() => setActiveLevel('Intermediate Level')}
               className={`flex-1 rounded-2xl p-6 border text-left transition-all ${activeLevel === 'Intermediate Level' ? 'bg-white border-indigo-500 shadow-lg shadow-indigo-500/10' : 'bg-white/50 border-slate-200 hover:border-slate-300'}`}
             >
               <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-xl ${activeLevel === 'Intermediate Level' ? 'bg-indigo-500 shadow-md shadow-indigo-500/20' : 'bg-indigo-400'}`}>2</div>
                 <div>
                   <h3 className="font-black text-lg text-slate-800">Intermediate Level</h3>
                   <p className="text-xs font-bold text-slate-400 mt-1">{getCompletedCount(levels['Intermediate Level'])} / {levels['Intermediate Level'].length} Steps Completed</p>
                   <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
                     <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${(getCompletedCount(levels['Intermediate Level']) / (levels['Intermediate Level'].length || 1)) * 100}%` }}></div>
                   </div>
                 </div>
               </div>
             </button>

             <button 
               onClick={() => setActiveLevel('Advanced Level')}
               className={`flex-1 rounded-2xl p-6 border text-left transition-all ${activeLevel === 'Advanced Level' ? 'bg-white border-purple-500 shadow-lg shadow-purple-500/10' : 'bg-white/50 border-slate-200 hover:border-slate-300'}`}
             >
               <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-xl ${activeLevel === 'Advanced Level' ? 'bg-purple-500 shadow-md shadow-purple-500/20' : 'bg-purple-400'}`}>3</div>
                 <div>
                   <h3 className="font-black text-lg text-slate-800">Advanced Level</h3>
                   <p className="text-xs font-bold text-slate-400 mt-1">{getCompletedCount(levels['Advanced Level'])} / {levels['Advanced Level'].length} Steps Completed</p>
                   <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
                     <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${(getCompletedCount(levels['Advanced Level']) / (levels['Advanced Level'].length || 1)) * 100}%` }}></div>
                   </div>
                 </div>
               </div>
             </button>
          </div>

          {/* Stepper Content */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm relative">
             <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-8">
               <h3 className="text-2xl font-black text-slate-800">{activeLevel} Roadmap</h3>
               <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-black border border-amber-200">✨ AI Updated</span>
             </div>

             <div className="flex gap-8 font-bold text-sm mb-6 pb-2">
               <span onClick={() => setActiveLevel('Beginner Level')} className={`cursor-pointer ${activeLevel === 'Beginner Level' ? 'text-emerald-500 border-b-2 border-emerald-500 pb-2' : 'text-slate-400 hover:text-emerald-400'}`}>Beginner Level</span>
               <span onClick={() => setActiveLevel('Intermediate Level')} className={`cursor-pointer ${activeLevel === 'Intermediate Level' ? 'text-indigo-500 border-b-2 border-indigo-500 pb-2' : 'text-slate-400 hover:text-indigo-400'}`}>Intermediate Level 🚀</span>
               <span onClick={() => setActiveLevel('Advanced Level')} className={`cursor-pointer ${activeLevel === 'Advanced Level' ? 'text-purple-500 border-b-2 border-purple-500 pb-2' : 'text-slate-400 hover:text-purple-400'}`}>Advanced Level</span>
             </div>

             <div className="space-y-6 relative ml-4">
                {/* Connecting Line */}
                <div className="absolute top-8 bottom-8 left-[18px] w-0.5 bg-emerald-500 z-0"></div>

                {/* Steps */}
                {levels[activeLevel]?.map((item, idx) => {
                  const isCompleted = !missingSkills.includes(item);
                  return (
                  <div key={idx} className="flex gap-8 relative z-10 w-full items-center">
                    <div className={`w-10 h-10 rounded-full bg-white border-2 shrink-0 flex items-center justify-center shadow-sm transition-colors ${isCompleted ? 'border-emerald-500' : 'border-slate-300'}`}>
                      {isCompleted ? <CheckCircle2 size={24} className="text-emerald-500" /> : <div className="w-3 h-3 bg-slate-300 rounded-full" />}
                    </div>
                    
                    <div className="flex-1 bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all cursor-pointer flex items-center justify-between">
                       <div>
                         <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">Step {idx + 1}</p>
                         <h4 className="text-lg font-black text-slate-800">{item}</h4>
                         <p className="text-sm font-medium text-slate-500 mt-1">Master foundational concepts and tools.</p>
                       </div>
                       <div className="flex flex-col items-end gap-3 z-20">
                          <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm transition-colors">
                            <PlayCircle size={18} /> Resource
                          </button>
                          {isCompleted ? (
                             <span className="px-4 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-black flex items-center gap-2 border border-emerald-100">
                                <CheckCircle2 size={14}/> Completed
                             </span>
                          ) : (
                             <button 
                               onClick={(e) => { e.stopPropagation(); onMarkComplete(item); }}
                               className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-indigo-600 text-white text-xs font-black flex items-center gap-2 transition-colors border border-transparent shadow-sm"
                             >
                               Mark as completed ✓
                             </button>
                          )}
                       </div>
                    </div>
                  </div>
                )})}
             </div>
          </div>
        </div>

        {/* Right Column (Widgets) */}
        <div className="w-full lg:w-[380px] space-y-6">
           {/* Progress Overview */}
           <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col items-center">
              <h3 className="w-full text-lg font-black text-slate-800 mb-6">Progress Overview</h3>
              <div className="flex items-center gap-4 w-full border-b border-slate-100 pb-6 mb-6">
                 <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 font-black text-2xl flex items-center justify-center border border-indigo-100">
                   {name.charAt(0).toUpperCase()}
                 </div>
                 <div>
                   <h4 className="font-black text-slate-800 text-lg">{name}</h4>
                   <span className="text-emerald-500 text-sm font-bold flex items-center gap-1">
                     <CheckCircle2 size={14} /> Profile {Math.round((userInfo?.skills?.length || 1) / (roadmapItems.length + (userInfo?.skills?.length || 0)) * 100)}%
                   </span>
                 </div>
              </div>
              
              <div className="w-full mb-6">
                <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-3">Current Skills</p>
                <div className="flex flex-wrap gap-2">
                   {userInfo?.skills?.map(s => (
                     <span key={s} className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600">{s}</span>
                   )) || <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600">Python</span>}
                </div>
              </div>

              <div className="w-full">
                <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-3">Interests</p>
                <div className="flex flex-wrap gap-2">
                   {userInfo?.interests?.map(i => (
                     <span key={i} className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600">{i}</span>
                   )) || <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600">ML</span>}
                </div>
              </div>
           </div>

           {/* Suggested Projects */}
           <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-black text-slate-800 mb-6">Suggested Projects</h3>
              <div className="space-y-4">
                 <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-indigo-500/30 hover:shadow-md transition-all cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <LayoutDashboard size={20} />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">Build a Portfolio Website</h4>
                 </div>
                 <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-emerald-500/30 hover:shadow-md transition-all cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Bot size={20} />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">Simple Pricing Predictor</h4>
                 </div>
              </div>
           </div>
        </div>

      </main>
      )}
    </div>
  );
}
