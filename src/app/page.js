'use client';

import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Header from '@/components/Header';
import ProgressCards from '@/components/ProgressCards';
import RoadmapView from '@/components/RoadmapView';
import RightSidebar from '@/components/RightSidebar';
import AIChatbot from '@/components/AIChatbot';
import { useAuth } from '@/lib/useAuth';
import { useStore } from '@/store/useStore';
import { Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { user } = useAuth();
  const { initializeListeners, userProfile, progress, feedbackActions, clearFeedbackActions } = useStore();

  useEffect(() => {
    let unsubscribe;
    if (user) {
      unsubscribe = initializeListeners(user.uid);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, initializeListeners]);

  if (!userProfile || !progress) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f7ff]">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none -translate-y-12"></div>
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4 z-10"></div>
        <p className="text-slate-500 font-medium animate-pulse z-10">Preparing your universe...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f4f7ff]">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none -translate-y-12"></div>
      <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-teal-50/40 rounded-full blur-[80px] pointer-events-none"></div>

      <Navbar />

      {/* Feedback Banner */}
      <AnimatePresence>
        {feedbackActions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="relative z-20 max-w-[1400px] mx-auto px-6 lg:px-8 pt-4"
          >
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 px-5 py-3 rounded-2xl shadow-sm text-sm font-medium">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="flex-1">
                🧠 <strong>Your roadmap was updated!</strong> — {feedbackActions[feedbackActions.length - 1].label}
              </span>
              <button onClick={clearFeedbackActions} className="text-amber-400 hover:text-amber-600 transition-colors ml-2">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-[1400px] mx-auto px-6 lg:px-8 py-4 relative z-10 w-full">
        <Header />
        
        <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
          <div className="flex-1 min-w-0">
            <ProgressCards />
            <RoadmapView />
          </div>
          
          <RightSidebar />
        </div>
      </main>

      {/* Floating AI Chatbot — position: fixed inside */}
      <AIChatbot />
    </div>
  );
}
