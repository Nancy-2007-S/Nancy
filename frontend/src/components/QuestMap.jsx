import React, { useRef, useState, useCallback, useMemo } from 'react';
import { CheckCircle, Lock, Play, Sparkles, Coins, Briefcase, GraduationCap, Code2, Database, Terminal, Cpu, Layout, Globe, Server, Layers } from 'lucide-react';

// Floating + rotate keyframe via inline style injection
const FLOAT_STYLE = `
  @keyframes card-float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
  }
`;
if (typeof document !== 'undefined' && !document.getElementById('quest-float-style')) {
  const s = document.createElement('style');
  s.id = 'quest-float-style';
  s.textContent = FLOAT_STYLE;
  document.head.appendChild(s);
}

const QuestMap = ({ roadmap = [], status = {}, onNodeClick, onMarkComplete, skillRanking = {}, advancedOffers = [], roadmapLevels = {}, questProgress = {} }) => {
  const scrollRef = useRef(null);

  // Drag-to-pan state
  const isDragging = useRef(false);
  const hasDragged = useRef(false); // Ref for immediate check in handlers
  const dragStart = useRef({ x: 0, y: 0, scrollX: 0, scrollY: 0 });
  const [dragged, setDragged] = useState(false);       // track if a drag happened (to block click)
  const [isDraggingState, setIsDraggingState] = useState(false); // CSS class toggle to pause animations

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    hasDragged.current = false;
    setDragged(false);
    setIsDraggingState(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      scrollX: scrollRef.current.scrollLeft,
      scrollY: scrollRef.current.scrollTop,
    };
    scrollRef.current.style.cursor = 'grabbing';
  }, []);

  const rafId = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      setDragged(true);
      hasDragged.current = true;
    }
    // Directly set scroll — no rAF cancellation overhead, browser batches during rAF naturally
    if (rafId.current) return; // skip if a frame is already scheduled
    rafId.current = requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = dragStart.current.scrollX - dx;
        scrollRef.current.scrollTop  = dragStart.current.scrollY - dy;
      }
      rafId.current = null;
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    if (rafId.current) { cancelAnimationFrame(rafId.current); rafId.current = null; }
    setIsDraggingState(false);
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
  }, []);

  // Memoize expensive tier groupings
  const safeRoadmap = useMemo(() => roadmap || [], [roadmap]);
  const safeRanking = useMemo(() => skillRanking || {}, [skillRanking]);

  const basicSkills = useMemo(
    () => safeRoadmap.filter(s => safeRanking[s]?.level === 'Basic'),
    [safeRoadmap, safeRanking]
  );
  const intermediateSkills = useMemo(
    () => safeRoadmap.filter(s => safeRanking[s]?.level === 'Intermediate'),
    [safeRoadmap, safeRanking]
  );

  const allCompleted = useCallback(
    (skills) => skills && skills.length > 0 && skills.every(s => status[s] === 'Completed'),
    [status]
  );
  const isForgeUnlocked = allCompleted(basicSkills);
  const isApotheosisUnlocked = isForgeUnlocked && allCompleted(intermediateSkills);

  const cardSpacing = 500;
  const initialOffset = 220; // Shifted right to account for Sidebar

  const foundationsWidth = useMemo(
    () => Math.max(900, basicSkills.length * cardSpacing),
    [basicSkills.length]
  );
  const forgeWidth = useMemo(
    () => Math.max(900, intermediateSkills.length * cardSpacing),
    [intermediateSkills.length]
  );

  // A vibrant color palette for the cards
  const palettes = [
    { base: 'cyan-400', border: 'border-cyan-400', shadow: 'shadow-[0_0_35px_rgba(34,211,238,0.5)]', text: 'text-cyan-500', bg: 'bg-cyan-100 dark:bg-cyan-500/20', fill: 'bg-cyan-400' },
    { base: 'purple-500', border: 'border-purple-500', shadow: 'shadow-[0_0_35px_rgba(168,85,247,0.5)]', text: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-500/20', fill: 'bg-purple-500' },
    { base: 'pink-500', border: 'border-pink-500', shadow: 'shadow-[0_0_35px_rgba(236,72,153,0.5)]', text: 'text-pink-500', bg: 'bg-pink-100 dark:bg-pink-500/20', fill: 'bg-pink-500' },
    { base: 'amber-400', border: 'border-amber-400', shadow: 'shadow-[0_0_35px_rgba(251,191,36,0.5)]', text: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-500/20', fill: 'bg-amber-400' },
    { base: 'rose-500', border: 'border-rose-500', shadow: 'shadow-[0_0_35px_rgba(244,63,94,0.5)]', text: 'text-rose-500', bg: 'bg-rose-100 dark:bg-rose-500/20', fill: 'bg-rose-500' },
    { base: 'blue-500', border: 'border-blue-500', shadow: 'shadow-[0_0_35px_rgba(59,130,246,0.5)]', text: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-500/20', fill: 'bg-blue-500' }
  ];

  // Icons array for generic mapping
  const CardIcons = [Code2, Database, Terminal, Cpu, Layout, Globe, Server, Layers];

  // Find the exact next locked skill to highlight
  const nextSkillIndex = safeRoadmap.findIndex(s => status[s] === "Locked");
  const nextSkill = nextSkillIndex !== -1 ? safeRoadmap[nextSkillIndex] : null;

  // Render a node as a landmark on the map
  const renderLandmark = (skill, index, islandIdx) => {
    const isCompleted = status[skill] === "Completed";
    const isUnlocked = status[skill] === "Unlocked";
    const isNext = skill === nextSkill;
    const levelNum = roadmapLevels[skill] || (index + 1);
    
    const x = initialOffset + (index * cardSpacing); 
    const y = 280;

    const palette = isNext 
        ? { border: 'border-emerald-400', shadow: 'shadow-[0_0_40px_rgba(16,185,129,0.8)]', text: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-500/20', fill: 'bg-emerald-400' } 
        : palettes[index % palettes.length];
        
    const Icon = CardIcons[index % CardIcons.length];

    // Staggered float animation delay (pure CSS, no hooks needed)
    const floatDelay = `${(index * 0.35) % 1.5}s`;
    // Alternate rotation direction per card
    const rotateDir = index % 2 === 0 ? 'group-hover:rotate-2' : 'group-hover:-rotate-2';

    return (
      <div 
        key={skill}
        className={`absolute z-20 group`}
        style={{ left: x, top: y }}
      >
        <div
          style={{ animationDelay: floatDelay, willChange: 'transform' }}
          className={`
            relative w-[230px] rounded-3xl bg-white dark:bg-slate-900 overflow-hidden
            border-[4px] ${palette.border} ${palette.shadow}
            flex flex-col items-center py-8 px-5
            cursor-pointer
            card-float-anim
            transition-transform duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
            group-hover:-translate-y-4 group-hover:scale-[1.12] ${rotateDir}
            ${isCompleted ? 'card-completing' : ''}
          `}
        >
          {/* Completion Overlay */}
          {isCompleted && (
            <div className="absolute inset-0 z-30 bg-gradient-to-br from-emerald-400/30 to-transparent pointer-events-none rounded-3xl" />
          )}
          {/* Active Node Badge */}
          {isNext && (
            <div className="absolute -top-4 bg-emerald-400 text-white font-black text-[10px] uppercase tracking-widest px-4 py-1 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.6)] animate-pulse">
              Active Node
            </div>
          )}

          {/* Icon Badge — restored to original as per feedback */}
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-5 ${palette.bg} ${palette.text}`}>
             {isCompleted ? <CheckCircle size={38} /> : isUnlocked ? <Icon size={38} /> : <Lock size={38} />}
          </div>

          {/* Title & Level */}
          <h3 className="text-slate-800 dark:text-white font-black text-base text-center leading-tight mb-1 min-h-[3rem] flex items-center">{skill}</h3>
          
          <span className="text-slate-400 dark:text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-5">
            {isCompleted ? `✓ Level ${levelNum}` : isUnlocked ? `⚡ Level ${levelNum}` : '🔒 Locked'}
          </span>

          {/* Progress Bar Area */}
          <div className="w-full mt-auto">
            <div className="flex justify-between items-end mb-1">
               <span className="text-slate-400 dark:text-gray-500 font-bold text-[10px]">Modules<br/>Progress</span>
               <span className="text-slate-800 dark:text-white font-black text-xs">
                 {(() => {
                    if (isCompleted) return '100%';
                    if (!isUnlocked) return '0%';
                    const tasks = questProgress[skill] || {};
                    const totalCompleted = Object.values(tasks).filter(Boolean).length;
                    return `${totalCompleted * 25}%`;
                 })()}
               </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-300 dark:border-white/5">
               <div className={`h-full ${palette.fill} transition-all duration-700`} style={{ width: (() => {
                    if (isCompleted) return '100%';
                    if (!isUnlocked) return '0%';
                    const tasks = questProgress[skill] || {};
                    const totalCompleted = Object.values(tasks).filter(Boolean).length;
                    return `${totalCompleted * 25}%`;
                 })() }}></div>
            </div>
          </div>

          {/* Action Button */}
          {(isUnlocked || isNext) && (
             <button 
               onClick={(e) => { 
                 e.stopPropagation(); 
                 if (hasDragged.current) return;
                 onNodeClick(skill); 
               }}
               className={`mt-5 w-full py-2.5 font-black text-[10px] tracking-widest rounded-xl transition-all ${
                 isNext
                   ? 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                   : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-white/10 hover:border-indigo-400 hover:text-indigo-500'
               }`}
             >
               {isNext ? '▶ START LESSON' : '📖 OPEN NODE'}
             </button>
          )}

          {/* Invisible full-card click zone */}
          {status[skill] !== "Locked" && (
             <button 
               onClick={(e) => {
                 if (hasDragged.current) return;
                 onNodeClick(skill);
               }}
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-3xl z-10"
             />
          )}

        </div>
      </div>
    );
  };


  // Memoized path data for the triple-layer SVG trail
  const pathData = useMemo(() => {
    let d = 'M 120 440 L 200 440 '; // Shifted starting point to 120px
    const allSkills = [...basicSkills, ...intermediateSkills];
    allSkills.forEach((_, i) => {
      const islandIdx    = i < basicSkills.length ? 0 : 1;
      const localIdx     = i < basicSkills.length ? i : i - basicSkills.length;
      const globalOffset = islandIdx === 0 ? 0 : foundationsWidth;
      const xCenter      = globalOffset + initialOffset + localIdx * cardSpacing + 110;
      const y = 440;
      let prevXRight = 120;
      if (i > 0) {
        const pIsland = (i-1) < basicSkills.length ? 0 : 1;
        const pLocal  = (i-1) < basicSkills.length ? (i-1) : (i-1) - basicSkills.length;
        const pOff    = pIsland === 0 ? 0 : foundationsWidth;
        prevXRight    = pOff + initialOffset + pLocal * cardSpacing + 230;
      }
      const leftX = xCenter - 110;
      if (i === 0) {
        d += `L ${leftX} ${y} `;
      } else {
        const archY = i % 2 === 1 ? y - 180 : y + 180;
        const span  = leftX - prevXRight;
        d += `C ${prevXRight + span*0.4} ${archY}, ${leftX - span*0.4} ${archY}, ${leftX} ${y} `;
      }
      d += `L ${xCenter + 110} ${y} `;
    });
    return d;
  }, [basicSkills, intermediateSkills, foundationsWidth]);

  return (
    <div
      className={`world-viewport w-full${isDraggingState ? ' is-dragging' : ''}`}
      ref={scrollRef}
      style={{ cursor: 'grab', userSelect: 'none' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="relative flex min-w-max h-full">
        
        {/* Triple-Layer Animated Magic Path */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
          {/* Layer 1: thick glowing base */}
          <path d={pathData} fill="none" stroke="#1e3a8a" strokeWidth="28"
            strokeLinecap="round" strokeLinejoin="round"
            className="quest-path-base opacity-90 dark:opacity-80"
            style={{ willChange: 'filter' }}
          />
          {/* Layer 2: fast flowing dashes */}
          <path d={pathData} fill="none" stroke="#ffffff" strokeWidth="5"
            strokeLinecap="round" strokeLinejoin="round"
            className="quest-path-dashes opacity-90"
            style={{ willChange: 'stroke-dashoffset' }}
          />
          {/* Layer 3: slow reverse energy */}
          <path d={pathData} fill="none" stroke="#a5b4fc" strokeWidth="3"
            strokeLinecap="round" strokeLinejoin="round"
            className="quest-path-energy"
            style={{ willChange: 'stroke-dashoffset' }}
          />
        </svg>

        {/* Start Node */}
        <div className="absolute left-[120px] top-[400px] z-20 flex items-center gap-4">
           <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 border-4 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.6)] flex items-center justify-center font-black text-cyan-500 uppercase text-xs">
             START
           </div>
        </div>

        {/* 1. THE FOUNDATIONS ISLAND */}
        <section className="island-zone relative" style={{ width: `${foundationsWidth}px`, minWidth: 'auto' }}>
            <div className="island-backdrop island-foundations" />
            {basicSkills.map((s, i) => renderLandmark(s, i, 0))}
        </section>

        {/* 2. THE FORGE ISLAND */}
        <section className={`island-zone relative ${!isForgeUnlocked ? 'grayscale brightness-50' : ''}`} style={{ width: `${forgeWidth}px`, minWidth: 'auto' }}>
            <div className="island-backdrop island-forge" />
            {intermediateSkills.map((s, i) => renderLandmark(s, i, 1))}
        </section>

        {/* 3. THE APOTHEOSIS ISLAND */}
        <section className={`island-zone relative ${!isApotheosisUnlocked ? 'grayscale brightness-50' : ''}`}>
            <div className="island-backdrop island-apotheosis" />
            
            <div className="relative flex items-center justify-center gap-12 px-40">
                {advancedOffers && advancedOffers.map((offer, i) => (
                  <div key={i} className="group w-[350px] shrink-0 p-10 rounded-[3.5rem] bg-white/80 dark:bg-[var(--bg-panel)] backdrop-blur-3xl border border-white dark:border-white/10 hover:border-emerald-400 dark:hover:border-emerald-500/50 transition-all hover:-translate-y-6 hover:scale-105 cursor-pointer overflow-hidden relative shadow-[0_20px_50px_rgb(0,0,0,0.06)] dark:shadow-2xl">
                    <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-20 transition-opacity">
                      {offer.type === "Internship" ? <Briefcase size={200} /> : <GraduationCap size={200} />}
                    </div>
                    <div className="relative z-10">
                      <div className={`inline-flex px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 ${offer.type === 'Internship' ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'}`}>
                        {offer.type}
                      </div>
                      <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-2 leading-[0.9]">{offer.name}</h3>
                      <p className="text-slate-500 dark:text-gray-400 font-bold mb-8">{offer.company || offer.provider}</p>
                      
                      <button 
                        onClick={() => {
                          if (offer.url) window.open(offer.url, "_blank");
                          else alert("Bonus API Link coming soon!");
                        }}
                        className="w-full py-4 rounded-2xl bg-emerald-500 text-black font-black uppercase text-xs tracking-widest hover:bg-emerald-400 transition-colors"
                      >
                         Claim Reward
                      </button>
                    </div>
                  </div>
                ))}
            </div>
        </section>
        
        
        {/* Extra buffer for scroll */}
        <div className="w-[1200px] shrink-0"></div>
      </div>
    </div>
  );
};

export default QuestMap;
