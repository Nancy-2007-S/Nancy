'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function ProfileSetup() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [goal, setGoal] = useState('Full Stack Developer');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [interestInput, setInterestInput] = useState('');
  const [interests, setInterests] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const goals = [
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'Data Scientist',
    'Machine Learning Engineer',
    'DevOps Engineer',
    'Mobile Developer'
  ];

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleAddInterest = (e) => {
    e.preventDefault();
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput('');
    }
  };

  const handleRemoveInterest = (interest) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (skills.length === 0) {
      setError('Please add at least one skill');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const goalToRoadmapId = {
        'Full Stack Developer': 'full_stack',
        'Frontend Developer': 'frontend',
        'Backend Developer': 'backend',
        'Data Scientist': 'data_science',
        'Machine Learning Engineer': 'ml_engineer',
        'DevOps Engineer': 'devops',
        'Mobile Developer': 'mobile'
      };

      // 1. Update user profile
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        name,
        goal,
        skills,
        interests,
        updatedAt: new Date().toISOString(),
        isProfileComplete: true
      }, { merge: true });

      // 2. Initialize progress document
      const progressRef = doc(db, 'progress', user.uid);
      await setDoc(progressRef, {
        roadmapId: goalToRoadmapId[goal] || 'full_stack', 
        completedNodes: [],
        currentLevel: 1,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      router.push('/');
    } catch (err) {
      setError('Failed to save profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-[#f4f7ff] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background purely for aesthetics */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none -translate-y-12 z-0"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white w-full max-w-2xl relative z-10"
      >
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-2">Complete Your Profile</h2>
        <p className="text-slate-500 text-sm mb-8">Tell us about your goals and skills so we can personalize your roadmap.</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-100 text-sm mb-6 flex items-start gap-2">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1.5 ml-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium placeholder:text-slate-400"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1.5 ml-1">Career Goal</label>
              <select 
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-slate-700"
              >
                {goals.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-600 block mb-1.5 ml-1">Current Skills</label>
            <div className="flex gap-2 mb-2">
              <input 
                type="text" 
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(e);
                  }
                }}
                className="flex-1 bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium placeholder:text-slate-400"
                placeholder="e.g. React, Python"
              />
              <button 
                type="button" 
                onClick={handleAddSkill}
                className="bg-indigo-100 text-indigo-700 px-5 py-3 rounded-xl text-sm font-bold hover:bg-indigo-200 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map(skill => (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={skill} 
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100 flex items-center gap-1.5"
                >
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-indigo-400 hover:text-indigo-600">&times;</button>
                </motion.span>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-600 block mb-1.5 ml-1">Interests & Domains</label>
            <div className="flex gap-2 mb-2">
              <input 
                type="text" 
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddInterest(e);
                  }
                }}
                className="flex-1 bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium placeholder:text-slate-400"
                placeholder="e.g. AI, Web3, FinTech"
              />
              <button 
                type="button" 
                onClick={handleAddInterest}
                className="bg-teal-50 text-teal-700 px-5 py-3 rounded-xl text-sm font-bold hover:bg-teal-100 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {interests.map(interest => (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={interest} 
                  className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium border border-teal-100 flex items-center gap-1.5"
                >
                  {interest}
                  <button type="button" onClick={() => handleRemoveInterest(interest)} className="text-teal-400 hover:text-teal-600">&times;</button>
                </motion.span>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-semibold py-3.5 rounded-xl mt-4 hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-500/20 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center text-sm"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Complete Setup'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
