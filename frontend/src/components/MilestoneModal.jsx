import React, { useEffect, useState } from 'react';
import { Trophy, Star, ArrowRight, X, Gem, Flame, Sparkles } from 'lucide-react';

const MilestoneModal = ({ milestone, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!milestone) return null;

  const isBasic = milestone.icon === 'gem';

  return (
    <div className={`fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/80 dark:bg-black/80 light:bg-slate-900/60 backdrop-blur-xl transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`relative max-w-lg w-full p-12 rounded-[3.5rem] hud-panel border-2 overflow-hidden transition-all duration-1000 transform ${isVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-12'} ${isBasic ? 'border-indigo-500/30' : 'border-amber-500/30'}`}>
        
        {/* Animated Background Elements */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${isBasic ? 'from-indigo-500 to-transparent' : 'from-amber-500 to-transparent'} animate-shimmer`}></div>
        
        <div className="absolute -top-24 -right-24 opacity-10 blur-3xl">
            {isBasic ? <div className="w-64 h-64 bg-indigo-500 rounded-full"></div> : <div className="w-64 h-64 bg-amber-500 rounded-full"></div>}
        </div>

        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 rounded-full bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10 text-gray-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 transition-all z-20"
        >
          <X size={20} />
        </button>

        <div className="relative z-10 text-center">
          <div className={`inline-flex p-6 rounded-[2rem] mb-10 ${isBasic ? 'bg-indigo-500/20 text-indigo-400' : 'bg-amber-500/20 text-amber-400'} shadow-2xl animate-float`}>
            {isBasic ? <Gem size={64} strokeWidth={1.5} /> : <Flame size={64} strokeWidth={1.5} />}
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
             <Star className="text-amber-400 animate-pulse" size={16} fill="currentColor" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 dark:text-white/40 light:text-slate-500">Milestone Reached</span>
             <Star className="text-amber-400 animate-pulse" size={16} fill="currentColor" />
          </div>

          <h2 className="text-5xl font-black text-white dark:text-white light:text-slate-900 tracking-tighter uppercase italic leading-[0.9] mb-6 drop-shadow-2xl">
            {milestone.title}
          </h2>

          <p className="text-gray-400 dark:text-gray-400 light:text-slate-500 font-bold text-lg mb-10 leading-relaxed px-4">
            {milestone.description}
          </p>

          <div className="p-8 rounded-3xl bg-white/5 dark:bg-white/5 light:bg-slate-100/50 border border-white/5 dark:border-white/5 light:border-black/5 mb-10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="text-[10px] uppercase font-black tracking-widest text-emerald-400 mb-2 flex items-center justify-center gap-2">
               <Trophy size={14} /> Reward Unlocked
            </div>
            <div className="text-2xl font-black text-white dark:text-white light:text-slate-900 italic tracking-tight">{milestone.reward}</div>
          </div>

          <button 
            onClick={onClose}
            className={`group w-full py-6 rounded-2xl flex items-center justify-center gap-4 text-sm font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 ${isBasic ? 'bg-indigo-500 hover:bg-indigo-400 text-white' : 'bg-amber-500 hover:bg-amber-400 text-black'}`}
          >
            Advance to {milestone.next_tier}
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
           <Sparkles className="absolute top-1/4 left-1/4 text-white/10 dark:text-white/10 light:text-slate-300/30 animate-pulse" size={40} />
           <Sparkles className="absolute bottom-1/4 right-1/4 text-white/10 dark:text-white/10 light:text-slate-300/30 animate-pulse delay-700" size={30} />
        </div>
      </div>
    </div>
  );
};

export default MilestoneModal;
