import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, CheckCircle2, XCircle, CalendarDays, Flame, ExternalLink, Zap } from 'lucide-react';
import { apiCall } from '../api';

export default function DailyCheckinTab({ userInfo, onAddStreakDate }) {
   const [news, setNews] = useState([]);
   const [trivia, setTrivia] = useState(null);
   const [loading, setLoading] = useState(true);
   const [currentIndex, setCurrentIndex] = useState(0);

   const [showTrivia, setShowTrivia] = useState(false);
   const [answerEval, setAnswerEval] = useState(null);
   
   const todayStr = new Date().toLocaleDateString('en-CA'); // e.g., '2026-03-31' in local timezone securely
   const userStreaks = userInfo?.streak_dates || [];
   const hasCheckedInToday = userStreaks.includes(todayStr);

   useEffect(() => {
      apiCall('/api/news/daily')
         .then(data => {
             setNews(data.news || []);
             setTrivia(data.trivia || null);
             setLoading(false);
         })
         .catch(err => {
             console.error(err);
             setLoading(false);
         });
   }, []);

   const handleNext = () => setCurrentIndex((prev) => (prev + 1) % news.length);
   const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);

   const handleAnswerTrivia = (val) => {
       if (!trivia) return;
       if (val === trivia.is_true) {
           setAnswerEval('correct');
           setTimeout(() => {
               onAddStreakDate(todayStr);
               setShowTrivia(false);
               setAnswerEval(null);
           }, 2500);
       } else {
           setAnswerEval('incorrect');
           setTimeout(() => setAnswerEval(null), 2500);
       }
   };

   // Render LeetCode-style Calendar using local timezone logic
   const renderCalendar = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
      
      const weeks = [];
      let currentWeek = [];
      
      // Empty slots before first day
      for (let i = 0; i < firstDay; i++) {
         currentWeek.push(<div key={`empty-${i}`} className="w-10 h-10" />);
      }
      
      // Fill days
      for (let day = 1; day <= daysInMonth; day++) {
         const localD = new Date(year, month, day);
         const dStr = localD.toLocaleDateString('en-CA');
         const isCompleted = userStreaks.includes(dStr);
         const isToday = dStr === todayStr;

         let cellClass = "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all relative ";
         
         if (isCompleted) {
            cellClass += "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-110 z-10 font-black";
         } else if (isToday) {
            cellClass += "border-2 border-indigo-500 text-indigo-600 bg-white dark:bg-slate-900";
         } else {
            cellClass += "text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5";
         }

         currentWeek.push(
            <div key={day} className="relative group">
                <div className={cellClass}>
                  {day}
                </div>
                {/* Tooltip */}
                <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none transition-opacity bg-slate-800 text-white text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-md whitespace-nowrap z-50">
                   {dStr} {isCompleted ? '✓ Done' : ''}
                </div>
            </div>
         );

         if (currentWeek.length === 7) {
            weeks.push(<div key={`w-${day}`} className="flex gap-2 mb-2 justify-between">{currentWeek}</div>);
            currentWeek = [];
         }
      }
      
      // Pad remaining empty if needed
      if (currentWeek.length > 0) {
         while (currentWeek.length < 7) {
            currentWeek.push(<div key={`empty-end-${currentWeek.length}`} className="w-10 h-10" />);
         }
         weeks.push(<div key={`w-end`} className="flex gap-2 mb-2 justify-between">{currentWeek}</div>);
      }

      return (
         <div className="bg-[#1e1e1e] rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden text-slate-100">
            {/* LeetCode matching aesthetic */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                   <CalendarDays size={20} className="text-emerald-500" />
                   {now.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex items-center gap-2 text-emerald-500 font-bold bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
                    <Flame size={16} />
                    <span>{userStreaks.length} Streak</span>
                </div>
            </div>

            <div className="flex justify-between mb-4 text-xs font-black uppercase text-slate-500 w-full px-1">
               {['S','M','T','W','T','F','S'].map((d, i) => <div key={i} className="w-10 text-center">{d}</div>)}
            </div>
            
            <div className="w-full">
               {weeks}
            </div>

            {!hasCheckedInToday && !showTrivia && (
               <div className="mt-8">
                  <button 
                     onClick={() => setShowTrivia(true)}
                     className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
                  >
                     <Zap size={18} /> Claim Today's Streak
                  </button>
               </div>
            )}
            {hasCheckedInToday && (
               <div className="mt-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <span className="text-emerald-400 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2">
                     <CheckCircle2 size={16} /> Daily Goal Met!
                  </span>
               </div>
            )}
         </div>
      );
   };

   return (
      <div className="w-full max-w-7xl mx-auto py-8 px-6 space-y-12 animate-in fade-in duration-500">
          
          {/* Prime Video Style Hero Slider */}
          <div className="relative w-full rounded-[2rem] overflow-hidden bg-black aspect-[21/9] max-h-[500px] shadow-2xl border border-white/10 group">
              {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
                  </div>
              ) : news.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center text-white/50 font-bold">No Tech News Feeds Found</div>
              ) : (
                  <>
                      {/* Video Player Background Frame */}
                      <iframe 
                         key={news[currentIndex].video_id}
                         src={`https://www.youtube.com/embed/${news[currentIndex].video_id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${news[currentIndex].video_id}`}
                         className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] pointer-events-none opacity-60 mix-blend-screen scale-105"
                         allow="autoplay; encrypted-media"
                         allowFullScreen
                      ></iframe>

                      {/* Prime/Netflix Grade Overlays for Text readability */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
                      
                      {/* Content Container */}
                      <div className="absolute top-0 left-0 bottom-0 w-full md:w-2/3 lg:w-1/2 p-12 flex flex-col justify-end z-10 pointer-events-auto">
                          <span className="px-3 py-1 rounded bg-indigo-600/80 text-white text-[10px] font-black uppercase tracking-widest w-fit mb-4 backdrop-blur-md shadow-lg border border-indigo-400/30">
                              Tech News Of The Day
                          </span>
                          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 drop-shadow-2xl line-clamp-3 overflow-hidden">
                              {news[currentIndex].title}
                          </h2>
                          <div className="flex items-center gap-4 text-sm font-bold text-gray-300 drop-shadow-md mb-8">
                              <span>Source: Google News</span>
                              <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                              <span>{news[currentIndex].pub_date?.split(' ')[1] + ' ' + news[currentIndex].pub_date?.split(' ')[2] + ' ' + news[currentIndex].pub_date?.split(' ')[3]}</span>
                          </div>
                          <div className="flex gap-4">
                              <a href={news[currentIndex].link} target="_blank" rel="noopener noreferrer" className="px-8 py-3.5 bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2 cursor-pointer shadow-xl">
                                  <Play size={16} className="fill-black" /> Read Story
                              </a>
                          </div>
                      </div>

                      {/* Navigation Arrows */}
                      <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/40 text-white hover:bg-black/60 hover:scale-110 active:scale-90 transition-all z-20 opacity-0 group-hover:opacity-100 backdrop-blur-md border border-white/10">
                          <ChevronLeft size={32} />
                      </button>
                      <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/40 text-white hover:bg-black/60 hover:scale-110 active:scale-90 transition-all z-20 opacity-0 group-hover:opacity-100 backdrop-blur-md border border-white/10">
                          <ChevronRight size={32} />
                      </button>
                      
                      {/* Progress Dots */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
                          {news.map((_, i) => (
                              <button 
                                key={i} 
                                onClick={() => setCurrentIndex(i)}
                                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${i === currentIndex ? 'bg-white w-8 shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'bg-white/30 w-2 hover:bg-white/50'}`} 
                              />
                          ))}
                      </div>
                  </>
              )}
          </div>

          {/* Lower Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              {/* Box 1: Streak Calendar */}
              <div>
                  <h3 className="text-2xl font-black text-slate-800 mb-6">Daily Commitment</h3>
                  {renderCalendar()}
              </div>

              {/* Box 2: Trivia Modal logic (shown inline or as overlay) */}
              <div>
                 {showTrivia ? (
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_30px_60px_rgba(0,0,0,0.08)] animate-in slide-in-from-right-8 fade-in h-full flex flex-col justify-center relative overflow-hidden">
                        {/* Glows */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 blur-[50px] pointer-events-none"></div>
                        
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                               <Zap size={20} />
                            </div>
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Streak Challenge</h3>
                        </div>

                        {loading ? (
                           <div className="h-40 flex items-center justify-center">
                              <Sparkles className="animate-spin text-indigo-500" />
                           </div>
                        ) : (
                           <>
                             <div className="mb-8">
                                <h2 className="text-2xl font-black text-slate-800 leading-snug">
                                   {trivia?.question}
                                </h2>
                             </div>
                             
                             {answerEval === null ? (
                                <div className="grid grid-cols-2 gap-4">
                                   <button 
                                      onClick={() => handleAnswerTrivia(true)}
                                      className="py-5 bg-slate-50 border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 rounded-2xl text-slate-800 font-black text-lg transition-all"
                                   >
                                      True
                                   </button>
                                   <button 
                                      onClick={() => handleAnswerTrivia(false)}
                                      className="py-5 bg-slate-50 border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 rounded-2xl text-slate-800 font-black text-lg transition-all"
                                   >
                                      False
                                   </button>
                                </div>
                             ) : (
                                <div className={`p-6 rounded-2xl border-2 animate-in zoom-in-95 duration-200 ${answerEval === 'correct' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-red-50 border-red-500 text-red-800'}`}>
                                   <h4 className="font-black flex items-center gap-2 text-xl mb-2">
                                      {answerEval === 'correct' ? <><CheckCircle2 size={24}/> Correct! You nailed it.</> : <><XCircle size={24}/> Not quite right!</>}
                                   </h4>
                                   <p className="font-bold text-sm opacity-80">{trivia?.explanation}</p>
                                </div>
                             )}
                           </>
                        )}
                    </div>
                 ) : (
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 flex flex-col items-center justify-center h-[380px] text-center border-dashed">
                       <h3 className="text-xl font-black text-slate-800 mb-2">Engage with Tech Daily</h3>
                       <p className="text-slate-500 font-medium text-sm max-w-sm">
                          Keep your skills sharp and your streak burning. Check in every day, answer a trivia question based on today's tech news, and see your LeetCode-style profile bloom!
                       </p>
                    </div>
                 )}
              </div>

          </div>
      </div>
   );
}
