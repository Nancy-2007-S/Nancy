"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiArrowRight,
  FiChevronDown,
  FiEdit3,
  FiInfo,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";
import { parseResumeFile, saveCareerProfile } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";
import { useStore } from "@/store/useStore";

const SKILL_SUGGESTIONS = [
  "Python", "Java", "C++", "JavaScript", "TypeScript",
  "Machine Learning", "Deep Learning", "NLP", "Computer Vision",
  "SQL", "Data Analysis", "Pandas", "NumPy", "Power BI",
  "React", "Node.js", "Express", "Tailwind CSS",
  "Git", "Docker", "Kubernetes", "AWS",
];

const INTEREST_OPTIONS = [
  "AI Engineer", "Data Scientist", "ML Engineer",
  "Backend Developer", "Frontend Developer",
  "Full Stack Developer", "Cloud Engineer",
];

const DRAFT_KEY = "career_profile_journey_draft";

const DEFAULT_DATA = {
  skills: [],
  interests: [],
  academic_background: "",
  projects: [],
  experience: [],
  career_goals: [],
};

export default function OnboardingView() {
  const router = useRouter();
  const { userProfile, profileLoaded } = useStore();
  const { showToast } = useToast();

  const [profileName, setProfileName] = useState("Learner");
  const [stage, setStage] = useState("entry");
  const [animating, setAnimating] = useState(false);
  const [qStep, setQStep] = useState(1);
  const [qError, setQError] = useState("");
  const [skillQuery, setSkillQuery] = useState("");
  const [interestQuery, setInterestQuery] = useState("");
  const [showInterestDropdown, setShowInterestDropdown] = useState(false);
  const [degree, setDegree] = useState("");
  const [field, setField] = useState("");
  const [university, setUniversity] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [resumeReady, setResumeReady] = useState(false);
  const [data, setData] = useState(DEFAULT_DATA);
  const [isFinishing, setIsFinishing] = useState(false);
  
  // Local states for textareas to allow smooth typing (including spaces)
  const [projectsText, setProjectsText] = useState("");
  const [experienceText, setExperienceText] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("onboardingSignupName");
    if (name) setProfileName(name);

    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft?.stage) setStage(draft.stage);
        if (draft?.qStep) setQStep(draft.qStep);
        if (draft?.data) setData(draft.data);
        setDegree(draft?.degree || "");
        setField(draft?.field || "");
        setUniversity(draft?.university || "");
        setProjectsText(draft?.data?.projects?.join("\n") || "");
        setExperienceText(draft?.data?.experience?.join("\n") || "");
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (isFinishing) return;
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ stage, qStep, data, degree, field, university })
    );
  }, [stage, qStep, data, degree, field, university, isFinishing]);

  const goToStage = (nextStage) => {
    setAnimating(true);
    setTimeout(() => {
      setStage(nextStage);
      setAnimating(false);
    }, 180);
  };

  const availableSkills = useMemo(() => {
    const q = skillQuery.trim().toLowerCase();
    if (!q) return SKILL_SUGGESTIONS.filter((item) => !data.skills.includes(item)).slice(0, 8);
    return SKILL_SUGGESTIONS.filter(
      (item) => item.toLowerCase().includes(q) && !data.skills.includes(item)
    ).slice(0, 8);
  }, [skillQuery, data.skills]);

  const filteredInterests = useMemo(() => {
    const q = interestQuery.trim().toLowerCase();
    if (!q) return INTEREST_OPTIONS;
    return INTEREST_OPTIONS.filter((item) => item.toLowerCase().includes(q));
  }, [interestQuery]);

  const addTag = (key, value) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setData((prev) => {
      if (prev[key].includes(trimmed)) return prev;
      const next = [...prev[key], trimmed];
      return {
        ...prev,
        [key]: next,
        ...(key === "interests" ? { career_goals: next } : {}),
      };
    });
    setQError("");
  };

  const removeTag = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: prev[key].filter((item) => item !== value),
    }));
  };

  const updateListFromText = (key, value) => {
    if (key === "projects") setProjectsText(value);
    if (key === "experience") setExperienceText(value);

    setData((prev) => ({
      ...prev,
      [key]: value.split("\n").map(i => i.trim()).filter(Boolean),
    }));
  };

  const validateStep = () => {
    if (qStep === 1 && data.skills.length === 0) return "Add at least one skill.";
    if (qStep === 2 && data.interests.length === 0) return "Select at least one interest.";
    if (qStep === 3 && (!degree.trim() || !field.trim() || !university.trim())) {
      return "Degree, field, and university are required.";
    }
    return "";
  };

  const submitAndRedirect = async (overridePayload = null) => {
    setIsFinishing(true);
    const payload = overridePayload || {
      ...data,
      academic_background: `${degree.trim()}, ${field.trim()}, ${university.trim()}`,
      career_goals: data.interests,
    };

    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        await saveCareerProfile(token, payload);
      } catch (e) {
        console.error("Failed to sync profile with server", e);
      }
    }

    localStorage.removeItem(DRAFT_KEY);
    
    // Explicitly update store BEFORE navigating
    const currentState = useStore.getState();
    useStore.setState({
       userProfile: { 
         ...currentState.userProfile, 
         ...payload, 
         onboarding_completed: true,
         exists: true 
       }
    });

    showToast("Onboarding complete!", "success");
    
    // Use window.location as a fallback if router.push is weird
    router.push("/dashboard");
  };

  const handleNextStep = () => {
    const err = validateStep();
    if (err) {
      setQError(err);
      return;
    }
    if (qStep < 5) {
      setAnimating(true);
      setTimeout(() => {
        setQStep(s => s + 1);
        setAnimating(false);
      }, 150);
    } else {
      submitAndRedirect();
    }
  };

  const handleResumeSelection = async (file) => {
    if (!file) return;
    setIsParsingResume(true);
    try {
      const parsed = await parseResumeFile(file);
      setData(parsed);
      const parts = (parsed.academic_background || "").split(",").map(p => p.trim());
      setDegree(parts[0] || "");
      setField(parts[1] || "");
      setUniversity(parts[2] || "");
      setProjectsText(parsed.projects?.join("\n") || "");
      setExperienceText(parsed.experience?.join("\n") || "");
      setResumeReady(true);
      showToast("Resume parsed!", "success");
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setIsParsingResume(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f7ff] flex items-center justify-center px-4 py-8 relative overflow-hidden transition-colors duration-300 dark:bg-slate-900 w-full">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none -translate-y-12 z-0"></div>

      <div className="w-full max-w-2xl relative z-10">
        <div className={`transform transition-all duration-200 ${animating ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}>
          {stage === "entry" && (
            <section className="rounded-3xl bg-white/80 backdrop-blur-xl p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white dark:bg-slate-800/80">
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Welcome, {profileName}!</h1>
              <p className="mt-3 text-slate-600 dark:text-slate-400">Let's build your AI Career Roadmap.</p>
              <button onClick={() => goToStage("choice")} className="mt-7 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 text-white">Start Journey</button>
            </section>
          )}

          {stage === "choice" && (
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-3xl bg-white/85 p-6 shadow-md dark:bg-slate-800/80">
                <FiEdit3 className="text-sky-500 mb-4" size={24} />
                <h2 className="text-xl font-semibold dark:text-white">Questionnaire</h2>
                <p className="text-sm text-slate-500 mb-5">Answer 5 quick questions.</p>
                <button onClick={() => { setQStep(1); goToStage("questionnaire"); }} className="rounded-xl bg-sky-500 px-4 py-2 text-white">Start Questions</button>
              </div>
              <div className="rounded-3xl bg-white/85 p-6 shadow-md dark:bg-slate-800/80">
                <FiUploadCloud className="text-indigo-500 mb-4" size={24} />
                <h2 className="text-xl font-semibold dark:text-white">Upload Resume</h2>
                <p className="text-sm text-slate-500 mb-5">Let AI extract your details.</p>
                <button onClick={() => goToStage("resumeUpload")} className="rounded-xl bg-indigo-500 px-4 py-2 text-white">Upload Resume</button>
              </div>
            </div>
          )}

          {(stage === "questionnaire") && (
            <section className="rounded-3xl bg-white/85 p-6 shadow-lg dark:bg-slate-800/80">
              <div className="flex justify-between items-center mb-6">
                 <div>
                   <h3 className="text-lg font-bold text-slate-800 dark:text-white">Step {qStep} of 5</h3>
                   <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2 min-w-[200px]">
                      <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${(qStep/5)*100}%` }}></div>
                   </div>
                 </div>
              </div>

              {qStep === 1 && (
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-slate-200">What are your top skills?</label>
                  <input
                    value={skillQuery}
                    onChange={e => setSkillQuery(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addTag("skills", skillQuery)}
                    className="w-full rounded-xl border p-2.5 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                    placeholder="e.g. React, UX Design"
                  />
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                    Selected: {data.skills.map(s => (
                      <span key={s} className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                        {s} <FiX className="cursor-pointer" onClick={() => removeTag("skills", s)} />
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {availableSkills.map(s => (
                      <button key={s} onClick={() => addTag("skills", s)} className="px-2 py-1 bg-white border border-slate-200 hover:border-sky-400 text-slate-600 dark:bg-slate-800 dark:border-slate-700 rounded-lg text-xs">+ {s}</button>
                    ))}
                  </div>
                </div>
              )}
              {qStep === 2 && (
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-slate-200">Primary Career Goal</label>
                  <button onClick={() => setShowInterestDropdown(!showInterestDropdown)} className="w-full text-left p-2.5 bg-white border rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 flex justify-between items-center">
                    {data.interests.length ? data.interests.join(", ") : "Select Career Path"}
                    <FiChevronDown />
                  </button>
                  {showInterestDropdown && (
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 p-2 bg-white border rounded-xl shadow-xl z-20 absolute w-full max-w-[calc(100%-3rem)] dark:bg-slate-800 dark:border-slate-700">
                      {filteredInterests.map(i => (
                        <button key={i} onClick={() => { addTag("interests", i); setShowInterestDropdown(false); }} className="text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-200 rounded-lg">{i}</button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {qStep === 3 && (
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-slate-200">What is your education level?</label>
                    <input value={degree} onChange={e => setDegree(e.target.value)} placeholder="e.g. Bachelor's Degree" className="w-full p-2.5 border rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-slate-200">Field of Study</label>
                    <input value={field} onChange={e => setField(e.target.value)} placeholder="e.g. Computer Science" className="w-full p-2.5 border rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-slate-200">Institution Name</label>
                    <input value={university} onChange={e => setUniversity(e.target.value)} placeholder="e.g. Stanford University" className="w-full p-2.5 border rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
                  </div>
                </div>
              )}
               {qStep === 4 && (
                <div className="grid gap-4">
                  <label className="block text-sm font-medium mb-2 dark:text-slate-200">Projects or Achievements (Optional)</label>
                  <p className="text-xs text-slate-500 mb-2">Tell us about meaningful things you've built or achieved.</p>
                  <textarea 
                    value={projectsText}
                    onChange={e => updateListFromText("projects", e.target.value)} 
                    placeholder="E.g. built a portfolio website using React..." 
                    className="w-full p-2.5 border rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-white min-h-[150px]" 
                  />
                </div>
              )}
              {qStep === 5 && (
                <div className="grid gap-4">
                  <label className="block text-sm font-medium mb-2 dark:text-slate-200">Work Experience (Optional)</label>
                  <p className="text-xs text-slate-500 mb-2">Mention any internships or full-time roles.</p>
                  <textarea 
                    value={experienceText}
                    onChange={e => updateListFromText("experience", e.target.value)} 
                    placeholder="E.g. Internship at Google as Frontend Dev..." 
                    className="w-full p-2.5 border rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-white min-h-[150px]" 
                  />
                </div>
              )}
              {qError && <p className="text-xs text-red-500 mt-2 font-medium bg-red-50 p-2 rounded-lg">{qError}</p>}
              <div className="mt-8 flex justify-between">
                <button onClick={() => qStep === 1 ? goToStage("choice") : setQStep(qStep - 1)} className="px-5 py-2.5 flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium font-sm border border-slate-200 rounded-xl">
                  <FiArrowLeft /> Back
                </button>
                <button 
                  onClick={handleNextStep} 
                  disabled={isFinishing}
                  className="px-8 py-2.5 bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 text-white rounded-xl text-sm font-bold flex items-center gap-2 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                >
                  {isFinishing && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                  {isFinishing ? "Processing..." : (qStep === 5 ? "Finish" : "Next")} <FiArrowRight />
                </button>
              </div>
            </section>
          )}

          {stage === "resumeUpload" && (
            <section className="rounded-3xl bg-white/85 p-6 shadow-lg dark:bg-slate-800/80">
              <h2 className="text-xl font-semibold dark:text-white mb-4">Upload Resume</h2>
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => { e.preventDefault(); setIsDragging(false); handleResumeSelection(e.dataTransfer.files[0]); }}
                className={`border-2 border-dashed p-10 text-center rounded-2xl transition-colors ${isDragging ? "bg-indigo-50 border-indigo-400" : "bg-white dark:bg-slate-900 border-slate-200"}`}
              >
                <FiUploadCloud size={32} className="mx-auto mb-4 text-indigo-400" />
                <p className="text-sm text-slate-500">Drop PDF or Click to Upload</p>
                <input type="file" className="hidden" id="resume" onChange={e => handleResumeSelection(e.target.files[0])} />
                <label htmlFor="resume" className="mt-4 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm inline-block cursor-pointer transition-colors shadow-md">Upload</label>
              </div>
              {isParsingResume && (
                <div className="flex flex-col items-center mt-6">
                  <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <p className="text-xs text-center mt-2 font-medium text-slate-500">Extracting profile details...</p>
                </div>
              )}
              {resumeReady && (
                <div className="mt-6 p-4 bg-teal-50 border border-teal-100 rounded-xl flex items-center gap-3">
                   <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
                      <FiInfo size={20} />
                   </div>
                   <div className="flex-1">
                      <p className="text-sm font-bold text-teal-900">Success!</p>
                      <p className="text-xs text-teal-700">Your profile was updated based on your resume.</p>
                   </div>
                </div>
              )}
              <div className="mt-8 flex justify-between">
                <button onClick={() => goToStage("choice")} className="px-4 py-2 flex items-center gap-2 border rounded-xl text-sm font-medium text-slate-600">
                  <FiArrowLeft /> Back
                </button>
                <button onClick={() => submitAndRedirect()} disabled={!resumeReady} className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-bold disabled:opacity-50 transition-colors shadow-md">
                   Continue
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
