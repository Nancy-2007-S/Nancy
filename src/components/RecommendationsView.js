'use client';
import { useAuth } from '@/lib/useAuth';
import { useStore } from '@/store/useStore';
import { getFullRecommendations } from '@/lib/recommendationEngine';
import { Sparkles, BookOpen, Rocket, Terminal, Briefcase, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RecommendationsView() {
  const { userProfile, progress } = useStore();

  if (!userProfile) return null;

  const { targetSkills, skillGaps, courses, projects, peerInsights, jobs } =
    getFullRecommendations(userProfile.goal, userProfile.skills, progress?.completedNodes || []);

  return (
    <div className="bg-[#f4f7ff] relative overflow-hidden w-full">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none -translate-y-12 z-0"></div>
      
      <main className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8 relative z-10 w-full">
        <div className="mb-8 p-6 bg-white/80 backdrop-blur-md border border-indigo-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4">
          <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="flex-1 mt-1">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">AI Suggested Resources</h1>
            <p className="text-slate-600 mt-1.5 text-sm md:text-base font-medium max-w-2xl">
              Based on your goal to become a <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md mx-1">{userProfile.goal}</span>
              and your current skills, we found <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md mx-1">{skillGaps.length} missing technologies</span> you should learn.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Terminal className="w-5 h-5 text-slate-400" /> Skill Gaps Identified
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillGaps.map(gap => (
                  <span key={gap} className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium border border-rose-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> {gap}
                  </span>
                ))}
                {skillGaps.length === 0 && <span className="text-sm text-slate-500">No major gaps! You are highly skilled.</span>}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 text-xs uppercase tracking-wider text-slate-400">Target Skills for your goal</h3>
              <div className="flex flex-wrap gap-2">
                {targetSkills.map(ts => (
                  <span key={ts} className={`px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium border border-slate-200 flex items-center gap-1.5 ${skillGaps.includes(ts) ? 'opacity-60' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
                    {ts} {skillGaps.includes(ts) ? '' : <span className="text-emerald-500 text-xs">✓</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-slate-50/50 border-b border-slate-200 p-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-800">Recommended Courses</h3>
              </div>
              <div className="p-2">
                {courses.map((course, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.07 }}
                    key={course.id}
                    className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-200 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-100 to-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold font-serif text-xl shadow-inner group-hover:scale-105 transition-transform">
                        {course.platform[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm md:text-[15px]">{course.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{course.platform} • <span className="text-amber-600 bg-amber-50 px-1.5 rounded">{course.difficulty}</span></p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100 transition-colors shadow-sm">View</button>
                  </motion.div>
                ))}
                {courses.length === 0 && (
                  <div className="p-10 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-3"><Sparkles className="w-8 h-8" /></div>
                    <h4 className="font-bold text-slate-700 text-lg">You are all caught up!</h4>
                    <p className="text-slate-500 text-sm mt-1">You have mastered the necessary skills for your goal.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-slate-50/50 border-b border-slate-200 p-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                  <Rocket className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-800">Suggested Projects</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
                {projects.map((proj, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}
                    key={proj.id}
                    className="p-5 border border-slate-200 rounded-2xl hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-300 transition-all cursor-pointer group bg-gradient-to-br from-white to-slate-50/50 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-100/50 to-transparent rounded-bl-full pointer-events-none"></div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors z-10 relative">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-[15px] leading-snug z-10 relative group-hover:text-emerald-900">{proj.title}</h4>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50/50 border-b border-slate-200 p-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Internships & Jobs</h3>
                <p className="text-xs text-slate-400">Matched to your {userProfile.goal} goal</p>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {jobs.map((job, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
                  key={job.id}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg shrink-0 group-hover:scale-105 transition-transform">
                    {job.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 text-sm truncate">{job.role}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{job.company}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full font-medium">{job.type}</span>
                      <span className="text-xs text-emerald-600 font-semibold">{job.salary}</span>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors shrink-0">Apply</button>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50/50 border-b border-slate-200 p-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Peer Insights</h3>
                <p className="text-xs text-slate-400">What learners like you studied next</p>
              </div>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {peerInsights.map((insight, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                  key={insight.id}
                  className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 flex items-center justify-center font-bold text-lg shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{insight.skill}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{insight.reason}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
