import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { auth, googleProvider, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from '../firebase';

export default function SignUpPage({ onSignUpSuccess, onNavigateLogin }) {
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw]   = useState(false);
  const [showCo, setShowCo]   = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6)       { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(cred.user, { displayName: form.name });
      onSignUpSuccess({ uid: cred.user.uid, name: form.name, email: form.email });
    } catch (err) {
      const msgs = {
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/invalid-email':        'Please enter a valid email address.',
        'auth/weak-password':        'Password should be at least 6 characters.',
      };
      setError(msgs[err.code] || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user   = result.user;
      onSignUpSuccess({ uid: user.uid, name: user.displayName || user.email, email: user.email });
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7ff] text-slate-900 font-sans flex items-center justify-center relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-indigo-100/40 via-sky-50/20 to-transparent pointer-events-none -translate-y-24 z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-6 py-10">
        <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.07)] border border-white flex flex-col items-center">

          {/* Logo */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-3">
            <span className="text-white text-xl font-black tracking-tight">CM</span>
          </div>
          <h1 className="text-2xl font-black tracking-widest text-slate-800 uppercase mb-1">Career Mentor</h1>
          <p className="text-slate-500 text-sm font-medium mb-8">Your AI Career Advisor</p>

          {/* Error Banner */}
          {error && (
            <div className="w-full mb-4 px-4 py-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-sm font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="w-full space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">Name</label>
              <input
                name="name" type="text" required value={form.name}
                onChange={handleChange} placeholder="Your full name"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">Email</label>
              <input
                name="email" type="email" required value={form.email}
                onChange={handleChange} placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">Password</label>
              <div className="relative">
                <input
                  name="password" type={showPw ? 'text' : 'password'} required value={form.password}
                  onChange={handleChange} placeholder="At least 6 characters"
                  className="w-full px-4 py-3 pr-12 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-500 transition-colors">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">Confirm Password</label>
              <div className="relative">
                <input
                  name="confirm" type={showCo ? 'text' : 'password'} required value={form.confirm}
                  onChange={handleChange} placeholder="Re-enter your password"
                  className="w-full px-4 py-3 pr-12 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button type="button" onClick={() => setShowCo(p => !p)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-500 transition-colors">
                  {showCo ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-black text-white text-base bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:hover:translate-y-0 mt-2"
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                : 'Sign up'
              }
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center w-full my-6 gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">or continue with</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogle} disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all font-bold text-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 disabled:opacity-60"
          >
            {/* Google SVG */}
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.6 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
              <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.5 6.3 14.7z"/>
              <path fill="#FBBC05" d="M24 44c5.2 0 10-1.8 13.7-4.8l-6.3-5.2C29.5 35.9 26.9 37 24 37c-5.2 0-9.5-3.4-11.2-8.1l-6.5 5C9.6 39.4 16.3 44 24 44z"/>
              <path fill="#EA4335" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.4-2.3 4.4-4.4 5.9l.1-.1 6.3 5.2C37 39.2 44 34 44 24c0-1.2-.1-2.4-.4-3.5z"/>
            </svg>
            Google
          </button>

          {/* Login Link */}
          <p className="mt-7 text-sm font-medium text-slate-500">
            Already have an account?{' '}
            <button onClick={onNavigateLogin} className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
              Log in
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}
