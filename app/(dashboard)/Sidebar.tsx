'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { authApi } from '@/lib/auth';
import type { AuthUser, TokenPair } from '@/lib/auth';

import { cn } from '@boldmindng/ui';
import { toast } from 'sonner';

import {
  LayoutDashboard, BookOpen, Target, BarChart3,
  GraduationCap, Trophy, Brain, Settings, X, LogOut,
} from 'lucide-react';

// ────────────────────────────────────────────────────────────
// Navigation
// ────────────────────────────────────────────────────────────
const NAV = [
  { href: '/dashboard',             label: 'Overview',   icon: LayoutDashboard, badge: null },
  { href: '/dashboard/practice',    label: 'JAMB Prep',  icon: BookOpen,        badge: '10K+' },
  { href: '/dashboard/waec-neco',   label: 'WAEC/NECO',  icon: Target,          badge: null },
  { href: '/dashboard/cbt',         label: 'CBT Mode',   icon: BarChart3,       badge: 'NEW' },
  { href: '/dashboard/courses',     label: 'Courses',    icon: GraduationCap,   badge: null },
  { href: '/dashboard/leaderboard', label: 'Leaderboard',icon: Trophy,          badge: null },
  { href: '/dashboard/ai-tutor',    label: 'AI Tutor',   icon: Brain,           badge: 'AI' },
  { href: '/dashboard/progress',    label: 'Progress',   icon: BarChart3,       badge: null },
  { href: '/dashboard/settings',    label: 'Settings',   icon: Settings,        badge: null },
];

interface StudentSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

// ────────────────────────────────────────────────────────────
// Sidebar Component
// ────────────────────────────────────────────────────────────
export function StudentSidebar({ open = false, onClose }: StudentSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokens, setTokens] = useState<TokenPair | null>(null);
  const [loading, setLoading] = useState(true);

  // ─── Load user + tokens ────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem('auth_tokens');

    if (!stored) {
      setLoading(false);
      return;
    }

    try {
      const parsed: TokenPair = JSON.parse(stored);
      setTokens(parsed);

      authApi.getMe(parsed.accessToken)
        .then(setUser)
        .catch(() => {
          setUser(null);
          localStorage.removeItem('auth_tokens');
        })
        .finally(() => setLoading(false));

    } catch {
      localStorage.removeItem('auth_tokens');
      setLoading(false);
    }
  }, []);

  // ─── Derived values ────────────────────────────────────────
  const initials =
    user
      ? [user.name?.[0]]
          .filter(Boolean)
          .join('')
          .toUpperCase()
      : 'S';

  const displayName =
    user?.name ||
    user?.email?.split('@')[0] ||
    'Student';

  // ─── Logout ───────────────────────────────────────────────
  const handleSignOut = async () => {
    try {
      if (tokens?.refreshToken) {
        await authApi.logout(tokens.refreshToken);
      }

      localStorage.removeItem('auth_tokens');
      router.push('/');
    } catch {
      toast.error('Sign out failed');
    }
  };

  // ──────────────────────────────────────────────────────────
  return (
    <aside
      className={cn(
        'flex flex-col h-screen border-r z-40 transition-transform duration-300',
        'md:sticky md:top-0 md:w-64 md:translate-x-0',
        'fixed top-0 left-0 bottom-0 w-72',
        open ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0',
      )}
      style={{
        backgroundColor: 'var(--product-background)',
        borderColor: 'var(--product-muted)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between h-16 px-5 flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, var(--product-primary), color-mix(in srgb, var(--product-primary) 75%, black))',
        }}
      >
        <Link href="/dashboard" className="flex items-center gap-2.5 no-underline">
          <div className="relative w-8 h-8">
            <Image src="/logo.png" alt="EduCenter" fill className="object-contain" />
          </div>
          <span className="font-black text-white text-sm tracking-tight">
            EduCenter
          </span>
        </Link>

        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15"
        >
          <X size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV.map(item => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: isActive ? 'var(--product-highlight)' : undefined,
                color: isActive ? 'var(--product-primary)' : 'var(--product-foreground)',
                opacity: isActive ? 1 : 0.65,
              }}
            >
              <item.icon size={17} />
              <span className="flex-1">{item.label}</span>

              {item.badge && (
                <span
                  className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: 'var(--product-primary)',
                    color: 'white',
                  }}
                >
                  {item.badge}
                </span>
              )}

              {isActive && (
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--product-primary)' }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div
        className="flex-shrink-0 border-t px-3 pb-3 pt-2 space-y-1"
        style={{ borderColor: 'var(--product-muted)' }}
      >
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
          style={{ backgroundColor: 'var(--product-muted)' }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white"
            style={{ backgroundColor: 'var(--product-primary)' }}
          >
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-bold truncate"
              style={{ color: 'var(--product-foreground)' }}
            >
              {loading ? 'Loading...' : displayName}
            </p>

            <p
              className="text-[11px]"
              style={{
                color: 'var(--product-foreground)',
                opacity: 0.5,
              }}
            >
              Student
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium"
          style={{ color: 'var(--color-error)', opacity: 0.75 }}
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}