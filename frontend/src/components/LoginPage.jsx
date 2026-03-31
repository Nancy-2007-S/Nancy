import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { auth, googleProvider, signInWithEmailAndPassword, signInWithPopup } from '../firebase';

export default function LoginPage({ onLoginSuccess, onNavigateBack, onNavigateSignUp }) {
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess({ uid: cred.user.uid, name: cred.user.displayName || email, email });
    } catch (err) {
      const msgs = {
        'auth/user-not-found':      'No account found with this email.',
        'auth/wrong-password':      'Incorrect password. Please try again.',
        'auth/invalid-email':       'Please enter a valid email address.',
        'auth/invalid-credential':  'Invalid email or password.',
        'auth/too-many-requests':   'Too many attempts. Please try again later.',
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
      onLoginSuccess({ uid: user.uid, name: user.displayName || user.email, email: user.email });
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7ff] text-slate-900 font-sans flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-indigo-100/40 via-sky-50/20 to-transparent pointer-events-none -translate-y-24 z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <button
        onClick={onNavigateBack}
        className="absolute top-10 left-10 p-3 rounded-xl bg-white/50 backdrop-blur-md border border-white/50 text-slate-600 hover:text-indigo-600 hover:bg-white transition-all shadow-sm z-50 flex items-center gap-2 font-bold text-sm"
      >
        <ArrowRight className="w-4 h-4 rotate-180" /> Back to Home
      </button>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/70 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.06)] border border-white flex flex-col items-center">

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-8">
            <div className="w-8 h-8 bg-white rounded-full" />
          </div>

          <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Welcome Back</h2>
          <p className="text-slate-500 font-medium mb-8 text-center text-sm">Sign in to sync your active quest maps and continue your roadmap journey.</p>

          {/* Error Banner */}
          {error && (
            <div className="w-full mb-4 px-4 py-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-sm font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="w-full space-y-5">
            <div className="space-y-4">
              {/* Email */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full pl-12 pr-4 py-4 bg-white/60 border border-indigo-100 rounded-2xl text-slate-800 font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-12 pr-12 py-4 bg-white/60 border border-indigo-100 rounded-2xl text-slate-800 font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm"
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-500 transition-colors">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm py-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 accent-indigo-600" />
                <span className="font-bold text-slate-500">Remember me</span>
              </label>
              <a href="#" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">Forgot password?</a>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full relative group overflow-hidden rounded-2xl p-4 font-black text-lg text-white transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 shadow-lg shadow-indigo-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-500" />
              <div className="relative flex items-center justify-center gap-2">
                {loading
                  ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  : <>Sign In <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                }
              </div>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center w-full my-6 gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">or continue with</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle} disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all font-bold text-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 disabled:opacity-60"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.6 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
              <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.5 6.3 14.7z"/>
              <path fill="#FBBC05" d="M24 44c5.2 0 10-1.8 13.7-4.8l-6.3-5.2C29.5 35.9 26.9 37 24 37c-5.2 0-9.5-3.4-11.2-8.1l-6.5 5C9.6 39.4 16.3 44 24 44z"/>
              <path fill="#EA4335" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.4-2.3 4.4-4.4 5.9l.1-.1 6.3 5.2C37 39.2 44 34 44 24c0-1.2-.1-2.4-.4-3.5z"/>
            </svg>
            Google
          </button>

          <div className="mt-8 pt-6 border-t border-slate-200/50 w-full text-center">
            <p className="text-sm font-medium text-slate-500">
              Don't have an account?{' '}
              <button onClick={onNavigateSignUp} className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
