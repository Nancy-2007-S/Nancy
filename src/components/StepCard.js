'use client';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/lib/useAuth';
import { isStepUnlocked } from '@/lib/dagUtils';
import { Check, CheckCircle, Lock, Play, BookOpen, FileText } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export default function StepCard({ step, index, edges }) {
  const { user } = useAuth();
  const { progress, completeStep } = useStore();
  
  const completedNodes = progress?.completedNodes || [];

  const isCompleted = completedNodes.includes(step.id);
  const isUnlocked = isStepUnlocked(step.id, completedNodes, edges);

  const handleComplete = () => {
    if (isUnlocked && !isCompleted && user) {
      completeStep(step.id, user.uid);
    }
  };

  const IconMap = {
    youtube: <Play className="w-4 h-4 text-red-500" />,
    article: <BookOpen className="w-4 h-4 text-emerald-500" />,
    course: <Play className="w-4 h-4 text-indigo-500" />,
    email: <FileText className="w-4 h-4 text-slate-500" />
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative flex items-start group w-full"
    >
      {/* Connector Line */}
      {index !== 0 && (
        <div className={clsx("absolute -top-6 left-4 md:left-5 border-l-2 h-6 z-0", 
          isUnlocked ? "border-emerald-400" : "border-slate-200"
        )}></div>
      )}

      {/* Node / Marker */}
      <div className="z-10 mt-1 mb-6 shrink-0 bg-white">
        {isCompleted ? (
          <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-emerald-500" />
        ) : isUnlocked ? (
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-slate-300 flex items-center justify-center bg-white shadow-sm">
             <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-slate-200 group-hover:bg-slate-300 transition-colors"></div>
          </div>
        ) : (
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-slate-200 bg-slate-50 flex items-center justify-center">
            <Lock className="w-3 md:w-4 h-3 md:h-4 text-slate-400" />
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className={clsx("ml-3 md:ml-6 flex-1 rounded-xl md:rounded-2xl border mb-6 transition-all min-w-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 transition-colors", 
        step.isNew ? "bg-amber-50/60 border-amber-300 shadow-md shadow-amber-100 ring-2 ring-amber-200 ring-offset-1" :
        isCompleted ? "bg-[#f8fcfa] dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 shadow-sm" : 
        isUnlocked ? "shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md" : 
        "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-80"
      )}>
        {step.isNew && (
          <div className="flex items-center gap-2 px-4 pt-3">
            <span className="text-xs font-bold text-amber-600 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse inline-block" />
              AI Added
            </span>
          </div>
        )}
        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Step {index + 1}</span>
            </div>
            <h4 className={clsx("font-semibold text-lg", isUnlocked ? "text-slate-800" : "text-slate-500")}>
              {step.title}
            </h4>
            <p className={clsx("text-sm mt-1", isUnlocked ? "text-slate-600" : "text-slate-400")}>
              {step.description}
            </p>
            {!isUnlocked && (
               <div className="mt-3 text-xs bg-slate-100 text-slate-500 inline-flex px-3 py-1.5 rounded-lg">
                 Locked: Required prior skills missing
               </div>
            )}
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 shrink-1">
             <div className="flex flex-wrap items-center gap-2">
               {step.resources?.map((res, i) => (
                 <a key={i} title={res.title || 'Resource link'} href={res.link || '#'} className={clsx("p-2 rounded-lg border", isUnlocked ? "bg-white border-slate-200 hover:bg-slate-50" : "bg-slate-100 border-transparent opacity-50 cursor-not-allowed")} onClick={e => !isUnlocked && e.preventDefault()}>
                    {IconMap[res.type] || <FileText className="w-4 h-4" />}
                 </a>
               ))}
               {step.resources?.length > 0 && <span className="text-[10px] md:text-xs text-slate-400 truncate max-w-[80px]">Resource</span>}
             </div>

             {isCompleted ? (
                <button className="flex items-center gap-1.5 text-sm font-semibold bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg border border-emerald-200 cursor-default">
                  <Check className="w-4 h-4" /> Completed
                </button>
             ) : (
                <button 
                  onClick={handleComplete}
                  disabled={!isUnlocked}
                  className={clsx("flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-colors border",
                    isUnlocked 
                      ? "bg-indigo-500 text-white border-indigo-500 shadow-sm shadow-indigo-500/20 hover:bg-indigo-600 cursor-pointer" 
                      : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                  )}
                >
                  {isUnlocked ? "Mark as complete" : "Locked"}
                </button>
             )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
