import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Pencil, Upload, Rocket, CheckCircle, BrainCircuit, Sparkles, GraduationCap, FolderOpen } from 'lucide-react';
import { apiCall } from '../api';

const CAREER_PATHS = [
  'AI Engineer',      'Data Scientist',
  'ML Engineer',      'Backend Developer',
  'Frontend Developer','Full Stack Developer',
  'Cloud Engineer',
];

/* ─── Defined OUTSIDE the component so React never treats it as a new type ─── */
function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-[#f4f7ff] flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-100/50 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Brand header */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <span className="w-2.5 h-2.5 bg-white rounded-full" />
        </div>
        <span className="text-lg font-black tracking-tight text-slate-800">Career Mentor</span>
      </div>

      <div className="relative z-10 w-full max-w-lg px-6 pt-20 pb-10">
        {children}
      </div>
    </div>
  );
}

export default function OnboardingForm({ onComplete, userInfo }) {
  const [mode, setMode]         = useState(null); // null | 'quiz'
  const [step, setStep]         = useState(1);
  const TOTAL = 5;

  // Fields
  const [name, setName]               = useState(userInfo?.name || '');
  const [skills, setSkills]           = useState('');
  const [goal, setGoal]               = useState('');
  const [goalOpen, setGoalOpen]       = useState(false);
  const [education, setEducation]     = useState('');
  const [field, setField]             = useState('');
  const [institution, setInstitution] = useState('');
  const [projects, setProjects]       = useState('');
  const [interests, setInterests]     = useState('');

  // UI
  const [loading, setLoading]         = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [error, setError]             = useState('');

  const progress = ((step - 1) / (TOTAL - 1)) * 100;

  const clearError = () => setError('');

  const validate = () => {
    if (step === 1 && !name.trim()) { setError('Please enter your name.'); return false; }
    if (step === 2 && !goal)        { setError('Please select a career goal.'); return false; }
    return true;
  };

  const handleNext = () => { clearError(); if (validate()) setStep(s => Math.min(s + 1, TOTAL)); };
  const handleBack = () => { clearError(); setStep(s => Math.max(s - 1, 1)); };

  const handleSubmit = async () => {
    clearError();
    setLoading(true);
    const skillArray = skills.split(',').map(s => s.trim()).filter(Boolean);
    const payload = {
      name,
      skills: skillArray,
      career_goal: goal,
      education,
      interests: interests.split(',').map(s => s.trim()).filter(Boolean),
      projects,
      concise: false,
    };
    try {
      const data = await apiCall('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setIsGenerated(true);
      setTimeout(() => onComplete(payload, data), 2500);
    } catch {
      setError('Failed to connect to the AI engine. Is the backend running?');
      setLoading(false);
    }
  };

  const inputCls = "w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";

  /* ── Loading / Success ── */
  if (loading) {
    return (
      <PageShell>
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-14 border border-white shadow-[0_20px_60px_rgb(0,0,0,0.07)] flex flex-col items-center text-center">
          {!isGenerated ? (
            <>
              <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-8 shadow-[0_0_30px_rgba(99,102,241,0.3)]" />
              <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-3">Synthesizing Your Master Plan</h2>
              <p className="text-slate-500 font-medium text-sm animate-pulse">Building your personalised <strong>{goal}</strong> roadmap with real-time data…</p>
            </>
          ) : (
            <>
              <div className="relative mb-8">
                <div className="w-24 h-24 border-4 border-indigo-100 rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle className="text-indigo-500 w-12 h-12" />
                </div>
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-3">Roadmap Successfully Generated!</h2>
              <p className="text-slate-500 font-medium text-sm mb-8">Preparing your personalised dashboard…</p>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full w-full" />
              </div>
            </>
          )}
        </div>
      </PageShell>
    );
  }

  /* ── Entry: choose method ── */
  if (!mode) {
    return (
      <PageShell>
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 shadow-lg shadow-indigo-500/25 mb-5">
            <Rocket className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Let's build your roadmap</h1>
          <p className="text-slate-500 font-medium mt-2 text-sm">Choose how you'd like to get started.</p>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* Questionnaire card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.09)] hover:-translate-y-1 transition-all text-left">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-5">
              <Pencil className="text-indigo-500 w-6 h-6" />
            </div>
            <h3 className="font-black text-slate-800 text-lg mb-1">Questionnaire</h3>
            <p className="text-slate-500 text-sm font-medium mb-5">Answer 5 quick questions.</p>
            <button
              onClick={() => setMode('quiz')}
              className="px-5 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-black shadow-md shadow-indigo-500/20 hover:bg-indigo-600 transition-colors"
            >
              Start Questions
            </button>
          </div>

          {/* Resume card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.09)] hover:-translate-y-1 transition-all text-left">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-5">
              <Upload className="text-purple-500 w-6 h-6" />
            </div>
            <h3 className="font-black text-slate-800 text-lg mb-1">Upload Resume</h3>
            <p className="text-slate-500 text-sm font-medium mb-5">Let AI extract your details.</p>
            <button
              onClick={() => setMode('quiz')}
              className="px-5 py-2.5 rounded-xl bg-purple-500 text-white text-sm font-black shadow-md shadow-purple-500/20 hover:bg-purple-600 transition-colors"
            >
              Upload Resume
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  /* ── Step Wizard ── */
  return (
    <PageShell>
      <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white shadow-[0_20px_60px_rgb(0,0,0,0.07)]">

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-black text-slate-800">Step {step} of {TOTAL}</h2>
            <span className="text-sm font-bold text-indigo-500">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(progress, 6)}%` }}
            />
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-5 px-4 py-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-sm font-bold">
            {error}
          </div>
        )}

        {/* ── Step 1: Name & Skills ── */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                <span className="flex items-center gap-2"><Sparkles size={14} className="text-indigo-500" /> Your Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Nancy"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                <span className="flex items-center gap-2"><BrainCircuit size={14} className="text-emerald-500" /> Current Skills</span>
              </label>
              <input
                type="text"
                value={skills}
                onChange={e => setSkills(e.target.value)}
                placeholder="e.g. Python, SQL, React"
                className={inputCls}
              />
              <p className="text-xs text-slate-400 font-medium mt-1.5 ml-1">Separate with commas.</p>
            </div>
          </div>
        )}

        {/* ── Step 2: Career Goal ── */}
        {step === 2 && (
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
              <span className="flex items-center gap-2"><Rocket size={14} className="text-indigo-500" /> Primary Career Goal</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setGoalOpen(o => !o)}
                className={`${inputCls} flex items-center justify-between text-left`}
              >
                <span className={goal ? 'text-slate-800' : 'text-slate-400'}>{goal || 'Select Career Path'}</span>
                <ArrowRight size={16} className={`text-slate-400 transition-transform flex-shrink-0 ${goalOpen ? 'rotate-90' : ''}`} />
              </button>
              {goalOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden z-50">
                  <div className="grid grid-cols-2 p-2 gap-1">
                    {CAREER_PATHS.map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => { setGoal(p); setGoalOpen(false); clearError(); }}
                        className={`px-4 py-3 text-left rounded-xl text-sm font-bold transition-colors ${goal === p ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Step 3: Education ── */}
        {step === 3 && (
          <div className="space-y-4">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">
              <span className="flex items-center gap-2"><GraduationCap size={14} className="text-indigo-500" /> Education Background</span>
            </label>
            <input
              type="text"
              value={education}
              onChange={e => setEducation(e.target.value)}
              placeholder="e.g. Bachelor's Degree"
              className={inputCls}
            />
            <input
              type="text"
              value={field}
              onChange={e => setField(e.target.value)}
              placeholder="Field of Study (e.g. Computer Science)"
              className={inputCls}
            />
            <input
              type="text"
              value={institution}
              onChange={e => setInstitution(e.target.value)}
              placeholder="Institution Name (e.g. Stanford University)"
              className={inputCls}
            />
          </div>
        )}

        {/* ── Step 4: Projects ── */}
        {step === 4 && (
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
              <span className="flex items-center gap-2">
                <FolderOpen size={14} className="text-purple-500" />
                Projects or Achievements
                <span className="text-slate-400 font-medium normal-case">(Optional)</span>
              </span>
            </label>
            <p className="text-xs text-slate-400 font-medium mb-3">Tell us about meaningful things you've built or achieved.</p>
            <textarea
              rows={6}
              value={projects}
              onChange={e => setProjects(e.target.value)}
              placeholder="E.g. built a portfolio website using React..."
              className={`${inputCls} resize-none leading-relaxed`}
            />
          </div>
        )}

        {/* ── Step 5: Interests ── */}
        {step === 5 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                <span className="flex items-center gap-2"><Sparkles size={14} className="text-amber-500" /> Topics You Love</span>
              </label>
              <p className="text-xs text-slate-400 font-medium mb-3">Helps personalise your AI recommendations.</p>
              <input
                type="text"
                value={interests}
                onChange={e => setInterests(e.target.value)}
                placeholder="e.g. Machine Learning, Open Source, Cloud"
                className={inputCls}
              />
              <p className="text-xs text-slate-400 font-medium mt-1.5 ml-1">Separate with commas.</p>
            </div>

            {/* Summary preview */}
            {(name || goal || skills) && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 space-y-1.5">
                <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">Your Profile Summary</p>
                {name  && <p className="text-sm font-bold text-indigo-700">👤 {name}</p>}
                {goal  && <p className="text-sm font-bold text-indigo-700">🎯 {goal}</p>}
                {skills && <p className="text-sm font-medium text-indigo-600">🛠 {skills}</p>}
              </div>
            )}
          </div>
        )}

        {/* Nav buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <ArrowLeft size={16} /> Back
            </button>
          ) : <div />}

          {step < TOTAL ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-black text-sm shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-indigo-400 transition-all transform hover:-translate-y-0.5"
            >
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-sm shadow-lg shadow-indigo-500/25 hover:opacity-90 transition-all transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              <Rocket size={16} /> Generate Roadmap
            </button>
          )}
        </div>
      </div>
    </PageShell>
  );
}
