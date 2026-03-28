"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FiArrowRight, 
  FiCheckCircle, 
  FiCompass, 
  FiLayers, 
  FiShield, 
  FiZap 
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { loginWithGoogle } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";
import { useAuth } from "@/lib/useAuth";

export default function LandingView() {
  const router = useRouter();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const { showToast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      showToast("Signed in successfully!", "success");
      router.push("/dashboard");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfdff] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-lg shadow-sm py-3" : "bg-transparent py-5"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-sky-500 flex items-center justify-center shadow-lg shadow-indigo-200">
               <div className="w-5 h-5 bg-white rounded-full"></div>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">Career Mentor</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">How it Works</a>
            {user ? (
              <Link href="/dashboard" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all hover:shadow-lg active:scale-95">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Log in</Link>
                <Link href="/signup" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all hover:shadow-lg active:scale-95">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-indigo-100/40 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 -right-20 w-96 h-96 bg-sky-100/40 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold tracking-wider uppercase mb-6">
                AI-Powered Career Guidance
              </span>
              <h1 className="text-4xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6 md:mb-8">
                Navigate your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500">
                  career path
                </span> with precision.
              </h1>
              <p className="text-base md:text-xl text-slate-600 leading-relaxed mb-8 md:mb-10 max-w-2xl">
                Career Mentor uses advanced AI to build personalized roadmaps, track your progress, and provide real-time guidance to land your dream job in tech.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Link href="/signup" className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-indigo-700 transition-all hover:shadow-2xl hover:shadow-indigo-200 active:scale-95 w-full sm:w-auto">
                  Get Started Free <FiArrowRight />
                </Link>
                <button 
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-slate-50 transition-all active:scale-95 shadow-sm w-full sm:w-auto"
                >
                  <FcGoogle size={22} /> Continue with Google
                </button>
              </div>

              <div className="mt-12 flex items-center gap-4 text-sm text-slate-500">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                    </div>
                  ))}
                </div>
                <p>Joined by <span className="font-bold text-slate-800">2,000+</span> ambitious learners</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Everything you need to grow</h2>
            <p className="text-slate-600">From personalized roadmaps to real-time AI assistance, we've built the ultimate platform for career growth.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FiZap className="text-indigo-600" />}
              title="Dynamic Roadmaps"
              description="Customized learning paths that adapt based on your skills, interests, and progress."
            />
            <FeatureCard 
              icon={<FiCompass className="text-sky-500" />}
              title="Career Guidance"
              description="Get clear directions on what to learn next and which industries are booming."
            />
            <FeatureCard 
              icon={<FiLayers className="text-emerald-500" />}
              title="Progress Tracking"
              description="Visualize your journey and stay motivated with integrated skill tracking."
            />
          </div>
        </div>
      </section>

      {/* Stats/Social Proof */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">95%</div>
            <div className="text-indigo-100 text-sm italic">User Satisfaction</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">150+</div>
            <div className="text-indigo-100 text-sm italic">Tech Roadmaps</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">24/7</div>
            <div className="text-indigo-100 text-sm italic">AI Mentorship</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">Fresh</div>
            <div className="text-indigo-100 text-sm italic">Market Insights</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 grayscale brightness-50">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
               <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800">Career Mentor</span>
          </div>
          <p className="text-sm text-slate-500">© 2026 Career Mentor. All rights reserved.</p>
          <div className="flex gap-6">
             <a href="#" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">Privacy Policy</a>
             <a href="#" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-8 rounded-3xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-indigo-100/50 transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
