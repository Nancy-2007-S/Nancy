'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';

export default function AuthProvider({ children }) {
  const { loading: authLoading } = useAuth();
  const { profileLoaded } = useStore();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7ff]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return children;
}


