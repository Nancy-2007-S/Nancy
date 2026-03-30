import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';

export default function Chatbot({ userData, engineData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: `Greetings, Traveler! I am your AI Mentor for the ${userData.career_goal} quest. How can I assist you today?` }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const predefinedQueries = [
    { label: "Next step?", intent: "next_step" },
    { label: "Missing skills?", intent: "missing" },
    { label: "Projects?", intent: "projects" },
    { label: "Why this step?", intent: "why" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleQuery = async (queryText, intent) => {
    setMessages(prev => [...prev, { sender: 'user', text: queryText }]);
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: intent,
          user_data: userData,
          target_skill: intent === "why" ? engineData.next_step : null
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: "The magic link to the server seems broken." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:bg-indigo-500 hover:scale-110 active:scale-95 transition-all animate-pulse-slow"
        >
          <MessageSquare size={28} />
        </button>
      ) : (
        <div className="w-[380px] h-[550px] rounded-[2.5rem] glass-card border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-500">
          {/* Header */}
          <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Bot size={22} />
              </div>
              <div>
                <h3 className="text-white font-black tracking-tight leading-none">AI Mentor</h3>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1 inline-block">Online</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                  max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed
                  ${msg.sender === 'user' ? 
                    'bg-indigo-600 text-white rounded-tr-none shadow-lg' : 
                    'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'}
                `}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 p-4 rounded-3xl rounded-tl-none flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          <div className="p-4 bg-black/20 space-y-2">
             <div className="flex flex-wrap gap-2">
                {predefinedQueries.map((q, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleQuery(q.label, q.intent)}
                    disabled={isTyping}
                    className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-50"
                  >
                    {q.label}
                  </button>
                ))}
             </div>
             
             {/* Input Area (Visual only for now as per previous design) */}
             <div className="relative mt-4">
               <input 
                type="text" 
                placeholder="Message your mentor..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 pr-12 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 transition-all"
                disabled
               />
               <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
                <Send size={18} />
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
