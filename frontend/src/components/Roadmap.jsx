import React, { useState, useRef, useEffect } from 'react';
import { Trophy, Coins, Swords, LogOut, Compass, Sparkles, Play, CheckCircle } from 'lucide-react';
import QuestMap from './QuestMap';
import SkillModal from './SkillModal';
import MilestoneModal from './MilestoneModal';
import CoinReward from './CoinReward';
import Sidebar from './Sidebar';
import { apiCall } from '../api';

export default function Roadmap({ data = {}, userInfo = {}, theme, onToggleTheme, onSimulate, onToggleConcise, onMarkComplete, selectedSkill, setSelectedSkill, activeMilestone, setActiveMilestone, reachedMilestones, setReachedMilestones, onNavigateDashboard, onNavigateRecommendations, onNavigateProfile }) {
  const { 
    roadmap = [], 
    missing_skills = [], 
    readiness_score = 0, 
    skill_ranking = {},
    advanced_offers = [],
    roadmap_levels = {},
    explanations = {},
    recommendations = {}
  } = data || {};

  const [activeLesson, setActiveLesson] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // AI Quest Quiz State
  const [quizData, setQuizData] = useState([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  const [coins, setCoins] = useState(0);
  const [coinFlash, setCoinFlash] = useState(false);
  const [rewardKey, setRewardKey] = useState(0);
  const [rewardAmount, setRewardAmount] = useState(50);
  
  // Sidebar State
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState('roadmap');

  useEffect(() => {
    if (activeSidebarTab === 'dashboard' && onNavigateDashboard) {
       onNavigateDashboard();
       setActiveSidebarTab('roadmap');
    } else if (activeSidebarTab === 'recommendation' && onNavigateRecommendations) {
       onNavigateRecommendations();
       setActiveSidebarTab('roadmap');
    } else if (activeSidebarTab === 'profile' && onNavigateProfile) {
       onNavigateProfile();
       setActiveSidebarTab('roadmap');
    }
  }, [activeSidebarTab, onNavigateDashboard, onNavigateRecommendations, onNavigateProfile]);

  const fetchQuiz = async (skill) => {
    setQuizLoading(true);
    setQuizData([]);
    setSelectedAnswers({});
    setQuizScore(null);
    setIsQuizSubmitted(false);
    try {
        const d = await apiCall("/api/quest/quiz", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ skill })
        });
        setQuizData(d.quiz || []);
    } catch (e) {
        console.error("Failed to fetch quiz", e);
    }
    setQuizLoading(false);
  };

  const awardNodeCoins = (amount) => {
    setCoins(c => c + amount);
    setCoinFlash(true);
    setRewardAmount(amount);
    setRewardKey(k => k + 1);
    setTimeout(() => setCoinFlash(false), 700);
  };

  const handleNodeComplete = (skill) => {
    awardNodeCoins(100);
    onMarkComplete(skill);
    setIsChatOpen(false);
  };

  React.useEffect(() => {
    if (!roadmap || roadmap.length === 0) return;

    const statusMap = getStatusMap();
    const checkTier = (tierName) => {
        const tierSkills = roadmap.filter(s => skill_ranking[s]?.level === tierName);
        if (tierSkills.length === 0) return false;
        return tierSkills.every(s => statusMap[s] === "Completed");
    };

    if (checkTier("Basic") && !reachedMilestones.includes("Basic")) {
        setReachedMilestones(prev => [...prev, "Basic"]);
        if (data.milestones?.["Basic"]) setActiveMilestone(data.milestones["Basic"]);
    }

    if (checkTier("Intermediate") && !reachedMilestones.includes("Intermediate")) {
        setReachedMilestones(prev => [...prev, "Intermediate"]);
        if (data.milestones?.["Intermediate"]) setActiveMilestone(data.milestones["Intermediate"]);
    }
  }, [data, missing_skills]);

  const getStatusMap = () => {
    const status = {};
    let firstMissingFound = false;
    roadmap.forEach((skill) => {
      if (!missing_skills || !Array.isArray(missing_skills)) {
         status[skill] = "Locked";
         return;
      }
      const isMissing = missing_skills.includes(skill);
      if (!isMissing) {
        status[skill] = "Completed";
      } else if (!firstMissingFound) {
        status[skill] = "Unlocked";
        firstMissingFound = true;
      } else {
        status[skill] = "Locked";
      }
    });
    return status;
  };

  const statusInfo = getStatusMap();
  const basicSkills = roadmap.filter(s => skill_ranking[s]?.level === "Basic");
  const intermediateSkills = roadmap.filter(s => skill_ranking[s]?.level === "Intermediate");
  const allCompleted = (skills) => skills && skills.length > 0 && skills.every(s => statusInfo[s] === "Completed");
  
  const isForgeUnlocked = allCompleted(basicSkills);
  const isExpertUnlocked = isForgeUnlocked && allCompleted(intermediateSkills);
  
  let currentPhaseTitle = "Foundation Level";
  let phaseColor = "text-indigo-400 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10";
  if (isExpertUnlocked) {
      currentPhaseTitle = "Expert Level";
      phaseColor = "text-emerald-500 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10";
  } else if (isForgeUnlocked) {
      currentPhaseTitle = "Intermediate Level";
      phaseColor = "text-amber-500 dark:text-amber-400 border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10";
  }

  return (
    <div className="fixed inset-0 bg-slate-50 dark:bg-[#020203] flex flex-col overflow-hidden select-none transition-colors duration-500 before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] before:from-white before:via-slate-50 before:to-slate-100 before:opacity-100 dark:before:opacity-0 before:transition-opacity before:duration-500">
      
      <Sidebar 
        isExpanded={isSidebarExpanded} 
        setIsExpanded={setIsSidebarExpanded} 
        activeTab={activeSidebarTab} 
        setActiveTab={setActiveSidebarTab} 
      />

      <header className={`absolute top-8 left-8 right-8 z-[200] flex items-start justify-between pointer-events-none transition-all duration-500 ${isSidebarExpanded ? 'ml-[220px]' : 'ml-[80px]'}`}>
        <div className="flex items-start gap-6 pointer-events-auto backdrop-blur-md bg-white/30 dark:bg-black/30 p-4 pl-6 pr-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-xl shadow-black/5">
           <div className="w-16 h-16 rounded-2xl bg-indigo-600 dark:bg-slate-900 border border-indigo-400 dark:border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <Swords className="text-white dark:text-indigo-400" size={32} />
           </div>
           <div>
             <div className="flex items-center gap-3">
               <h1 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{userInfo?.career_goal || "Data Engineer"}</h1>
               <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${phaseColor}`}>
                 {currentPhaseTitle}
               </div>
             </div>
             <div className="flex items-center gap-4 mt-3">
               <div className="h-2 w-64 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden border border-slate-300 dark:border-white/5 shadow-inner">
                  <div className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 shadow-[0_0_20px_#6366f1]" style={{ width: `${readiness_score}%` }}></div>
               </div>
               <span className="text-[10px] font-black text-indigo-500 dark:text-indigo-400/60 tracking-widest">{Math.floor(readiness_score)}% READINESS</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 pointer-events-auto">
          <button onClick={onToggleTheme} className="p-5 rounded-full bg-white/60 dark:bg-white/5 border border-white dark:border-white/10 text-slate-500 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:border-indigo-500/30 dark:hover:bg-white/5 shadow-sm dark:shadow-none transition-all active:scale-90 flex items-center justify-center backdrop-blur-xl">
            {theme === 'dark' ? <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>}
          </button>

          <div className="flex items-center gap-4 border border-white/10 dark:border-white/5 bg-white/20 dark:bg-white/5 backdrop-blur-xl rounded-2xl px-6 py-2.5 shadow-inner">
             <div className="flex items-center gap-2 text-amber-500">
               <Coins size={18} className="drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
               <span
                 className={`font-black text-lg transition-all duration-300 ${coinFlash ? 'text-amber-300 scale-125 drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]' : 'text-amber-500'}`}
                 style={{ display: 'inline-block', transform: coinFlash ? 'scale(1.25)' : 'scale(1)', transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}
               >{coins}</span>
             </div>
             <div className="w-[1px] h-6 bg-slate-300 dark:bg-white/10"></div>
             <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400">
               <Trophy size={18} />
               <span className="font-black text-lg text-slate-800 dark:text-white">2</span>
             </div>
          </div>
          
          <button onClick={onToggleConcise} className={`p-5 rounded-full border transition-all active:scale-90 flex items-center gap-3 px-8 shadow-sm dark:shadow-none backdrop-blur-xl ${userInfo.concise ? 'bg-indigo-500 border-indigo-400 text-white shadow-[0_5px_20px_rgba(99,102,241,0.3)]' : 'bg-white/60 dark:bg-white/5 border-white dark:border-white/10 text-slate-500 dark:text-gray-500 hover:text-slate-800 dark:hover:text-white hover:bg-white dark:hover:bg-white/5'}`}>
            <Compass size={22} className={userInfo.concise ? 'animate-pulse' : ''} />
            <span className="text-xs font-black uppercase tracking-widest">{userInfo.concise ? 'Concise Mode: ON' : 'Concise Mode: OFF'}</span>
          </button>

          <button onClick={() => window.location.reload()} className="p-5 rounded-full bg-white/60 dark:bg-white/5 border border-white dark:border-white/10 text-slate-500 dark:text-gray-500 hover:text-slate-800 dark:hover:text-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:bg-white dark:hover:bg-white/5 shadow-sm dark:shadow-none transition-all active:scale-90 backdrop-blur-xl">
            <LogOut size={22} />
          </button>
        </div>
      </header>

      <div className={`fixed top-0 right-0 h-full w-[450px] bg-white/90 dark:bg-[#020203] border-l border-slate-200 dark:border-white/5 shadow-2xl transition-transform duration-500 ease-in-out z-[999] flex flex-col backdrop-blur-3xl ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="p-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-white/5 backdrop-blur-md">
            <div>
              <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mb-1">AI Boss Quest</p>
              <h2 className="font-black text-2xl text-slate-800 dark:text-white capitalize">{activeLesson}</h2>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 transition-colors">
              <LogOut size={20} />
            </button>
         </div>

         <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative">
             {quizLoading ? (
                 <div className="flex flex-col items-center justify-center h-full text-indigo-500 space-y-4">
                    <Sparkles size={40} className="animate-spin" />
                    <p className="font-black text-sm uppercase tracking-widest">Generating Trial...</p>
                 </div>
             ) : (
                 quizData.length > 0 && (
                     <div className="space-y-8 pb-10">
                        {quizData.map((q, qIdx) => (
                           <div key={qIdx} className="space-y-3">
                              <h3 className="font-bold text-sm text-slate-800 dark:text-gray-200 leading-snug"><span className="text-indigo-500 font-black">{qIdx + 1}.</span> {q.q}</h3>
                              <div className="space-y-2">
                                 {q.options.map((opt, oIdx) => {
                                    const isSelected = selectedAnswers[qIdx] === oIdx;
                                    const isCorrect = q.ans === oIdx;
                                    const showCorrect = isQuizSubmitted && isCorrect;
                                    const showWrong = isQuizSubmitted && isSelected && !isCorrect;

                                    let bgClass = "bg-white dark:bg-slate-800/50 border-slate-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-500";
                                    if (showCorrect) bgClass = "bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-500/20 dark:border-emerald-500 dark:text-emerald-300 font-bold";
                                    else if (showWrong) bgClass = "bg-red-50 border-red-500 text-red-800 dark:bg-red-500/20 dark:border-red-500 dark:text-red-300 font-bold";
                                    else if (isSelected) bgClass = "bg-indigo-50 border-indigo-500 text-indigo-800 dark:bg-indigo-500/20 dark:border-indigo-500 dark:text-indigo-300 font-bold";
                                    else bgClass += " text-slate-600 dark:text-gray-300";

                                    return (
                                       <button 
                                         key={oIdx}
                                         disabled={isQuizSubmitted}
                                         onClick={() => setSelectedAnswers(prev => ({...prev, [qIdx]: oIdx}))}
                                         className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${bgClass}`}
                                       >
                                          {opt}
                                       </button>
                                    );
                                 })}
                              </div>
                              {isQuizSubmitted && (
                                 <div className={`mt-3 p-3 text-xs font-bold rounded-xl border ${selectedAnswers[qIdx] === q.ans ? "bg-emerald-50/50 border-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400" : "bg-amber-50/50 border-amber-100 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400"}`}>
                                    {q.exp}
                                 </div>
                              )}
                           </div>
                        ))}

                        {!isQuizSubmitted ? (
                           <button 
                             onClick={() => {
                                let score = 0;
                                quizData.forEach((q, idx) => { if (selectedAnswers[idx] === q.ans) score++; });
                                setQuizScore(score);
                                setIsQuizSubmitted(true);
                             }}
                             disabled={Object.keys(selectedAnswers).length < quizData.length}
                             className="w-full py-4 mt-8 rounded-xl bg-indigo-600 font-black text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest shadow-lg shadow-indigo-500/20 transition-all"
                           >
                              Submit Answers
                           </button>
                        ) : (
                           <div className="space-y-4 pt-6 mt-6 border-t border-slate-200 dark:border-white/10">
                              <div className="text-center">
                                 <h3 className="text-4xl font-black text-slate-800 dark:text-white">{quizScore} <span className="text-lg text-slate-400">/ {quizData.length}</span></h3>
                                 <p className="text-xs font-black uppercase tracking-widest mt-1 text-indigo-500">{quizScore >= 4 ? "Quest Passed!" : "Quest Failed. Try Again."}</p>
                              </div>

                              {quizScore >= 4 ? (
                                 <button onClick={() => handleNodeComplete(activeLesson)} className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-pulse transition-all hover:scale-105">
                                    CLAIM REWARDS & COMPLETE QUEST
                                 </button>
                              ) : (
                                 <button onClick={() => fetchQuiz(activeLesson)} className="w-full py-4 bg-slate-800 dark:bg-white/10 hover:bg-slate-700 dark:hover:bg-white/20 text-white font-black rounded-2xl uppercase tracking-widest transition-all">
                                    Retake Quest
                                 </button>
                              )}
                           </div>
                        )}
                     </div>
                 )
             )}
         </div>
      </div>

      <main>
        <QuestMap 
          roadmap={roadmap} 
          status={statusInfo} 
          skillRanking={skill_ranking}
          onNodeClick={(skill) => {
            setSelectedSkill(skill);
            setActiveLesson(skill);
            setIsChatOpen(false); 
          }} 
          onMarkComplete={handleNodeComplete}
          advancedOffers={advanced_offers}
          roadmapLevels={roadmap_levels}
          questProgress={{}}
        />
      </main>

      {selectedSkill && (
         <SkillModal 
            skill={selectedSkill}
            explanation={explanations[selectedSkill] || { description: "Explore this skill to grow your career.", prerequisites: "N/A" }}
            recommendations={recommendations[selectedSkill] || { courses: [] }}
            status={getStatusMap()[selectedSkill]}
            onClose={() => setSelectedSkill(null)}
            onMarkComplete={(skill) => {
              // Not used directly from modal anymore but kept prop for internal uses if any
              handleNodeComplete(skill);
              setSelectedSkill(null);
            }}
            onOpenQuest={() => {
              setActiveLesson(selectedSkill);
              setIsChatOpen(true);
              fetchQuiz(selectedSkill);
            }}
         />
      )}

      {activeMilestone && (
         <MilestoneModal 
            milestone={activeMilestone} 
            onClose={() => setActiveMilestone(null)} 
         />
      )}

      <CoinReward
        key={rewardKey}
        trigger={rewardKey > 0}
        amount={rewardAmount}
        onComplete={() => {}}
      />

      <footer className={`absolute bottom-12 left-1/2 -translate-x-1/2 z-[200] pointer-events-none transition-all duration-500 ${isSidebarExpanded ? 'ml-[110px]' : 'ml-[40px]'}`}>
         <div className="flex items-center gap-8 px-10 py-4 rounded-full bg-white/60 dark:bg-black/40 border border-white dark:border-white/5 backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-2xl">
            <div className="flex items-center gap-3 text-slate-500 dark:text-white/40 text-[10px] font-black uppercase tracking-[0.6em]">
               <Compass size={14} className="animate-spin-slow text-indigo-400" />
               <span>Explore the World Map</span>
            </div>
         </div>
      </footer>
    </div>
  );
}
