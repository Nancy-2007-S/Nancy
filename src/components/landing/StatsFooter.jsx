"use client";
import React from "react";
import { motion } from "framer-motion";

const StatsBadge = ({ value, label }) => (
  <div className="text-center px-12 border-x border-white/5 first:border-l-0 last:border-r-0">
    <div className="text-5xl md:text-6xl font-black text-white mb-3 tracking-tighter">{value}</div>
    <div className="text-indigo-200/70 text-sm italic font-medium tracking-wide uppercase">{label}</div>
  </div>
);

const Stats = () => {
  return (
    <section className="py-24 bg-[#0a0c1a] text-white relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>
        </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-wrap justify-center gap-y-12 md:flex-nowrap">
        <StatsBadge value="95%" label="User Satisfaction" />
        <StatsBadge value="150+" label="Tech Roadmaps" />
        <StatsBadge value="24/7" label="AI Mentorship" />
        <StatsBadge value="Fresh" label="Market Insights" />
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-20 bg-[#fcfdff] relative overflow-hidden">
      {/* Subtle Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-indigo-50/50 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                <div className="w-5 h-5 bg-white rounded-full"></div>
            </div>
            <span className="font-extrabold text-xl tracking-tighter text-slate-800">
              Career Mentor
            </span>
          </div>

          <p className="text-sm text-slate-400 font-medium">
            © 2026 Career Mentor. All rights reserved.
          </p>

          <div className="flex gap-8">
            <a
              href="#"
              className="text-xs text-slate-400 hover:text-indigo-600 font-bold transition-colors uppercase tracking-[0.2em]"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs text-slate-400 hover:text-indigo-600 font-bold transition-colors uppercase tracking-[0.2em]"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Stats, Footer };
