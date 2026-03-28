'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useStore } from '@/store/useStore';

export default function Navbar() {
  const pathname = usePathname();
  const { userProfile } = useStore();

  const photoURL = userProfile?.photoURL;
  const initials = (userProfile?.name || 'U').charAt(0).toUpperCase();

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-[#fcfdff] shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-bl from-amber-400 via-rose-500 to-indigo-500 flex items-center justify-center p-0.5">
           <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
             <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
           </div>
        </div>
        <span className="font-bold text-xl text-slate-800 tracking-tight">Career Mentor</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm pt-1">
        <Link href="/" className={pathname === '/' ? "text-emerald-600 font-semibold border-b-[3px] border-emerald-500 pb-1" : "text-slate-500 hover:text-indigo-600 font-medium"}>Dashboard</Link>
        <Link href="/recommendations" className={pathname === '/recommendations' ? "text-emerald-600 font-semibold border-b-[3px] border-emerald-500 pb-1" : "text-slate-500 hover:text-indigo-600 font-medium"}>Recommendations</Link>
        <Link href="/profile" className={pathname === '/profile' ? "text-emerald-600 font-semibold border-b-[3px] border-emerald-500 pb-1" : "text-slate-500 hover:text-indigo-600 font-medium"}>Profile</Link>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/profile" className="flex items-center gap-2 pr-2 pl-1 py-1 group" title="Edit profile picture">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-100 bg-indigo-50 flex items-center justify-center">
            {photoURL ? (
              <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-indigo-500">{initials}</span>
            )}
          </div>
        </Link>
        <button 
          onClick={() => signOut(auth)}
          className="flex items-center justify-center p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}
