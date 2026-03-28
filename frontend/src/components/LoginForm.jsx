import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { loginUser } from "../api";
import { useToast } from "./ToastProvider";

const initialForm = {
  email: "",
  password: "",
};

export default function LoginForm() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = "Email is required";
    if (!form.password) nextErrors.password = "Password is required";
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

    setIsSubmitting(true);
    try {
      const payload = {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      };
      const result = await loginUser(payload);
      if (result.access_token) {
        localStorage.setItem("access_token", result.access_token);
        setStatusMessage("Logged in successfully, redirecting...");
        showToast("Login successful", "success");
        setForm(initialForm);
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 500);
      } else {
        setStatusMessage("Unexpected response from server.");
        showToast("Unexpected response from server", "error");
      }
    } catch (error) {
      setStatusMessage(error.message || "Invalid email or password");
      showToast(error.message || "Invalid email or password", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/70 p-8 shadow-xl shadow-sky-100/80 backdrop-blur-xl transition-all duration-300">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            CAREER MENTOR
          </h1>
          <p className="mt-2 text-sm text-slate-600">Your AI Career Advisor</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-800">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              autoComplete="email"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-800">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={onChange}
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 transition hover:text-slate-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-200 transition duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-200 disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          >
            {isSubmitting && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        {statusMessage && (
          <p className="mt-4 text-center text-sm text-slate-700 transition-colors duration-200">
            {statusMessage}
          </p>
        )}
      </div>
    </div>
  );
}


