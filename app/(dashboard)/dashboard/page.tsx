import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Flame, Trophy, BarChart3, Target, Zap } from 'lucide-react';
 
export const metadata: Metadata = {
  title: 'Student Dashboard — Boldmind EduCenter',
  robots: { index: false },
};
 
const API = process.env['NEXT_PUBLIC_API_URL']?.replace(/\/$/, '') ?? 'http://localhost:4000';
 
async function getDashboard() {
  try {
    const res = await fetch(`${API}/educenter/dashboard`, { credentials: 'include', cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? json;
  } catch { return null; }
}
 
async function getStreak() {
  try {
    const res = await fetch(`${API}/educenter/streak`, { credentials: 'include', cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? json;
  } catch { return null; }
}
 
export default async function EduDashboardPage() {
  const [dashboard, streak] = await Promise.all([getDashboard(), getStreak()]);
 
  const stats = {
    totalSessions:   dashboard?.totalSessions   ?? 0,
    avgScore:        dashboard?.avgScore        ?? 0,
    questionsAnswered: dashboard?.questionsAnswered ?? 0,
    currentStreak:   streak?.currentStreak      ?? 0,
    bestStreak:      streak?.bestStreak         ?? 0,
    todayTarget:     streak?.dailyGoal          ?? 20,
    todayCompleted:  streak?.todayCompleted      ?? 0,
  };
 
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--product-primary)' }}>Student Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--product-foreground)', opacity: 0.6 }}>
            Track your exam preparation progress
          </p>
        </div>
        <Link href="/dashboard/cbt"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-all"
          style={{ backgroundColor: 'var(--product-primary)' }}>
          <Zap size={16} />Start CBT Session
        </Link>
      </div>
 
       
      {stats.currentStreak > 0 && (
        <div className="flex items-center gap-4 p-5 rounded-2xl"
             style={{ background: 'linear-gradient(135deg, var(--product-primary), color-mix(in srgb, var(--product-primary) 75%, black))', color: 'white' }}>
          <span className="text-4xl">🔥</span>
          <div>
            <p className="font-black text-xl">{stats.currentStreak}-Day Streak! Keep it up!</p>
            <p className="text-sm opacity-75">Best: {stats.bestStreak} days · Today: {stats.todayCompleted}/{stats.todayTarget} questions</p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-2xl font-black">{Math.round((stats.todayCompleted / stats.todayTarget) * 100)}%</div>
            <div className="text-xs opacity-60">Today's goal</div>
          </div>
        </div>
      )}
 
    
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: 'Sessions', value: stats.totalSessions },
          { icon: Target,   label: 'Avg Score', value: `${stats.avgScore}%` },
          { icon: BarChart3,label: 'Questions',  value: stats.questionsAnswered.toLocaleString() },
          { icon: Flame,    label: 'Streak',     value: `${stats.currentStreak}d` },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-5 border-2"
               style={{ backgroundColor: 'var(--product-background)', borderColor: 'var(--product-muted)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                   style={{ backgroundColor: 'var(--product-highlight)', color: 'var(--product-primary)' }}>
                <s.icon size={16} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest"
                    style={{ color: 'var(--product-foreground)', opacity: 0.5 }}>{s.label}</span>
            </div>
            <p className="text-3xl font-black" style={{ color: 'var(--product-foreground)' }}>{s.value}</p>
          </div>
        ))}
      </div>
 
    
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { href: '/dashboard/practice',    emoji: '📚', label: 'JAMB Practice',    sub: '10,000+ questions' },
          { href: '/dashboard/waec-neco',   emoji: '📝', label: 'WAEC/NECO',        sub: 'All subjects covered' },
          { href: '/dashboard/cbt',         emoji: '🖥️', label: 'CBT Simulator',    sub: 'Real exam experience' },
          { href: '/dashboard/ai-tutor',    emoji: '🤖', label: 'AI Tutor',          sub: 'Get instant help' },
        ].map(q => (
          <Link key={q.href} href={q.href}
            className="flex items-center gap-3 p-4 rounded-xl border-2 transition-all hover:shadow-md quick-link-card"
            style={{ borderColor: 'var(--product-muted)', backgroundColor: 'var(--product-background)' }}>
            <span className="text-2xl">{q.emoji}</span>
            <div>
              <p className="font-bold text-sm" style={{ color: 'var(--product-foreground)' }}>{q.label}</p>
              <p className="text-xs" style={{ color: 'var(--product-foreground)', opacity: 0.5 }}>{q.sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
