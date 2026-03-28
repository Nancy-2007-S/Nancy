import './globals.css';
import { Inter } from 'next/font/google';
import AuthProvider from '@/components/AuthProvider';
import { ToastProvider } from '@/components/ToastProvider';
import ThemeToggle from '@/components/ThemeToggle';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Career Mentor',
  description: 'AI-Driven Career Mentor Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#f4f7ff] text-slate-800 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-300`}>
        <ToastProvider>
          <AuthProvider>
            {children}
            <ThemeToggle />
          </AuthProvider>
        </ToastProvider>
      </body>

    </html>
  );
}
