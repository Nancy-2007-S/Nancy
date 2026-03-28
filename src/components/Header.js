'use client';
import { useStore } from '@/store/useStore';

export default function Header() {
  const { userProfile } = useStore();

  return (
    <div className="mb-6 pt-6 flex flex-col items-start px-2">
      <h1 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">Your {userProfile.goal} Roadmap</h1>
      <p className="text-slate-600 text-[15px]">
        Welcome back, <span className="font-semibold text-slate-800">{userProfile.name}</span>! 
        Here&apos;s your personalized learning path to become a <span className="font-semibold">{userProfile.goal}</span>.
        Complete steps to unlock the next level.
      </p>
    </div>
  );
}
