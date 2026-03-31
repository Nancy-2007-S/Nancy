import React, { useEffect, useState } from "react";
import { 
  ArrowRight, 
  Map, 
  Layers, 
  Zap, 
  BookOpen, 
  CheckCircle2 
} from "lucide-react";

export default function LandingPage({ onNavigateLogin, onNavigateOnboarding }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f7ff] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-indigo-100/40 via-sky-50/20 to-transparent pointer-events-none -translate-y-24 z-0"></div>
      
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-white/70 backdrop-blur-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] py-4 border-b border-white/50" : "bg-transparent py-6"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
               <div className="w-5 h-5 bg-white rounded-full"></div>
            </div>
            <span className="font-black text-xl tracking-tight text-slate-800">Career Mentor</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <a href="#features" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">How it Works</a>
            <div className="flex items-center gap-6">
              <button onClick={onNavigateLogin} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Log in</button>
              <button onClick={onNavigateOnboarding} className="px-6 py-2.5 rounded-xl text-sm font-black bg-slate-900 text-white hover:bg-slate-800 transition-all hover:shadow-lg hover:shadow-slate-900/20 hover:-translate-y-0.5 active:scale-95">
                Data-Driven
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 md:pt-48 md:pb-24 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
             <div className="lg:w-1/2">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[12px] font-black tracking-widest mb-8 shadow-sm">
                  <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                  AI-POWERED CAREER GUIDANCE
                </span>
                <h1 className="text-5xl md:text-[72px] font-black text-slate-900 leading-[1.05] mb-8 tracking-[-0.03em]">
                  Navigate Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
                    Career Path
                  </span> with precision.
                </h1>
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 max-w-xl font-medium">
                  Career Mentor uses <span className="text-slate-900 font-black">advanced AI</span> to build personalized roadmaps, track your progress, and provide real-time guidance to land your dream job in tech.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-5 items-center">
                  <button 
                    onClick={onNavigateOnboarding}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-8 py-4 rounded-2xl text-lg font-black hover:shadow-[0_20px_40px_rgba(79,70,229,0.3)] transition-all hover:-translate-y-1 active:scale-95 w-full sm:w-auto"
                  >
                    Get Started Free <ArrowRight className="w-5 h-5 ml-1" />
                  </button>
                  <button 
                    onClick={onNavigateLogin}
                    className="flex items-center justify-center gap-3 bg-white/70 backdrop-blur-md border border-white text-slate-700 px-8 py-4 rounded-2xl text-lg font-black hover:bg-white transition-all hover:shadow-xl hover:shadow-indigo-500/5 active:scale-95 w-full sm:w-auto shadow-sm"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      <path fill="none" d="M1 1h22v22H1z"/>
                    </svg>
                    Continue with Google
                  </button>
                </div>

                <div className="mt-12 flex items-center gap-4 text-sm md:text-base text-slate-500 font-medium">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-[3px] border-[#f4f7ff] bg-slate-200 overflow-hidden shadow-sm">
                        <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="User" />
                      </div>
                    ))}
                  </div>
                  <p>Joined by <span className="font-black text-slate-900">2,000+</span> ambitious learners</p>
                </div>
             </div>
             
             {/* Hero Image / Illustration */}
             <div className="lg:w-1/2 relative w-full h-[500px] lg:h-[600px] flex items-center justify-center">
                 {/* Floating badges */}
                 <div className="absolute top-10 right-10 bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl shadow-indigo-500/10 border border-white flex items-center gap-3 animate-[translate-y-1_3s_ease-in-out_infinite_alternate]">
                    <div className="bg-indigo-100/50 p-2 rounded-xl text-indigo-600">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <div>
                      <p className="font-black text-slate-800">2,000+</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ambitious learners</p>
                    </div>
                 </div>

                 <div className="absolute top-40 left-0 bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl shadow-indigo-500/10 border border-white flex items-center gap-3 animate-[translate-y-2_4s_ease-in-out_infinite_alternate-reverse]">
                    <div className="bg-emerald-100/50 p-2 rounded-xl text-emerald-600">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <p className="font-black text-slate-800">95%</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">success rate</p>
                    </div>
                 </div>
                 
                 <div className="absolute bottom-32 left-10 bg-white/80 backdrop-blur-xl p-3 px-5 rounded-2xl shadow-xl shadow-indigo-500/10 border border-white flex items-center gap-3 animate-[translate-y-1_3.5s_ease-in-out_infinite_alternate]">
                    <span className="font-black text-slate-800 text-sm">JS</span>
                    <div className="w-1 h-4 bg-slate-200" />
                    <span className="font-black text-indigo-600 text-sm">CSS</span>
                    <div className="w-1 h-4 bg-slate-200" />
                    <span className="font-black text-white bg-blue-500 px-2 rounded-md text-xs">HTML</span>
                 </div>

                 {/* Simulated Hero Graphic */}
                 <div className="w-[85%] h-[85%] bg-gradient-to-tr from-indigo-200/40 to-sky-100/40 rounded-full blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                 <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2670&auto=format&fit=crop" alt="Student using laptop" className="w-[90%] h-[90%] object-cover rounded-[3rem] shadow-2xl z-10 relative object-top" />
             </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative z-10 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/50 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Everything you need to grow</h2>
            <p className="text-slate-600 text-lg font-medium leading-relaxed">From personalized roadmaps to real-time AI assistance, we've built the ultimate platform for career growth.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-10 rounded-[2.5rem] bg-white/80 backdrop-blur-md border border-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.05)] hover:bg-white hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300 bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Map size={28} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">Dynamic Roadmaps</h3>
              <p className="text-slate-500 leading-relaxed font-medium">Computed tracking matching your pace to offer mentorship paths completely tailored relative to your progress.</p>
            </div>
            
            <div className="p-10 rounded-[2.5rem] bg-white/80 backdrop-blur-md border border-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.05)] hover:bg-white hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300 bg-sky-50 text-sky-600 border border-sky-100">
                <BookOpen size={28} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">Career Guidance</h3>
              <p className="text-slate-500 leading-relaxed font-medium">Career platform tailored by AI to earn advancements into specific domains and forecasting trends.</p>
            </div>
            
            <div className="p-10 rounded-[2.5rem] bg-white/80 backdrop-blur-md border border-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.05)] hover:bg-white hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300 bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Layers size={28} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">Progress Tracking</h3>
              <p className="text-slate-500 leading-relaxed font-medium">We map milestones, evaluate specific checkpoints, and arrange a visual benchmark of success.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Social Proof Footer */}
      <section className="py-20 bg-gradient-to-br from-[#16134b] via-[#1b1e6e] to-[#120a32] text-white relative z-10 overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.3)] border-t border-indigo-500/20">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 rounded-lg"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10 mb-16">
          <div className="flex flex-col items-center justify-center">
            <div className="text-5xl md:text-6xl font-black mb-3">95%</div>
            <div className="text-indigo-200/80 text-sm font-bold tracking-widest uppercase">User Satisfaction</div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="text-5xl md:text-6xl font-black mb-3">150+</div>
            <div className="text-indigo-200/80 text-sm font-bold tracking-widest uppercase">Tech Roadmaps</div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="text-5xl md:text-6xl font-black mb-3">24/7</div>
            <div className="text-indigo-200/80 text-sm font-bold tracking-widest uppercase">AI Mentorship</div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="text-5xl md:text-6xl font-black mb-3">Fresh</div>
            <div className="text-indigo-200/80 text-sm font-bold tracking-widest uppercase">Market Insights</div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
            <div className="flex items-center gap-2.5">
               <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-lg">
                  <div className="w-4 h-4 bg-indigo-600 rounded-full"></div>
               </div>
               <span className="font-black text-lg tracking-tight text-white">Career Mentor</span>
            </div>
            
            <p className="text-xs font-bold text-white/40">© 2026 Career Mentor. All rights reserved.</p>
            
            <div className="flex gap-6 text-xs font-bold text-white/50">
               <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
        </div>
      </section>
    </div>
  );
}
