'use client';
import { useStore } from '@/store/useStore';
import { roadmapData } from '@/data/roadmapData';
import { Lock } from 'lucide-react';
import clsx from 'clsx';

export default function ProgressCards() {
  const { progress, roadmap } = useStore();
  
  const roadmapId = progress?.roadmapId === 'default' ? 'full_stack' : (progress?.roadmapId || 'full_stack');
  const currentRoadmap = roadmap || roadmapData[roadmapId] || roadmapData['full_stack'];
  const nodes = currentRoadmap?.nodes || [];
  const completedIds = progress?.completedNodes || [];
  
  // Level-specific calculations
  const beginnerNodes = nodes.filter(n => n.level === 'beginner');
  const intermediateNodes = nodes.filter(n => n.level === 'intermediate');
  const advancedNodes = nodes.filter(n => n.level === 'advanced');

  const beginnerCompleted = beginnerNodes.filter(n => completedIds.includes(n.id)).length;
  const intermediateCompleted = intermediateNodes.filter(n => completedIds.includes(n.id)).length;
  const advancedCompleted = advancedNodes.filter(n => completedIds.includes(n.id)).length;

  const beginnerTotal = beginnerNodes.length;
  const intermediateTotal = intermediateNodes.length;
  const advancedTotal = advancedNodes.length;

  // Locking logic: intermediate stays locked until ALL beginner nodes are done
  const isIntermediateLocked = beginnerTotal > 0 && beginnerCompleted < beginnerTotal;
  // Advanced stays locked until ALL beginner AND ALL intermediate nodes are done
  const isAdvancedLocked = isIntermediateLocked || (intermediateTotal > 0 && intermediateCompleted < intermediateTotal);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Beginner Card */}
      <div className="bg-white rounded-2xl p-5 border-2 border-emerald-100 shadow-sm shadow-emerald-100/50 flex relative hover:shadow-md transition-shadow">
        <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl font-bold mr-4 shrink-0 shadow-inner">
          1
        </div>
        <div className="flex-1 mt-1">
          <h3 className="font-bold text-slate-800">Beginner Level</h3>
          <p className="text-xs text-slate-500 mb-2">{beginnerCompleted} / {beginnerTotal} Steps Completed</p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
             <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${(beginnerCompleted / (beginnerTotal || 1)) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Intermediate Card */}
      <div className={clsx("rounded-2xl p-5 border shadow-sm flex relative transition-colors", 
        isIntermediateLocked ? "bg-[#eef2fa] border-slate-200/60" : "bg-white border-indigo-100 shadow-indigo-100/50")}>
        <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center shrink-0 mr-4 mt-1",
          isIntermediateLocked ? "bg-slate-300 text-white" : "bg-indigo-500 text-white font-bold text-xl")}>
          {isIntermediateLocked ? <Lock className="w-5 h-5" /> : "2"}
        </div>
        <div className="flex-1 mt-1">
          <h3 className={clsx("font-bold", isIntermediateLocked ? "text-slate-500" : "text-slate-800")}>Intermediate Level</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isIntermediateLocked ? "Locked" : `${intermediateCompleted} / ${intermediateTotal} Steps Completed`}
          </p>
          {!isIntermediateLocked && (
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-2">
               <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${(intermediateCompleted / (intermediateTotal || 1)) * 100}%` }}></div>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Card */}
      <div className={clsx("rounded-2xl p-5 border shadow-sm flex relative transition-colors", 
        isAdvancedLocked ? "bg-[#eef2fa] border-slate-200/60" : "bg-white border-indigo-100 shadow-indigo-100/50")}>
        <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center shrink-0 mr-4 mt-1",
          isAdvancedLocked ? "bg-slate-300 text-white" : "bg-indigo-500 text-white font-bold text-xl")}>
          {isAdvancedLocked ? <Lock className="w-5 h-5" /> : "3"}
        </div>
        <div className="flex-1 mt-1">
          <h3 className={clsx("font-bold", isAdvancedLocked ? "text-slate-500" : "text-slate-800")}>Advanced Level</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAdvancedLocked ? "Locked" : `${advancedCompleted} / ${advancedTotal} Steps Completed`}
          </p>
          {!isAdvancedLocked && (
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-2">
               <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${(advancedCompleted / (advancedTotal || 1)) * 100}%` }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
