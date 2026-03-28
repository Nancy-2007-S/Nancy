"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { signupUser, loginWithGoogle } from "@/lib/api";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useToast } from "@/components/ToastProvider";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function SignupView() {
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const [isManualSubmitting, setIsManualSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = "Name is required";
    if (!form.email.trim()) nextErrors.email = "Email is required";
    else if (!isValidEmail(form.email)) nextErrors.email = "Invalid email format";

    if (!form.password) nextErrors.password = "Password is required";
    else if (form.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = "Confirm password is required";
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage("");
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsManualSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      };
      const result = await signupUser(payload);
      setStatusMessage(result.message || "User registered successfully, redirecting...");
      
      localStorage.setItem("onboardingSignupName", payload.name);
      showToast("Signup successful. Continue onboarding.", "success");
      
      setForm(initialForm);
      setErrors({});
      router.push("/dashboard");
    } catch (error) {
      setStatusMessage(error.message);
      showToast(error.message || "Signup failed", "error");
    } finally {
      setIsManualSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleSubmitting(true);
    setStatusMessage("");
    try {
      // Use our centralized standalone google login function
      const result = await loginWithGoogle();

      if (result.user) {
        localStorage.setItem("onboardingSignupName", result.user.displayName || "Google User");
        setStatusMessage("Authenticated via Google, redirecting...");
        showToast("Signup successful. Continue onboarding.", "success");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("[GoogleAuth-Signup] Error:", error);
      let message = error.message;
      if (message.includes("auth/popup-closed-by-user")) {
        message = "Registration was cancelled. Please try again.";
      }
      setStatusMessage(message);
      showToast(message, "error");
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7ff] flex items-center justify-center px-4 py-8 relative overflow-hidden transition-colors duration-300 dark:bg-slate-900 w-full">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none -translate-y-12 z-0"></div>

      <div className="w-full max-w-md rounded-3xl bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8 transition-colors duration-300 dark:bg-slate-800/80 dark:border-slate-700/50 relative z-10">
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
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Your AI Career Advisor</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-200">
              Name
            </label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={onChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200 transition dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              placeholder="Your full name"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-200">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200 transition dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
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
                onChange={onChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200 transition dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-200">
              Confirm Password
            </label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={onChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200 transition dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                placeholder="Re-enter your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition"
              >
                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          {statusMessage && (
            <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-700 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300">
              {statusMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isManualSubmitting || isGoogleSubmitting}
            className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-transform duration-200 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isManualSubmitting && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {isManualSubmitting ? "Creating account..." : "Sign up"}
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
            onClick={handleGoogleSignup}
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
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-sky-600 hover:text-sky-700 underline-offset-2 hover:underline transition dark:text-sky-400"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
