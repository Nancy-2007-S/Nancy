import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Roadmap() {
  const location = useLocation();
  const navigate = useNavigate();

  const dataset = useMemo(() => {
    if (location.state?.dataset) return location.state.dataset;
    try {
      const stored = localStorage.getItem("career_dataset");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, [location.state]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 4000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <main className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-sky-100 via-white to-indigo-100 px-4 py-10 transition-colors duration-300 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur-xl transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800/80">
        <p className="text-sm font-medium text-slate-600">Step 3 of 3</p>
        <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
          <div className="h-2 w-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500" />
        </div>

        <h1 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">
          Skill Gap Analysis & Roadmap Generation
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Your profile data is ready. Next, integrate roadmap generation logic/API here.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Redirecting to login in a few seconds...
        </p>

        {dataset ? (
          <div className="mt-5 grid gap-3 text-sm text-slate-700">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="font-medium text-slate-900">Skills</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {dataset.skills?.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-sky-100 px-3 py-1 text-xs text-sky-800"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="font-medium text-slate-900">Career Goals</p>
              <p className="mt-1 text-slate-700">
                {(dataset.career_goals || []).join(", ") || "Not provided"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="font-medium text-slate-900">Academic Background</p>
              <p className="mt-1 text-slate-700">
                {dataset.academic_background || "Not provided"}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-5 text-sm text-red-600">
            No onboarding data found. Please complete Step 1 first.
          </p>
        )}

        <div className="mt-6">
          <button
            onClick={() => navigate("/login")}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Go to Login
          </button>
        </div>
      </div>
    </main>
  );
}
