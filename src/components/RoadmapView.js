'use client';
import { useState } from 'react';
import { roadmapData } from '@/data/roadmapData';
import StepCard from '@/components/StepCard';
import clsx from 'clsx';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function RoadmapView() {
  const [activeTab, setActiveTab] = useState('beginner');
  const { progress, roadmap, feedbackActions } = useStore();
  
  const roadmapId = progress?.roadmapId || 'full_stack';
  // Priority: Firestore-fetched roadmap > roadmapOverride nodes > static data
  let currentRoadmap = roadmap;
  if (progress?.roadmapOverride?.nodes) {
    currentRoadmap = {
      ...currentRoadmap,
      nodes: progress.roadmapOverride.nodes,
      edges: progress.roadmapOverride.edges,
    };
  }
  if (!currentRoadmap) currentRoadmap = roadmapData[roadmapId] || roadmapData['full_stack'];
  
  const nodes = currentRoadmap.nodes || [];
  const edges = currentRoadmap.edges || [];
  const completedNodes = progress?.completedNodes || [];
  
  const beginnerNodes     = nodes.filter(n => n.level === 'beginner');
  const intermediateNodes = nodes.filter(n => n.level === 'intermediate');
  const advancedNodes     = nodes.filter(n => n.level === 'advanced');
  
  const isBeginnerComplete     = beginnerNodes.length > 0 && beginnerNodes.every(n => completedNodes.includes(n.id));
  const isIntermediateComplete = intermediateNodes.length > 0 && intermediateNodes.every(n => completedNodes.includes(n.id));

  const tabs = [
    { id: 'beginner',     label: 'Beginner Level',     locked: false },
    { id: 'intermediate', label: 'Intermediate Level', locked: !isBeginnerComplete && beginnerNodes.length > 0 },
    { id: 'advanced',     label: 'Advanced Level',     locked: !isBeginnerComplete || (!isIntermediateComplete && intermediateNodes.length > 0) },
  ];

  const displayNodes = nodes.filter(n => n.level === activeTab);
  const hasUpdates = feedbackActions.length > 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 md:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex-1 overflow-hidden transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight capitalize">
          {activeTab} Level Roadmap
        </h2>
        {hasUpdates && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full"
          >
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            AI Updated
          </motion.span>
        )}
      </div>
      
      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 mb-8 px-2 overflow-x-auto pb-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.locked && setActiveTab(tab.id)}
            disabled={tab.locked}
            className={clsx(
              "pb-4 font-semibold text-[15px] whitespace-nowrap transition-colors border-b-2 relative",
              activeTab === tab.id 
                ? "text-emerald-600 border-emerald-500" 
                : tab.locked 
                  ? "text-slate-300 border-transparent cursor-not-allowed" 
                  : "text-slate-500 hover:text-slate-700 border-transparent"
            )}
          >
            {tab.label}
            {/* Badge for new nodes in this tab */}
            {nodes.filter(n => n.level === tab.id && n.isNew).length > 0 && (
              <span className="absolute -top-1 -right-3 w-4 h-4 bg-amber-400 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                {nodes.filter(n => n.level === tab.id && n.isNew).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Roadmap Steps */}
      <div className="pl-2 pb-6">
        <AnimatePresence>
          {displayNodes.map((step, index) => (
            <StepCard key={step.id} step={step} index={index} edges={edges} />
          ))}
        </AnimatePresence>
        {displayNodes.length === 0 && (
          <p className="text-slate-500 text-sm">No paths discovered for this level.</p>
        )}
      </div>
    </div>
  );
}
