"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiZap, FiCompass, FiLayers } from "react-icons/fi";

const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="p-8 rounded-3xl border border-slate-100 bg-white/50 backdrop-blur-sm hover:bg-white hover:shadow-2xl hover:shadow-indigo-100/50 transition-all group"
  >
    <div className={`w-14 h-14 rounded-2xl bg-${color}-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm`}>
      <Icon className={`text-${color}-600`} size={28} />
    </div>
    <h3 className="text-2xl font-bold mb-4 text-slate-800">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </motion.div>
);

const Features = () => {
  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -skew-x-12 transform origin-top-right"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900"
          >
            Everything you need to grow
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-lg text-slate-600"
          >
            From personalized roadmaps to real-time AI assistance, we've built the ultimate platform for career growth.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={FiZap}
            title="Dynamic Roadmaps"
            description="Customized learning paths that adapt based on your skills, interests, and progress in real-time."
            color="indigo"
          />
          <FeatureCard
            icon={FiCompass}
            title="Career Guidance"
            description="Get clear directions on what to learn next and which industries are booming in the tech market."
            color="purple"
          />
          <FeatureCard
            icon={FiLayers}
            title="Progress Tracking"
            description="Visualize your journey and stay motivated with integrated skill tracking and achievement badges."
            color="sky"
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
