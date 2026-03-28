"use client";
import React, { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { loginUser, loginWithGoogle, saveCareerProfile } from "@/lib/api";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useToast } from "@/components/ToastProvider";

export default function LoginView({ setView }) {
  const { showToast } = useToast();

  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isManualSubmitting, setIsManualSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasOnboardingData = typeof window !== "undefined" && Boolean(localStorage.getItem("onboardingData"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormError("");
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = "Email is required";
    if (!form.password) nextErrors.password = "Password is required";
    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsManualSubmitting(true);
    setFormError("");
    try {
      const payload = {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      };
      const result = await loginUser(payload);
      if (result.access_token) {
        localStorage.setItem("access_token", result.access_token);
        const onboardingDataRaw = localStorage.getItem("onboardingData");
        
        if (onboardingDataRaw) {
          const onboardingData = JSON.parse(onboardingDataRaw);
          await saveCareerProfile(result.access_token, onboardingData);
          localStorage.setItem("career_dataset", JSON.stringify(onboardingData));
          localStorage.removeItem("onboardingData");
          showToast("Profile saved successfully 🎉", "success");
        } else {
          showToast("Login successful", "success");
        }
        // State will update automatically via AuthProvider/Store if it was a real redirect, 
        // but since we're in an SPA, the AuthProvider in ROOT layout will detect the user change.
      } else {
        setFormError("Unexpected response from server.");
      }
    } catch (error) {
      setFormError(error.message || "Invalid email or password");
      showToast(error.message || "Login failed", "error");
    } finally {
      setIsManualSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleSubmitting(true);
    setFormError("");
    try {
      // Use our centralized standalone google login function
      const result = await loginWithGoogle();

      if (result.user) {
        const onboardingDataRaw = localStorage.getItem("onboardingData");
        
        if (onboardingDataRaw) {
          const onboardingData = JSON.parse(onboardingDataRaw);
          // Result.access_token is no longer strictly needed for setDoc but we keep signature or pass null
          await saveCareerProfile(null, onboardingData);
          localStorage.setItem("career_dataset", JSON.stringify(onboardingData));
          localStorage.removeItem("onboardingData");
          showToast("Profile saved successfully 🎉", "success");
        } else {
          showToast("Login successful", "success");
        }
      }
    } catch (error) {
      console.error("[GoogleAuth] Error:", error);
      let message = error.message;
      if (message.includes("auth/popup-closed-by-user")) {
        message = "Login was cancelled. Please try again.";
      }
      setFormError(message);
      showToast(message, "error");
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7ff] flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-300 dark:bg-slate-900 w-full">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none -translate-y-12 z-0"></div>
      
      <div
        className={`w-full max-w-md rounded-3xl bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8 transform transition-all duration-500 ease-out dark:bg-slate-800/80 dark:border-slate-700/50 relative z-10 ${
          mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
        }`}
      >
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/logo.png" 
              alt="Career Mentor Logo" 
              className="h-16 w-16 rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-slate-900 overflow-hidden object-cover" 
            />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            CAREER MENTOR
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Your AI Career Advisor
          </p>
          {hasOnboardingData && (
            <p className="mt-3 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-700">
              Login to generate your personalized roadmap
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-200">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200 transition dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-200">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200 transition dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          {formError && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
              {formError}
            </div>
          )}

          <button
            type="submit"
            disabled={isManualSubmitting || isGoogleSubmitting}
            className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-transform duration-200 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isManualSubmitting && (
              <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            Log in
          </button>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <span className="relative bg-white dark:bg-slate-800 px-2 text-xs text-slate-500 uppercase tracking-widest">
              or continue with
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isManualSubmitting || isGoogleSubmitting}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            {isGoogleSubmitting ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
            ) : (
              <FcGoogle size={20} />
            )}
            {isGoogleSubmitting ? "Authenticating..." : "Google"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <button
            onClick={() => setView("signup")}
            className="font-medium text-sky-600 hover:text-sky-700 underline-offset-2 hover:underline transition dark:text-sky-400"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
