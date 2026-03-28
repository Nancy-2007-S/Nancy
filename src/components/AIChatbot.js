'use client';
import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/lib/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { BotMessageSquare, X, Send, Sparkles, ChevronDown } from 'lucide-react';

// Render markdown-ish bold (**text**) and newlines
const RenderText = ({ text }) => {
  const parts = text.split(/(\*\*[^*]+\*\*|\n)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part === '\n') return <br key={i} />;
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};

const QUICK_REPLIES = [
  "I find this topic hard",
  "Suggest projects for me",
  "Recommend courses",
  "Switch to Data Science",
  "I want to be a DevOps Engineer",
];

export default function AIChatbot() {
  const { user } = useAuth();
  const { chatHistory, isChatOpen, toggleChat, sendMessage, feedbackActions } = useStore();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isChatOpen && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isChatOpen]);

  const handleSend = async (msg) => {
    const text = (msg || input).trim();
    if (!text || sending) return;
    setInput('');
    setSending(true);
    await sendMessage(text, user?.uid);
    setSending(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Welcome message shown when chat is empty
  const isEmpty = chatHistory.length === 0;

  return (
    <>
      {/* Floating Bubble */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-transform"
        title="Open AI Career Mentor"
        id="chatbot-toggle-btn"
      >
        <AnimatePresence mode="wait">
          {isChatOpen ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <ChevronDown className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} transition={{ duration: 0.15 }}>
              <BotMessageSquare className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
        {/* Notification badge when feedbackActions exist */}
        {feedbackActions.length > 0 && !isChatOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full text-xs font-bold flex items-center justify-center border-2 border-white">
            {feedbackActions.length}
          </span>
        )}
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] md:w-[360px] max-h-[70vh] md:max-h-[580px] flex flex-col bg-white rounded-3xl shadow-2xl shadow-slate-900/20 border border-slate-200 overflow-hidden"
            id="chatbot-panel"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-indigo-600 to-teal-500 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <BotMessageSquare className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-sm leading-none">AI Career Mentor</h3>
                <p className="text-indigo-100 text-xs mt-0.5">Powered by your goals ✨</p>
              </div>
              <button onClick={toggleChat} className="text-white/70 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Feedback banner */}
            {feedbackActions.length > 0 && (
              <div className="bg-amber-50 border-b border-amber-100 px-4 py-2.5 flex items-center gap-2 shrink-0">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <p className="text-xs font-semibold text-amber-700 leading-snug">
                  {feedbackActions[feedbackActions.length - 1].label}
                </p>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 min-h-0" id="chat-messages-area">
              {isEmpty && (
                <div className="flex flex-col items-center text-center gap-3 mt-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-teal-100 flex items-center justify-center">
                    <BotMessageSquare className="w-8 h-8 text-indigo-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Hey, I'm your AI Mentor!</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-[220px]">Ask me anything — I can modify your roadmap, suggest projects, and guide your career.</p>
                  </div>
                  {/* Quick reply chips */}
                  <div className="flex flex-wrap justify-center gap-2 mt-1">
                    {QUICK_REPLIES.slice(0, 3).map(qr => (
                      <button
                        key={qr}
                        onClick={() => handleSend(qr)}
                        className="text-xs px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors font-medium"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {chatHistory.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center shrink-0 mr-2 mt-0.5">
                      <BotMessageSquare className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-sm'
                        : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                    }`}
                  >
                    <RenderText text={msg.text} />
                  </div>
                </motion.div>
              ))}

              {sending && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center shrink-0 mr-2">
                    <BotMessageSquare className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Quick Replies (when there are messages) */}
            {!isEmpty && (
              <div className="flex gap-2 px-4 py-2 overflow-x-auto shrink-0 border-t border-slate-100">
                {QUICK_REPLIES.slice(0, 3).map(qr => (
                  <button
                    key={qr}
                    onClick={() => handleSend(qr)}
                    className="text-xs px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors font-medium whitespace-nowrap shrink-0"
                  >
                    {qr}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 border-t border-slate-100 flex items-center gap-2 shrink-0 bg-white">
              <input
                type="text"
                id="chatbot-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask your AI mentor..."
                disabled={sending}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all placeholder:text-slate-400 disabled:opacity-60"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || sending}
                id="chatbot-send-btn"
                className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
