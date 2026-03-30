import React from 'react';
import { X, BookOpen, Target, ArrowRight, Zap, ExternalLink } from 'lucide-react';

const SkillModal = ({ skill, explanation, recommendations, onClose, onMarkComplete, onOpenQuest, status }) => {
  const [activeVideo, setActiveVideo] = React.useState(null);
  if (!skill) return null;

  const isUnlocked = status === "Unlocked";
  const isCompleted = status === "Completed";

  return (
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center p-6 backdrop-blur-md bg-black/60 dark:bg-black/60 light:bg-slate-900/40" 
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-[#0a0a0c] dark:bg-[#0a0a0c] light:bg-[#f8fafc] border border-white/10 dark:border-white/10 light:border-black/5 rounded-[3rem] shadow-2xl overflow-hidden transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/20 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none" />

        {/* Header */}
        <div className="relative px-10 pt-10 pb-6 border-b border-white/5 dark:border-white/5 light:border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Zap size={24} />
             </div>
             <div>
                <h2 className="text-3xl font-black text-white dark:text-white light:text-slate-900 uppercase italic tracking-tighter">{skill}</h2>
                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em] mt-1">
                   {explanation.prerequisites}
                </p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 rounded-full bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10 text-gray-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 transition-all font-black"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-10 py-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          
          {activeVideo ? (
            <div className="space-y-4 animate-in fade-in zoom-in duration-300">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 dark:text-gray-500 light:text-slate-400 uppercase tracking-widest">
                    <BookOpen size={14} /> Video Tutorial
                  </div>
                  <button 
                    onClick={() => setActiveVideo(null)}
                    className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300"
                  >
                    ← Back to Details
                  </button>
               </div>
               <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 dark:border-white/10 light:border-black/5 shadow-2xl bg-black">
                  <iframe 
                    key={activeVideo}
                    src={`${activeVideo}?origin=${window.location.origin}`}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  ></iframe>
               </div>
            </div>
          ) : (
            <>
              {/* Definition — always visible */}
              <div className="space-y-3">
                 <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 dark:text-gray-500 light:text-slate-400 uppercase tracking-widest">
                   <Target size={14} /> What is {skill}?
                 </div>
                 {/* Short tagline */}
                 <p className="text-white dark:text-white light:text-slate-800 text-base font-bold leading-snug">
                   {explanation.description}
                 </p>
                 {/* Full definition paragraph */}
                 {explanation.paragraph && (
                   <p className="text-gray-400 dark:text-gray-400 light:text-slate-500 text-sm leading-relaxed">
                     {explanation.paragraph}
                   </p>
                 )}
              </div>

              {/* GeeksForGeeks Link */}
              {explanation.gfg_link && (
                <a 
                  href={explanation.gfg_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-green-500/5 border border-green-500/20 hover:border-green-500/50 hover:bg-green-500/10 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 font-black text-sm">G</div>
                    <div>
                      <p className="text-green-400 font-black text-sm">GeeksForGeeks</p>
                      <p className="text-green-400/50 text-[10px] font-bold uppercase tracking-widest">Free Tutorial & Practice Problems</p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-green-400 group-hover:translate-x-1 transition-transform" />
                </a>
              )}

              {/* Recommended Courses */}
              {recommendations?.courses?.length > 0 && (
                <div className="space-y-3">
                   <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 dark:text-gray-500 light:text-slate-400 uppercase tracking-widest">
                      <BookOpen size={14} /> Recommended Training
                   </div>
                   <div className="grid grid-cols-1 gap-2">
                      {recommendations.courses.map((course, i) => {
                        const isObject = typeof course === 'object' && course !== null;
                        const isVideo = isObject && course.type === 'video';
                        const name = isObject ? (course.name || "Course") : course;
                        
                        return (
                          <div 
                            key={i} 
                            className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-slate-100/50 border border-white/5 dark:border-white/5 light:border-black/5 hover:border-indigo-500/30 transition-all cursor-pointer"
                            onClick={() => {
                              if (isVideo) setActiveVideo(course.url);
                              else if (isObject && course.url) window.open(course.url, "_blank");
                            }}
                          >
                             <span className="text-sm text-gray-300 dark:text-gray-300 light:text-slate-700 font-bold">{name}</span>
                             <div className="flex items-center gap-2">
                               {isVideo && <span className="text-[8px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">YouTube</span>}
                               <ArrowRight size={16} className="text-gray-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                             </div>
                          </div>
                        );
                      })}
                   </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Action */}
        <div className="px-10 py-6 bg-white/[0.02] dark:bg-white/[0.02] light:bg-slate-100/50 border-t border-white/5 dark:border-white/5 light:border-black/5 flex flex-wrap items-center justify-between gap-4">
             <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">
                {isCompleted ? "✓ Goal Achieved" : isUnlocked ? "⚡ Unlocked & Ready" : "🔒 Target Locked"}
             </div>
             <div className="flex items-center gap-3">
                <button 
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl border border-white/10 dark:border-white/10 light:border-black/10 text-white dark:text-white light:text-slate-900 text-xs font-black uppercase tracking-widest hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5 transition-all"
                >
                  Close
                </button>
                {isUnlocked && onOpenQuest && (
                    <button 
                      onClick={() => {
                        onOpenQuest(skill);
                        onClose();
                      }}
                      className="px-6 py-3 rounded-xl border border-indigo-500/30 text-indigo-400 hover:text-white hover:bg-indigo-500/20 text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(99,102,241,0.1)] flex gap-2 items-center"
                    >
                      <Target size={16} /> Start AI Quest
                    </button>
                )}
                {isUnlocked && (
                  <button 
                    onClick={() => {
                      onMarkComplete(skill);
                      onClose();
                    }}
                    className="px-8 py-3 rounded-xl bg-emerald-500 text-black text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  >
                    Mark as Completed ✓
                  </button>
                )}
             </div>
        </div>
      </div>
    </div>
  );
};

export default SkillModal;
