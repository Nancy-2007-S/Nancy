"use client";
import React, { useEffect, useMemo, useState } from "react";
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
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ stage, qStep, data, degree, field, university })
    );
  }, [stage, qStep, data, degree, field, university]);

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

    localStorage.setItem("career_dataset", JSON.stringify(payload));
    localStorage.removeItem(DRAFT_KEY);
    showToast("Onboarding complete!", "success");
    // State will update automatically via AuthProvider/Store to show Dashboard
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
              <p className="text-xs text-slate-400 mb-2">Step {qStep} of 5</p>
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
                  <div className="mt-2 flex flex-wrap gap-2">
                    {availableSkills.map(s => (
                      <button key={s} onClick={() => addTag("skills", s)} className="px-2 py-1 bg-sky-50 text-sky-600 rounded-lg text-xs">+ {s}</button>
                    ))}
                  </div>
                </div>
              )}
              {qStep === 2 && (
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-slate-200">Career Interests</label>
                  <button onClick={() => setShowInterestDropdown(!showInterestDropdown)} className="w-full text-left p-2.5 bg-white border rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300">
                    {data.interests.length ? data.interests.join(", ") : "Select Interests"}
                  </button>
                  {showInterestDropdown && (
                    <div className="mt-2 grid grid-cols-2 gap-2 p-2 bg-white border rounded-xl dark:bg-slate-900 dark:border-slate-700">
                      {filteredInterests.map(i => (
                        <button key={i} onClick={() => addTag("interests", i)} className="text-left px-2 py-1 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-200">{i}</button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {qStep === 3 && (
                <div className="grid gap-3">
                  <input value={degree} onChange={e => setDegree(e.target.value)} placeholder="Degree" className="p-2.5 border rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
                  <input value={field} onChange={e => setField(e.target.value)} placeholder="Field of Study" className="p-2.5 border rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
                  <input value={university} onChange={e => setUniversity(e.target.value)} placeholder="University" className="p-2.5 border rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
                </div>
              )}
              {qError && <p className="text-xs text-red-500 mt-2">{qError}</p>}
              <div className="mt-6 flex justify-between">
                <button onClick={() => qStep === 1 ? goToStage("choice") : setQStep(qStep - 1)} className="px-4 py-2 border rounded-xl text-sm">Back</button>
                <button onClick={handleNextStep} className="px-6 py-2 bg-sky-500 text-white rounded-xl text-sm font-semibold">{qStep === 5 ? "Finish" : "Next"}</button>
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
                className={`border-2 border-dashed p-10 text-center rounded-2xl ${isDragging ? "bg-sky-50 border-sky-400" : "bg-white dark:bg-slate-900"}`}
              >
                <FiUploadCloud size={32} className="mx-auto mb-4 text-slate-400" />
                <p className="text-sm text-slate-500">Drop PDF or Click to Upload</p>
                <input type="file" className="hidden" id="resume" onChange={e => handleResumeSelection(e.target.files[0])} />
                <label htmlFor="resume" className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-xl text-sm inline-block cursor-pointer">Upload</label>
              </div>
              {isParsingResume && <p className="text-xs text-center mt-2 animate-pulse text-sky-600">Extracting profile details...</p>}
              <div className="mt-6 flex justify-between">
                <button onClick={() => goToStage("choice")} className="px-4 py-2 border rounded-xl text-sm">Back</button>
                <button onClick={() => submitAndRedirect()} disabled={!resumeReady} className="px-6 py-2 bg-sky-500 text-white rounded-xl text-sm font-semibold disabled:opacity-50">Continue</button>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
