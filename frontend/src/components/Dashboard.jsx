import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiChevronDown,
  FiEdit3,
  FiInfo,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";
import { parseResumeFile } from "../api";
import { useToast } from "./ToastProvider";

const SKILL_SUGGESTIONS = [
  "Python",
  "Java",
  "C++",
  "JavaScript",
  "TypeScript",
  "Machine Learning",
  "Deep Learning",
  "NLP",
  "Computer Vision",
  "SQL",
  "Data Analysis",
  "Pandas",
  "NumPy",
  "Power BI",
  "React",
  "Node.js",
  "Express",
  "Tailwind CSS",
  "Git",
  "Docker",
  "Kubernetes",
  "AWS",
];

const INTEREST_OPTIONS = [
  "AI Engineer",
  "Data Scientist",
  "ML Engineer",
  "Backend Developer",
  "Frontend Developer",
  "Full Stack Developer",
  "Cloud Engineer",
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

export default function Dashboard() {
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
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const name = localStorage.getItem("onboardingSignupName");
    if (name) setProfileName(name);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (draft?.stage) setStage(draft.stage);
      if (draft?.qStep >= 1 && draft?.qStep <= 5) setQStep(draft.qStep);
      if (draft?.data) setData(draft.data);
      setDegree(draft?.degree || "");
      setField(draft?.field || "");
      setUniversity(draft?.university || "");
    } catch {
      // Ignore malformed drafts.
    }
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
    setData((prev) => {
      const next = prev[key].filter((item) => item !== value);
      return {
        ...prev,
        [key]: next,
        ...(key === "interests" ? { career_goals: next } : {}),
      };
    });
  };

  const updateListFromText = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    }));
    setQError("");
  };

  const validateStep = () => {
    if (qStep === 1 && data.skills.length === 0) return "Add at least one skill.";
    if (qStep === 2 && data.interests.length === 0) return "Select at least one interest.";
    if (qStep === 3 && (!degree.trim() || !field.trim() || !university.trim())) {
      return "Degree, field, and university are required.";
    }
    if (qStep === 4 && data.projects.length === 0) return "Add at least one project.";
    if (qStep === 5 && data.experience.length === 0) return "Add at least one experience line.";
    return "";
  };

  const normalizePayload = () => ({
    skills: data.skills,
    interests: data.interests,
    academic_background: data.academic_background,
    projects: data.projects,
    experience: data.experience,
    career_goals: data.career_goals.length ? data.career_goals : data.interests,
  });

  const submitAndRedirect = async (overridePayload = null) => {
    const payload = overridePayload || normalizePayload();
    if (!payload.skills.length && !payload.interests.length) {
      showToast("Please complete required fields", "error");
      return;
    }
    localStorage.setItem("onboardingData", JSON.stringify(payload));
    localStorage.setItem("career_dataset", JSON.stringify(payload));
    localStorage.removeItem(DRAFT_KEY);
    showToast("Onboarding complete. Roadmap ready.", "success");
    navigate("/roadmap", { replace: true, state: { dataset: payload } });
  };

  const handleNextStep = async () => {
    const validationMessage = validateStep();
    if (validationMessage) {
      setQError(validationMessage);
      showToast("Please complete required fields", "error");
      return;
    }
    if (qStep === 3) {
      const academicBackground = `${degree.trim()}, ${field.trim()}, ${university.trim()}`;
      setData((prev) => ({ ...prev, academic_background: academicBackground }));
    }
    if (qStep < 5) {
      setAnimating(true);
      setTimeout(() => {
        setQStep((prev) => prev + 1);
        setAnimating(false);
      }, 150);
      return;
    }
    await submitAndRedirect();
  };

  const handleBackStep = () => {
    if (qStep === 1) {
      goToStage("choice");
      return;
    }
    setAnimating(true);
    setTimeout(() => {
      setQStep((prev) => prev - 1);
      setAnimating(false);
    }, 150);
  };

  const handleResumeSelection = async (file) => {
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "docx"].includes(ext || "")) {
      showToast("Please upload PDF or DOCX only", "error");
      return;
    }
    try {
      setIsParsingResume(true);
      const parsed = await parseResumeFile(file);
      const parsedData = {
        skills: parsed.skills || [],
        interests: parsed.interests || [],
        academic_background: parsed.academic_background || "",
        projects: parsed.projects || [],
        experience: parsed.experience || [],
        career_goals: parsed.career_goals || parsed.interests || [],
      };
      setData(parsedData);
      const [d = "", f = "", u = ""] = (parsedData.academic_background || "")
        .split(",")
        .map((item) => item.trim());
      setDegree(d);
      setField(f);
      setUniversity(u);
      setResumeReady(true);
      setData(parsedData);
      showToast("Resume parsed. Click Generate Roadmap to continue.", "success");
    } catch (err) {
      showToast(err.message || "Failed to parse resume", "error");
    } finally {
      setIsParsingResume(false);
    }
  };

  const onDropResume = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleResumeSelection(event.dataTransfer.files?.[0]);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-white to-indigo-100 px-4 py-8 transition-colors duration-300 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="w-full max-w-2xl flex flex-col items-center justify-center">
        <div
          className={`w-full transform transition-all duration-200 ${
            animating ? "scale-95 opacity-0" : "scale-100 opacity-100"
          }`}
        >
          {stage === "entry" && (
            <section className="rounded-3xl border border-slate-200/70 bg-white/85 p-8 text-center shadow-xl backdrop-blur-xl transition-colors duration-300 dark:border-slate-700/50 dark:bg-slate-800/80">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Welcome, {profileName}! Start your AI Career Journey 🚀
              </h1>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                Build your roadmap with questions or by uploading your resume.
              </p>
              <button
                onClick={() => goToStage("choice")}
                className="mt-7 inline-flex rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition duration-200 hover:scale-[1.02] hover:shadow-lg"
              >
                Start Journey
              </button>
            </section>
          )}

          {stage === "choice" && (
            <section className="grid gap-5 md:grid-cols-2">
              <article className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-md transition duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-xl hover:shadow-sky-100 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:shadow-sky-900/20">
                <div className="inline-flex rounded-xl bg-sky-100 p-2 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
                  <FiEdit3 size={18} />
                </div>
                <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Fill Questionnaire</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Answer a few questions to build your roadmap.
                </p>
                <button
                  onClick={() => {
                    setQStep(1);
                    goToStage("questionnaire");
                  }}
                  className="mt-5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02]"
                >
                  Start Questions
                </button>
              </article>

              <article className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-md transition duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-xl hover:shadow-indigo-100 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:shadow-indigo-900/20">
                <div className="inline-flex rounded-xl bg-indigo-100 p-2 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <FiUploadCloud size={18} />
                </div>
                <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Upload Resume</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Upload your resume and let AI extract your profile.
                </p>
                <button
                  onClick={() => goToStage("resumeUpload")}
                  className="mt-5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02]"
                >
                  Upload Resume
                </button>
              </article>
            </section>
          )}

          {stage === "questionnaire" && (
            <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-lg transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800/80">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Question {qStep} of 5</p>

              {qStep === 1 && (
                <div className="mt-3">
                  <label className="mb-1.5 inline-flex items-center gap-1 text-sm font-medium text-slate-800">
                    Skills
                    <span title="Type to filter. Press Enter for custom skills.">
                      <FiInfo size={14} className="text-slate-400" />
                    </span>
                  </label>
                  <input
                    value={skillQuery}
                    onChange={(e) => setSkillQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag("skills", skillQuery);
                      }
                    }}
                    placeholder="Type a skill and press Enter"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:focus:border-sky-500"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {availableSkills.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => addTag("skills", skill)}
                        className="rounded-full bg-sky-50 px-3 py-1 text-xs text-sky-700 hover:bg-sky-100 dark:bg-sky-900/20 dark:text-sky-300 dark:hover:bg-sky-900/40"
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {data.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-3 py-1 text-xs text-sky-800"
                      >
                        {skill}
                        <button onClick={() => removeTag("skills", skill)} aria-label="Remove skill">
                          <FiX size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {qStep === 2 && (
                <div className="mt-3">
                  <label className="mb-1.5 inline-flex items-center gap-1 text-sm font-medium text-slate-800">
                    Interests / Career Goals
                    <span title="Search and select multiple interests or add your own custom value.">
                      <FiInfo size={14} className="text-slate-400" />
                    </span>
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowInterestDropdown((prev) => !prev)}
                      className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200"
                    >
                      <span>{data.interests.length ? "Selected interests" : "Select interests"}</span>
                      <FiChevronDown size={16} />
                    </button>
                    {showInterestDropdown && (
                      <div className="absolute z-10 mt-2 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                        <input
                          value={interestQuery}
                          onChange={(e) => setInterestQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addTag("interests", interestQuery);
                              setInterestQuery("");
                            }
                          }}
                          placeholder="Search or add custom interest"
                          className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
                        />
                        <div className="max-h-44 overflow-y-auto">
                          {filteredInterests.map((option) => {
                            const checked = data.interests.includes(option);
                            return (
                              <button
                                key={option}
                                onClick={() =>
                                  checked
                                    ? removeTag("interests", option)
                                    : addTag("interests", option)
                                }
                                className={`mb-1 flex w-full items-center rounded-lg px-3 py-2 text-sm ${
                                  checked ? "bg-sky-100 text-sky-800" : "hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {data.interests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-xs text-indigo-800"
                      >
                        {interest}
                        <button onClick={() => removeTag("interests", interest)} aria-label="Remove interest">
                          <FiX size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {qStep === 3 && (
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-800">Degree</label>
                    <input
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                      placeholder="B.Tech"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-800 dark:text-slate-300">Field</label>
                    <input
                      value={field}
                      onChange={(e) => setField(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                      placeholder="Computer Science"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-800 dark:text-slate-300">University</label>
                    <input
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                      placeholder="XYZ University"
                    />
                  </div>
                </div>
              )}

              {qStep === 4 && (
                <div className="mt-3">
                  <label className="mb-1 block text-sm font-medium text-slate-800">Projects</label>
                  <textarea
                    rows={5}
                    value={data.projects.join("\n")}
                    onChange={(e) => updateListFromText("projects", e.target.value)}
                    placeholder="One project per line"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                  />
                </div>
              )}

              {qStep === 5 && (
                <div className="mt-3">
                  <label className="mb-1 block text-sm font-medium text-slate-800">Experience</label>
                  <textarea
                    rows={5}
                    value={data.experience.join("\n")}
                    onChange={(e) => updateListFromText("experience", e.target.value)}
                    placeholder="Role, duration, responsibilities (one per line)"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                  />
                </div>
              )}

              {qError && <p className="mt-3 text-sm text-red-600">{qError}</p>}

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={handleBackStep}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <FiArrowLeft size={15} />
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={false}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] disabled:opacity-70"
                >
                  {qStep === 5 ? "Generate Roadmap" : "Next"}
                  <FiArrowRight size={15} />
                </button>
              </div>
            </section>
          )}

          {stage === "resumeUpload" && (
            <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-slate-900">Upload Resume</h2>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDropResume}
                className={`mt-4 rounded-2xl border-2 border-dashed p-8 text-center transition ${
                  isDragging ? "border-sky-400 bg-sky-50" : "border-slate-300 bg-white"
                }`}
              >
                <FiUploadCloud size={30} className="mx-auto text-slate-500" />
                <p className="mt-3 text-sm text-slate-700">
                  Drop your resume (PDF/DOCX) or click to upload
                </p>
                <label className="mt-4 inline-block cursor-pointer rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02]">
                  Upload Resume
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={(e) => handleResumeSelection(e.target.files?.[0])}
                  />
                </label>
                {isParsingResume && <p className="mt-3 text-xs text-slate-500">Parsing resume...</p>}
                {resumeReady && (
                  <p className="mt-3 text-xs text-emerald-600">
                    Resume parsed successfully. Generate your roadmap to continue.
                  </p>
                )}
              </div>
              <div className="mt-5 flex items-center justify-between">
                <button
                  onClick={() => goToStage("choice")}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <FiArrowLeft size={15} />
                  Back
                </button>
                <button
                  onClick={() => submitAndRedirect()}
                  disabled={!resumeReady}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] disabled:opacity-70"
                >
                  Generate Roadmap
                  <FiArrowRight size={15} />
                </button>
              </div>
            </section>
          )}

        </div>
      </div>
    </main>
  );
}

