import React, { useState, useRef } from 'react';
import { Trophy, Coins, Swords, LogOut, Compass, Sparkles, Play, CheckCircle } from 'lucide-react';
import QuestMap from './QuestMap';
import SkillModal from './SkillModal';
import MilestoneModal from './MilestoneModal';
import CoinReward from './CoinReward';
import Sidebar from './Sidebar';

export default function Dashboard({ data = {}, userInfo = {}, theme, onToggleTheme, onSimulate, onToggleConcise, onMarkComplete, selectedSkill, setSelectedSkill, activeMilestone, setActiveMilestone, reachedMilestones, setReachedMilestones }) {
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

  const [engineData, setEngineData] = useState(data);
  const [activeLesson, setActiveLesson] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [coins, setCoins] = useState(0);
  const [coinFlash, setCoinFlash] = useState(false);
  // Counter-based trigger: incrementing it ALWAYS fires CoinReward, even if called rapidly
  const [rewardKey, setRewardKey] = useState(0);
  const [rewardAmount, setRewardAmount] = useState(50);
  const [questProgress, setQuestProgress] = useState({});
  const [activeTab, setActiveTab] = useState('objectives');
  
  // Sidebar State
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState('dashboard');

  const chatEndRef = useRef(null);

  const handleSendMessage = async (text = chatInput) => {
    if (!text.trim()) return;
    setChatInput("");
    setChatMessages(prev => [...prev, { role: 'user', content: text, id: activeLesson }]);
    setIsSending(true);
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'ai', content: `That sounds great! Keep pushing forward on ${activeLesson}.`, id: activeLesson }]);
      setIsSending(false);
    }, 1000);
  };

  // Award coins + flash HUD + fire explosion animation for a node
  const awardNodeCoins = (amount) => {
    setCoins(c => c + amount);
    setCoinFlash(true);
    setRewardAmount(amount);
    setRewardKey(k => k + 1); // always unique → CoinReward always fires
    setTimeout(() => setCoinFlash(false), 700);
  };

  const handleQuestAction = (id, title, reward) => {
    // No per-task coins — only log progress and switch to chat
    setQuestProgress(prev => ({...prev, [activeLesson]: {...prev[activeLesson], [id]: true}}));
    setActiveTab('chat');

    let aiResponse = `I'm tracking your progress on ${title}.`;
    let links = [];

    if (id === 'overview') {
        const paragraph = engineData.explanations?.[activeLesson]?.paragraph;
        aiResponse = paragraph || `Here is a high-level overview of ${activeLesson}. It is an essential skill for your career.`;
    } else if (id === 'video') {
        aiResponse = `Here are the best curated video tutorials for ${activeLesson}:`;
        const courses = engineData.recommendations?.[activeLesson]?.courses || [];
        links = courses.filter(c => c.type === 'video').map(c => c.url.replace('/embed/', '/watch?v='));
    } else if (id === 'docs') {
        aiResponse = `Here is the official GeeksforGeeks and written documentation for ${activeLesson}:`;
        const gfg = engineData.explanations?.[activeLesson]?.gfg_link;
        if (gfg) links.push(gfg);
    } else if (id === 'quiz') {
        aiResponse = `ðŸŽ¯ Boss Fight! Answer this: What is the primary use-case of ${activeLesson} in a production environment?`;
    }

    setChatMessages(prev => [
       ...prev, 
       { role: 'user', content: `Starting Quest Task: ${title}`, id: activeLesson },
       { role: 'ai', content: aiResponse, links: links, id: activeLesson }
    ]);
  };

  // Called by the "CLAIM REWARDS" button after all 4 quest tasks are done
  const handleNodeComplete = (skill) => {
    awardNodeCoins(100);
    onMarkComplete(skill);
    setIsChatOpen(false);
  };

  // Called by SkillModal "Mark as Completed" button
  const handleSkillMarked = (skill) => {
    awardNodeCoins(50);
    onMarkComplete(skill);
  };

  // Milestone Detection Logic — fires popup when Basic/Intermediate tier is fully completed
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
      
      {/* Sidebar Navigation */}
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

      <div className={`fixed top-0 right-0 h-full w-[400px] bg-white/90 dark:bg-[#020203] border-l border-slate-200 dark:border-white/5 shadow-2xl transition-transform duration-500 ease-in-out z-[999] flex flex-col backdrop-blur-3xl ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="p-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-white/5 backdrop-blur-md">
            <div>
              <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mb-1">Active Quest</p>
              <h2 className="font-black text-2xl text-slate-800 dark:text-white capitalize">{activeLesson}</h2>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 transition-colors">
              <LogOut size={20} />
            </button>
         </div>

         <div className="flex border-b border-slate-200 dark:border-white/5 px-6 shrink-0">
            <button onClick={() => setActiveTab('objectives')} className={`py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-colors mr-6 ${activeTab === 'objectives' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300'}`}>Objectives</button>
            <button onClick={() => setActiveTab('chat')} className={`py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'chat' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300'}`}>AI Mentor</button>
         </div>

         {activeTab === 'objectives' && (
           <div className="flex-1 overflow-y-auto p-6 space-y-4">
             {(() => {
               const tasks = questProgress[activeLesson] || { overview: false, video: false, docs: false, quiz: false };
               const renderTask = (id, title, reward, actionLabel, icon, isCompleted) => (
                 <div className={`p-4 rounded-2xl border ${isCompleted ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10'} shadow-sm flex flex-col gap-3 transition-all`}>
                    <div className="flex items-start justify-between">
                       <div className="flex gap-3">
                          <div className={`mt-0.5 ${isCompleted ? 'text-emerald-500' : 'text-slate-400'}`}>{icon}</div>
                          <div>
                            <h4 className={`text-sm font-black ${isCompleted ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-white'}`}>{title}</h4>
                            <p className="text-amber-500 text-[10px] font-black tracking-widest mt-1">+{reward} COINS</p>
                          </div>
                       </div>
                       {isCompleted && <Sparkles size={16} className="text-emerald-400 animate-pulse" />}
                    </div>
                    {!isCompleted && (
                       <button onClick={() => handleQuestAction(id, title, reward)} className="w-full py-2 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 dark:hover:bg-indigo-500/30 transition-colors">
                          {actionLabel}
                       </button>
                    )}
                 </div>
               );
               const totalCompleted = Object.values(tasks).filter(Boolean).length;
               return (
                 <>
                   <div className="mb-6">
                      <div className="flex justify-between items-end mb-2">
                         <span className="text-xs font-black text-slate-800 dark:text-white uppercase">Overall Progress</span>
                         <span className="text-indigo-500 font-black text-lg">{totalCompleted * 25}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                         <div className="h-full bg-indigo-500 transition-all duration-700" style={{ width: `${totalCompleted * 25}%` }} />
                      </div>
                   </div>
                   {renderTask('overview', 'Read AI Concept Overview', 20, 'Request Overview', <Play size={18} />, tasks.overview)}
                   {renderTask('video', 'Watch a Video Tutorial', 30, 'Fetch Video', <Swords size={18} />, tasks.video)}
                   {renderTask('docs', 'Review GeeksForGeeks Concepts', 30, 'Fetch References', <CheckCircle size={18} />, tasks.docs)}
                   {renderTask('quiz', 'Defeat the 3-Question Trial', 100, 'Start Boss Quiz', <Sparkles size={18} />, tasks.quiz)}
                   {totalCompleted === 4 && (
                      <button onClick={() => handleNodeComplete(activeLesson)} className="mt-8 w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-pulse transition-all hover:scale-105">
                         CLAIM REWARDS & UNLOCK NEXT NODE
                      </button>
                   )}
                 </>
               )
             })()}
           </div>
         )}

         <div className={`flex-1 flex flex-col ${activeTab === 'chat' ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}>
           <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
              {chatMessages.map((msg, idx) => (
                 <div key={idx} className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                    <span className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-widest px-2">{msg.role === 'user' ? 'You' : 'AI Mentor'}</span>
                    <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-gray-300 border border-slate-200 dark:border-white/5'}`}>
                       {msg.content}
                       {msg.links && msg.links.length > 0 && (
                          <div className="mt-3 space-y-2">
                             {msg.links.map((link, j) => (
                               <a key={j} href={link} target="_blank" rel="noopener noreferrer" className="block px-3 py-2 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg text-indigo-500 hover:text-indigo-400 font-bold text-xs truncate transition-all hover:scale-[1.02] shadow-sm">
                                  🔗 {link.includes('youtube.com') ? 'YouTube Tutorial' : link.includes('geeksforgeeks') ? 'GeeksForGeeks Article' : 'Resource Link'}
                               </a>
                             ))}
                          </div>
                       )}
                    </div>
                 </div>
              ))}
             {isSending && <div className="flex flex-col mr-auto max-w-[80%] items-start animate-pulse"><div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-black">ANALYZING...</div></div>}
             <div ref={chatEndRef} />
           </div>
           <div className="p-4 bg-white/50 dark:bg-slate-900 border-t border-slate-200 dark:border-white/5 shrink-0">
             <div className="relative">
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Ask for more resources..." className="w-full bg-slate-100 dark:bg-[#050508] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-400" />
                <button onClick={() => handleSendMessage()} className="absolute right-2 top-2 p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"><Play size={16} className="ml-0.5" /></button>
             </div>
           </div>
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
            setIsChatOpen(false); // Close the side panel so the modal is the focus
            setActiveTab('objectives');
            if (!questProgress[skill]) setQuestProgress(prev => ({...prev, [skill]: { overview: false, video: false, docs: false, quiz: false }}));
          }} 
          onMarkComplete={handleNodeComplete}
          advancedOffers={advanced_offers}
          roadmapLevels={roadmap_levels}
          questProgress={questProgress}
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
              handleSkillMarked(skill);
              setSelectedSkill(null);
            }}
            onOpenQuest={() => {
              setActiveLesson(selectedSkill);
              setIsChatOpen(true);
              setActiveTab('objectives');
            }}
         />
      )}

      {/* Active Milestone Modal */}
      {activeMilestone && (
         <MilestoneModal 
            milestone={activeMilestone} 
            onClose={() => setActiveMilestone(null)} 
         />
      )}

      {/* Coin Reward Animation — fires every time rewardKey increments */}
      <CoinReward
        key={rewardKey}
        trigger={rewardKey > 0}
        amount={rewardAmount}
        onComplete={() => {}}
      />

      {/* OPTIMISTIC LOADING OVERLAY */}
      {data.isOptimistic && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[300] bg-white/80 dark:bg-black/80 backdrop-blur-3xl p-10 rounded-[3rem] border border-white dark:border-white/10 flex flex-col items-center gap-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_0_50px_rgba(99,102,241,0.2)]">
            <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter">Analyzing Potential...</h2>
              <p className="text-slate-500 dark:text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">The Intelligence Engine is mapping your path</p>
            </div>
        </div>
      )}
      
      {/* Lower HUD Navigation Overlay */}
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
