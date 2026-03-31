import React, { useState } from 'react';
import { LayoutDashboard, LogOut, CheckCircle2, Sparkles, GraduationCap, FolderOpen, User, Mail, Target, BookOpen, Edit2, X, Save, FileText } from 'lucide-react';

export default function ProfilePage({ userInfo, data, onUpdateProfile, onNavigateDashboard, onNavigateRecommendations, onNavigateRoadmap }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading]     = useState(false);

  // Local state for editing Profile
  const [editForm, setEditForm] = useState({
    name: userInfo?.name || '',
    career_goal: userInfo?.career_goal || '',
    education: userInfo?.education || '',
    courses: userInfo?.courses || '',
    projects: userInfo?.projects || '',
    skills: (userInfo?.skills || []).join(', '),
    interests: (userInfo?.interests || []).join(', '),
  });

  const name          = userInfo?.name         || 'Explorer';
  const email         = userInfo?.email        || '—';
  const goal          = userInfo?.career_goal  || '—';
  const skills        = userInfo?.skills       || [];
  const interests     = userInfo?.interests    || [];
  const education     = userInfo?.education    || '—';
  const courses       = userInfo?.courses      || '—';
  const projects      = userInfo?.projects     || '';
  const roadmap       = data?.roadmap          || [];
  const missingSkills = data?.missing_skills   || [];
  const completedCount = roadmap.filter(r => !missingSkills.includes(r)).length;
  const progressPct   = roadmap.length ? Math.round((completedCount / roadmap.length) * 100) : 0;

  const handleEditChange = (e) => {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setLoading(true);
    // Parse comma-separated strings back to arrays
    const newSkills = editForm.skills.split(',').map(s => s.trim()).filter(Boolean);
    const newInterests = editForm.interests.split(',').map(s => s.trim()).filter(Boolean);

    const updatedProfile = {
      ...userInfo,
      name: editForm.name,
      career_goal: editForm.career_goal,
      education: editForm.education,
      courses: editForm.courses,
      projects: editForm.projects,
      skills: newSkills,
      interests: newInterests,
    };

    if (onUpdateProfile) {
      const result = await onUpdateProfile(updatedProfile);
      if (result?.success) {
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
    setLoading(false);
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: userInfo?.name || '',
      career_goal: userInfo?.career_goal || '',
      education: userInfo?.education || '',
      courses: userInfo?.courses || '',
      projects: userInfo?.projects || '',
      skills: (userInfo?.skills || []).join(', '),
      interests: (userInfo?.interests || []).join(', '),
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fbfe] text-slate-900 font-sans flex flex-col items-center pb-20">
      {/* Top Navbar */}
      <header className="w-full bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigateRoadmap}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 shadow-lg shadow-indigo-500/20 flex items-center justify-center border-2 border-white">
            <span className="w-2.5 h-2.5 bg-white rounded-full" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-800">Career Mentor</h1>
        </div>

        <nav className="flex items-center gap-12 font-bold text-sm">
          <button className="text-slate-400 hover:text-slate-700 transition-colors" onClick={onNavigateDashboard}>Dashboard</button>
          <button className="text-slate-400 hover:text-slate-700 transition-colors" onClick={onNavigateRecommendations}>Recommendations</button>
          <button className="text-emerald-500 border-b-2 border-emerald-500 pb-1 cursor-default">Profile</button>
        </nav>

        <div className="flex items-center gap-4">
          <button onClick={onNavigateRoadmap} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
            <LayoutDashboard size={18} />
          </button>
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 font-black flex items-center justify-center border border-indigo-100">
            {name.charAt(0).toUpperCase()}
          </div>
          <button className="text-slate-400 hover:text-slate-700">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="w-full max-w-5xl mx-auto pt-10 px-6 space-y-8">
        
        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-sm">
              <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6" />
              <h3 className="text-xl font-black text-slate-800 mb-2">Updating Profile</h3>
              <p className="text-slate-500 text-sm font-medium">Recalculating your roadmap based on the new details...</p>
            </div>
          </div>
        )}

        {/* Hero Card */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
             {!isEditing && (
               <button onClick={() => setIsEditing(true)} className="absolute top-6 right-6 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white font-bold text-sm flex items-center gap-2 transition-all">
                 <Edit2 size={16} /> Edit Profile
               </button>
             )}
          </div>
          <div className="px-10 pb-8 relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-500 border-4 border-white shadow-xl -mt-12 flex items-center justify-center text-white text-4xl font-black">
              {isEditing ? editForm.name.charAt(0).toUpperCase() || 'U' : name.charAt(0).toUpperCase()}
            </div>
            <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              
              {!isEditing ? (
                <div>
                  <h2 className="text-3xl font-black text-slate-800">{name}</h2>
                  <p className="text-slate-500 font-medium text-sm mt-1 flex items-center gap-2">
                    <Mail size={14} /> {email}
                  </p>
                  <p className="text-indigo-600 font-bold text-sm mt-1 flex items-center gap-2">
                    <Target size={14} /> {goal}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 w-full max-w-md">
                   <div>
                     <input type="text" name="name" value={editForm.name} onChange={handleEditChange} placeholder="Your Name" className="w-full text-2xl font-black text-slate-800 border-b-2 border-indigo-200 focus:border-indigo-500 focus:outline-none bg-transparent py-1 transition-colors" />
                   </div>
                   <div>
                     <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm mt-2">
                       <Target size={16} />
                       <input type="text" name="career_goal" value={editForm.career_goal} onChange={handleEditChange} placeholder="Career Goal" className="w-full text-indigo-600 font-bold border-b border-indigo-200 focus:border-indigo-500 focus:outline-none bg-transparent py-1 transition-colors" />
                     </div>
                   </div>
                </div>
              )}

              <div className="text-right flex-shrink-0">
                <div className="text-4xl font-black text-indigo-600">{progressPct}%</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Roadmap Progress</div>
                <div className="w-40 h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                    style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-[2rem] p-4 flex items-center justify-end gap-3 px-8 -mt-4 shadow-sm relative z-10">
             <button onClick={handleCancelEdit} className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all text-sm flex items-center gap-2">
               <X size={16} /> Cancel
             </button>
             <button onClick={handleSave} className="px-6 py-2.5 rounded-xl font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all text-sm flex items-center gap-2">
               <Save size={16} /> Save Changes
             </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="space-y-6">
            {/* Skills */}
            <div className="bg-white rounded-[2rem] p-7 border border-slate-200 shadow-sm">
              <h3 className="font-black text-slate-800 text-base mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-emerald-500" /> Current Skills
              </h3>
              {!isEditing ? (
                skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map(s => (
                      <span key={s} className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold shadow-sm">
                        {s}
                      </span>
                    ))}
                  </div>
                ) : <p className="text-slate-400 text-sm font-medium">No skills added yet.</p>
              ) : (
                <div>
                  <textarea name="skills" value={editForm.skills} onChange={handleEditChange} rows={3} placeholder="Python, SQL, React..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none" />
                  <p className="text-xs text-slate-400 font-medium mt-2">Comma separated values</p>
                </div>
              )}
            </div>

            {/* Interests */}
            <div className="bg-white rounded-[2rem] p-7 border border-slate-200 shadow-sm">
              <h3 className="font-black text-slate-800 text-base mb-4 flex items-center gap-2">
                <BookOpen size={16} className="text-indigo-500" /> Interests
              </h3>
              {!isEditing ? (
                interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {interests.map(i => (
                      <span key={i} className="px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold shadow-sm">
                        {i}
                      </span>
                    ))}
                  </div>
                ) : <p className="text-slate-400 text-sm font-medium">No interests added yet.</p>
              ) : (
                <div>
                  <textarea name="interests" value={editForm.interests} onChange={handleEditChange} rows={3} placeholder="AI, Cloud, Music..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none" />
                  <p className="text-xs text-slate-400 font-medium mt-2">Comma separated values</p>
                </div>
              )}
            </div>

            {/* Education */}
            <div className="bg-white rounded-[2rem] p-7 border border-slate-200 shadow-sm">
              <h3 className="font-black text-slate-800 text-base mb-4 flex items-center gap-2">
                <GraduationCap size={16} className="text-purple-500" /> Education
              </h3>
              {!isEditing ? (
                <p className="text-slate-600 font-medium text-sm whitespace-pre-wrap">{education}</p>
              ) : (
                <textarea name="education" value={editForm.education} onChange={handleEditChange} rows={2} placeholder="e.g. B.S. in Computer Science" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none" />
              )}
            </div>
            
            {/* Courses */}
            <div className="bg-white rounded-[2rem] p-7 border border-slate-200 shadow-sm">
              <h3 className="font-black text-slate-800 text-base mb-4 flex items-center gap-2">
                <FileText size={16} className="text-amber-500" /> Courses Taken
              </h3>
              {!isEditing ? (
                <p className="text-slate-600 font-medium text-sm whitespace-pre-wrap">{courses}</p>
              ) : (
                <textarea name="courses" value={editForm.courses} onChange={handleEditChange} rows={3} placeholder="e.g. Algorithms, Data Structures, Web Dev, Intro to ML" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none" />
              )}
            </div>

          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Roadmap Progress */}
            <div className="bg-white rounded-[2rem] p-7 border border-slate-200 shadow-sm">
              <h3 className="font-black text-slate-800 text-base mb-6 flex items-center gap-2">
                <Target size={16} className="text-indigo-500" /> Roadmap Progress
                <span className="ml-auto text-xs font-bold text-slate-400">{completedCount}/{roadmap.length} completed</span>
              </h3>
              <div className="space-y-3">
                {roadmap.slice(0, 8).map((item, idx) => {
                  const done = !missingSkills.includes(item);
                  return (
                    <div key={idx} className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                        {done && <CheckCircle2 size={14} className="text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-bold ${done ? 'text-slate-700' : 'text-slate-400'}`}>{item}</span>
                          {done && <span className="text-xs font-bold text-emerald-500">✓ Done</span>}
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-700 ${done ? 'bg-emerald-500 w-full' : 'bg-slate-200 w-0'}`} />
                        </div>
                      </div>
                    </div>
                  );
                })}
                {roadmap.length > 8 && (
                  <p className="text-xs font-bold text-slate-400 text-center mt-2">+{roadmap.length - 8} more steps</p>
                )}
              </div>
            </div>

            {/* Projects */}
            {(!isEditing && projects) || isEditing ? (
              <div className="bg-white rounded-[2rem] p-7 border border-slate-200 shadow-sm">
                <h3 className="font-black text-slate-800 text-base mb-4 flex items-center gap-2">
                  <FolderOpen size={16} className="text-purple-500" /> Projects & Achievements
                </h3>
                {!isEditing ? (
                  <p className="text-slate-600 font-medium text-sm leading-relaxed whitespace-pre-wrap">{projects}</p>
                ) : (
                  <textarea name="projects" value={editForm.projects} onChange={handleEditChange} rows={5} placeholder="E.g. built a portfolio website using React..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none" />
                )}
              </div>
            ) : null}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Skills Learned',   value: skills.length,           color: 'indigo' },
                { label: 'Steps Completed',  value: completedCount,           color: 'emerald' },
                { label: 'Steps Remaining',  value: roadmap.length - completedCount, color: 'purple' },
              ].map(({ label, value, color }) => (
                <div key={label} className={`bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center`}>
                  <div className={`text-4xl font-black text-${color}-500 mb-1`}>{value}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
