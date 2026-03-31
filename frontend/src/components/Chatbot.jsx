import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { apiCall } from '../api';

export default function Chatbot({ userData, engineData, onSimulate, onSkipSkill }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([
    { sender: 'bot', text: `Greetings, Traveler! I am your AI Mentor for the ${userData?.career_goal || 'Current'} quest. How can I assist you?` }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const predefinedQueries = [
    { label: "What's my next step?", intent: "next_step" },
    { label: "Suggest new projects", intent: "projects" },
    { label: "Why learn this?", intent: "why" },
    { label: "Skip current target ->", intent: "skip", special: true }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleQuery = async (queryText, intent) => {
    setMessages(prev => [...prev, { sender: 'user', text: queryText }]);
    setIsTyping(true);

    if (intent === 'skip') {
       if (!engineData?.next_step) {
           setMessages(prev => [...prev, { sender: 'bot', text: "You have no active targets to skip right now!" }]);
           setIsTyping(false);
           return;
       }
       try {
           await onSkipSkill(engineData.next_step);
           setMessages(prev => [...prev, { sender: 'bot', text: `Dynamic Feedback Loop executed: ${engineData.next_step} skipped. The Global Roadmap has actively synced to your commands. Check the screen!` }]);
       } catch (err) {
           setMessages(prev => [...prev, { sender: 'bot', text: "The magic link to the server seems broken." }]);
       } finally {
           setIsTyping(false);
       }
       return;
    }

    try {
      const data = await apiCall("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: intent,
          user_data: userData,
          target_skill: intent === "why" ? engineData?.next_step : null
        })
      });
      setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: "Server anomaly detected." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleTextSubmit = async () => {
     if (!inputText.trim() || isTyping) return;
     const newGoal = inputText.trim();
     setInputText('');
     
     setMessages(prev => [...prev, { sender: 'user', text: `Can you customize my roadmap for: ${newGoal}?` }]);
     setIsTyping(true);
     
     try {
         await onSimulate(newGoal);
         setMessages(prev => [...prev, { sender: 'bot', text: `Feedback loop engaged! The platform has successfully been reconfigured for the goal "${newGoal}". Look closely and you'll see the Quest Map updated live.` }]);
     } catch (err) {
         setMessages(prev => [...prev, { sender: 'bot', text: `Simulation matrix failed.` }]);
     } finally {
         setIsTyping(false);
     }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-3xl bg-[#1a1a2e] text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:bg-[#16213e] hover:scale-110 active:scale-95 transition-all group"
        >
          <div className="relative">
             <Bot size={28} className="group-hover:text-indigo-300 transition-colors" />
             <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#1a1a2e] translate-x-1 -translate-y-1 animate-pulse"></div>
          </div>
        </button>
      ) : (
        <div className="w-[400px] h-[600px] rounded-[2.5rem] bg-[#0a0a0c] border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <Bot size={22} />
              </div>
              <div>
                <h3 className="text-white font-black tracking-tight leading-none text-base">AI Mentor</h3>
                <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest mt-1 inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Dynamic Updates Linked</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-gradient-to-b from-[#0a0a0c] to-[#0f0f13]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-md bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mr-3 mt-auto">
                     <Bot size={12} className="text-indigo-400" />
                  </div>
                )}
                <div className={`
                  max-w-[78%] px-5 py-3.5 text-[13px] leading-relaxed
                  ${msg.sender === 'user' ? 
                    'bg-indigo-600 text-white rounded-3xl rounded-br-sm shadow-[0_5px_15px_rgba(79,70,229,0.3)]' : 
                    'bg-white/5 border border-white/5 text-gray-300 rounded-3xl rounded-bl-sm shadow-sm backdrop-blur-md'}
                `}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                 <div className="w-6 h-6 rounded-md bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mr-3 mt-auto">
                     <Bot size={12} className="text-indigo-400" />
                 </div>
                <div className="bg-white/5 border border-white/5 px-5 py-3.5 rounded-3xl rounded-bl-sm flex items-center gap-1.5 h-[46px]">
                  <div className="w-1.5 h-1.5 bg-indigo-400/60 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400/60 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400/60 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* User Input & Actions */}
          <div className="p-5 bg-[#0a0a0c] border-t border-white/5 space-y-4">
             <div className="flex flex-wrap gap-2">
                {predefinedQueries.map((q, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleQuery(q.label, q.intent)}
                    disabled={isTyping}
                    className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed
                       ${q.special 
                          ? 'border-amber-500/30 text-amber-500 hover:bg-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.1)]' 
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}
                    `}
                  >
                    {q.label}
                  </button>
                ))}
             </div>
             
             <div className="relative group">
               <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
                placeholder="Type a new Career Goal here..." 
                className="w-full bg-[#15151a] border border-white/10 hover:border-indigo-500/30 focus:border-indigo-500/50 rounded-2xl py-3.5 pl-4 pr-12 text-sm text-white placeholder:text-gray-600 focus:outline-none transition-all shadow-inner"
                disabled={isTyping}
               />
               <button 
                onClick={handleTextSubmit}
                disabled={isTyping || !inputText.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-400 transition-colors disabled:opacity-50 disabled:bg-gray-700"
               >
                <Send size={14} className="translate-x-[-1px] translate-y-[1px]" />
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
