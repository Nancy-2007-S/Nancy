"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FiArrowRight } from "react-icons/fi";

const Hero = ({ onGoogleLogin }) => {
  return (
    <section className="relative min-h-[85vh] flex items-center pt-32 pb-20 md:pt-0 md:pb-0 overflow-hidden bg-white">
      {/* High-Fidelity Refined Background Image / Hero Content */}
      <div 
        className="absolute top-0 right-0 w-full h-full md:w-[60%] lg:w-[55%] z-0"
        style={{
          backgroundImage: 'url("/hero-professional.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          maskImage: 'linear-gradient(to left, black 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent 100%)',
        }}
      ></div>

      {/* Decorative Glows to blend with the new image's palette */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-100/50 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-purple-100/30 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="flex flex-col md:flex-row items-center">
          {/* Left Content - Focused on textual impact */}
          <div className="w-full md:w-1/2 lg:w-[50%] text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100/50 text-indigo-600 text-xs font-bold tracking-widest uppercase mb-8 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                AI-Powered Prediction Engine
              </span>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.05] tracking-tight mb-8">
                Design your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500">
                  career path
                </span><br />
                without limits.
              </h1>

              <p className="text-lg md:text-xl text-slate-500 leading-relaxed mb-10 max-w-xl mx-auto md:mx-0 font-medium">
                Career Mentor uses advanced AI to build personalized roadmaps, track your progress, and provide real-time guidance to land your dream job in tech.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 items-center justify-center md:justify-start">
                <Link
                  href="/signup"
                  className="group flex items-center justify-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-black transition-all hover:shadow-2xl hover:shadow-indigo-100 active:scale-95 w-full sm:w-auto"
                >
                  Get Started Free 
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  onClick={onGoogleLogin}
                  className="flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-600 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-slate-50 transition-all active:scale-95 shadow-sm w-full sm:w-auto"
                >
                  <FcGoogle size={24} /> Continue with Google
                </button>
              </div>

              <div className="mt-16 flex items-center justify-center md:justify-start gap-5">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm"
                    >
                      <img
                        src={`https://i.pravatar.cc/150?img=${i + 20}`}
                        alt="User profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                    +2k
                  </div>
                </div>
                <div className="text-sm font-semibold text-slate-400">
                   Joined by <span className="text-slate-900">2,000+</span> ambitious global learners
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right side is intentionally empty in the flex-row layout as the background image handles the visual on the right */}
          <div className="hidden md:block w-full md:w-1/2 lg:w-[50%] pointer-events-none"></div>
        </div>
      </div>

      {/* Subtle UI Accents (Optional, as the image itself has UI fusion) */}
      <div className="absolute top-[15%] right-[5%] w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 hidden lg:block -rotate-12"></div>
      <div className="absolute bottom-[20%] right-[10%] w-16 h-16 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hidden lg:block animate-bounce-slow"></div>
    </section>
  );
};

export default Hero;
