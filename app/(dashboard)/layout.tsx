'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { clearRefreshToken, useAuthStore } from '@/lib/auth';
import { boldMindAPI } from '@boldmindng/api-client';

import {
  BookOpen,
  TrendingUp,
  Sparkles,
  LayoutDashboard,
  CreditCard,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [displayName, setDisplayName] = useState('Student');
  const [initials, setInitials] = useState('S');

  // Theme — runs after mount only (avoids hydration mismatch)
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    setIsDark(theme === 'dark');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  // Load user display info from the SSO cookie session
  useEffect(() => {
    boldMindAPI.auth.me()
      .then((user: any) => {
        if (!user) return;
        const name = user.name || user.email?.split('@')[0] || 'Student';
        setDisplayName(name);
        setInitials(name[0]?.toUpperCase() || 'S');
      })
      .catch(() => {});
  }, []);

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', !isDark);
  };

  const handleLogout = () => {
    clearRefreshToken();
    useAuthStore.getState().clearSession();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const navigation = [
    { name: 'Dashboard',       href: '/dashboard',       icon: LayoutDashboard, current: pathname === '/dashboard' },
    { name: 'Study Hub',       href: '/study-hub',       icon: BookOpen,        current: pathname?.startsWith('/study-hub') },
    { name: 'Business School', href: '/business-school', icon: TrendingUp,      current: pathname?.startsWith('/business-school') },
    { name: 'AI Skills Lab',   href: '/ai-lab',          icon: Sparkles,        current: pathname?.startsWith('/ai-lab') },
    { name: 'Subscriptions',   href: '/subscription',    icon: CreditCard,      current: pathname === '/subscription' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F1E35]">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#00143C] flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="relative w-8 h-8">
              <Image src="/logo.png" alt="EduCenter" fill className="object-contain" />
            </div>
            <span className="font-black text-white text-base tracking-tight">EduCenter</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  item.current
                    ? 'bg-[#FFC800] text-[#00143C] font-bold shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User + footer */}
        <div className="px-3 pb-4 pt-2 border-t border-white/10 space-y-0.5">
          {/* User pill */}
          <div className="flex items-center gap-3 px-4 py-3 mb-1">
            <div className="w-8 h-8 rounded-full bg-[#FFC800] flex items-center justify-center text-xs font-black text-[#00143C]">
              {initials}
            </div>
            <span className="text-sm font-medium text-white/80 truncate">{displayName}</span>
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile top bar */}
        <header className="lg:hidden bg-[#00143C] px-4 py-3 flex items-center justify-between shadow-md">
          <button onClick={() => setSidebarOpen(true)} className="text-white p-1">
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="relative w-7 h-7">
              <Image src="/logo.png" alt="EduCenter" fill className="object-contain" />
            </div>
            <span className="font-black text-white text-sm">EduCenter</span>
          </Link>
          <div className="w-8" />
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
