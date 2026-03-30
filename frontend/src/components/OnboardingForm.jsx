import React, { useState } from 'react';
import { Sparkles, BrainCircuit, Rocket } from 'lucide-react';

export default function OnboardingForm({ onComplete, theme, onToggleTheme }) {
  const [goal, setGoal] = useState('Data Engineer');
  const [skills, setSkills] = useState('Python, SQL');
  const [concise, setConcise] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const skillArray = skills.split(',').map(s => s.trim()).filter(s => s);
    
    // Optimistic payload to let App.jsx know we are starting
    const payload = {
      skills: skillArray,
      career_goal: goal,
      concise: concise
    };

    // 1. Trigger INSTANT transition with optimistic data
    onComplete(payload, null); 

    try {
      const res = await fetch("http://localhost:8000/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      // 2. Silent update with real data
      onComplete(payload, data);
    } catch (err) {
      console.error(err);
      alert("Failed to connect to Intelligence Engine. Is the FastAPI backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/60 dark:bg-black/40 backdrop-blur-3xl rounded-[3rem] p-10 border border-white dark:border-white/10 shadow-[0_20px_50px_rgb(0,0,0,0.06)] dark:shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>
      
      <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
        <div>
          <label className="block text-sm font-black text-slate-500 dark:text-white/60 uppercase tracking-widest mb-3 flex items-center gap-2">
            <BrainCircuit size={16} className="text-indigo-600 dark:text-indigo-400" /> Choose Your Quest
          </label>
          <select 
            value={goal} 
            onChange={(e) => setGoal(e.target.value)}
            className="w-full bg-white/80 dark:bg-white/5 border border-white dark:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-none rounded-2xl p-5 text-slate-800 dark:text-white text-lg font-bold focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none appearance-none"
          >
            <option value="Data Engineer" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Data Engineer</option>
            <option value="Full Stack Developer" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Full Stack Developer</option>
            <option value="Data Scientist" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Data Scientist</option>
            <option value="AI/ML Engineer" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">AI/ML Engineer</option>
            <option value="DevOps Engineer" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">DevOps Engineer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-black text-slate-500 dark:text-white/60 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400" /> Current Arsenal (Skills)
          </label>
          <input 
            type="text" 
            value={skills} 
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. Python, SQL, React"
            className="w-full bg-white/80 dark:bg-white/5 border border-white dark:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-none rounded-2xl p-5 text-slate-800 dark:text-white text-lg font-bold placeholder:text-slate-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full relative group overflow-hidden rounded-[2rem] p-5 font-black text-lg uppercase tracking-widest text-white transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
        >
          <div className="absolute inset-0 bg-indigo-600 transition-all group-hover:bg-indigo-500"></div>
          <div className="relative flex items-center justify-center gap-3">
            {loading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Rocket size={24} className="group-hover:animate-bounce" />
                <span>Initialize Roadmap</span>
              </>
            )}
          </div>
        </button>
      </form>
    </div>
  );
}
