'use client';
import { useStore } from '@/store/useStore';

export default function Header() {
  const { userProfile } = useStore();

  return (
    <div className="mb-6 pt-4 md:pt-6 flex flex-col items-start px-2">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 md:mb-3 tracking-tight leading-tight">Your {userProfile.goal} Roadmap</h1>
      <p className="text-slate-600 text-sm md:text-[15px] leading-relaxed">
        Welcome back, <span className="font-semibold text-slate-800">{userProfile.name}</span>! 
        Here&apos;s your personalized learning path to become a <span className="font-semibold">{userProfile.goal}</span>.
      </p>
    </div>
  );
}
