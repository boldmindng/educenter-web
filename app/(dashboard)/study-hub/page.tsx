'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import {
  GraduationCap,
  BookOpen,
  Trophy,
  TrendingUp,
  Clock,
  Users,
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';

export default function StudyHubPage() {
  const router = useRouter();
  const { user } = useAuth();

  const examTypes = [
    {
      name: 'JAMB',
      fullName: 'Joint Admissions and Matriculation Board',
      description: 'Prepare for your JAMB UTME examination with our specialized CBT simulator.',
      color: 'blue',
      gradient: 'from-blue-600 to-indigo-600',
      shadow: 'shadow-blue-500/10',
      icon: GraduationCap,
      features: ['200+ Past Questions', 'Real CBT Mode', 'Performance Analytics'],
    },
    {
      name: 'WAEC',
      fullName: 'West African Examinations Council',
      description: 'Master WAEC past questions and topics with detailed step-by-step solutions.',
      color: 'purple',
      gradient: 'from-purple-600 to-pink-600',
      shadow: 'shadow-purple-500/10',
      icon: BookOpen,
      features: ['500+ Past Questions', 'Subject-wise Practice', 'Detailed Solutions'],
    },
    {
      name: 'NECO',
      fullName: 'National Examinations Council',
      description: 'Excel in your NECO examinations with comprehensive year-wise practice.',
      color: 'orange',
      gradient: 'from-orange-500 to-red-600',
      shadow: 'shadow-orange-500/10',
      icon: Trophy,
      features: ['300+ Past Questions', 'Year-wise Practice', 'Progress Tracking'],
    },
  ];

  const handleExamTypeClick = (examType: string) => {
    router.push(`/study-hub/subjects?examType=${examType.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] pb-12 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      {/* Header Section */}
      <div className="relative pt-10 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8 group"
          >
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:border-blue-200 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </div>
            Back to Dashboard
          </Link>

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4 animate-fade-in">
              <div className="h-px w-8 bg-blue-600" />
              <span className="text-sm font-black text-blue-600 uppercase tracking-widest">Master Your Exams</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight animate-slide-in">
              The Study <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E3A5F] to-[#2A4A6E]">Hub</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 font-medium leading-relaxed animate-fade-in delay-200">
              Access over 10,000+ past questions for JAMB, WAEC & NECO. Practice in real-time and track your improvement.
            </p>

            {user && (
              <div className="flex items-center gap-12 animate-fade-in delay-300">
                <div className="space-y-1">
                  <p className="text-3xl font-black text-gray-900 dark:text-whiteTracking-tight">10k+</p>
                  <p className="text-gray-500 font-bold text-sm uppercase tracking-wider">Questions</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-black text-gray-900 dark:text-whiteTracking-tight">50+</p>
                  <p className="text-gray-500 font-bold text-sm uppercase tracking-wider">Subjects</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-black text-gray-900 dark:text-whiteTracking-tight">50k+</p>
                  <p className="text-gray-500 font-bold text-sm uppercase tracking-wider">Students</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {[
            { label: 'Practice Mode', value: 'CBT Simulator', icon: Clock, color: 'blue' },
            { label: 'Track Progress', value: 'Live Analytics', icon: TrendingUp, color: 'green' },
            { label: 'Compete', value: 'Leaderboard', icon: Trophy, color: 'orange' },
            { label: 'Community', value: 'Learn Together', icon: Users, color: 'purple' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-md rounded-3xl p-6 border border-white dark:border-gray-800 shadow-sm flex flex-col gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${stat.color}-100 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-lg font-black text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Exam Selection */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">Choose Your Examination</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Select an exam board to begin your practice journey.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {examTypes.map((exam, index) => (
              <button
                key={index}
                onClick={() => handleExamTypeClick(exam.name)}
                className="group relative bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 text-left"
              >
                <div className={`h-48 bg-gradient-to-br ${exam.gradient} p-8 relative overflow-hidden`}>
                  <exam.icon className="w-16 h-16 text-white mb-4 relative z-10" />
                  <h3 className="text-3xl font-black text-white relative z-10 uppercase tracking-tight">{exam.name}</h3>
                  <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-xl backdrop-blur-md border border-white/30 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                    <ArrowRight className="w-6 h-6 text-white" />
                  </div>
                  {/* Glass Orb in card */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 blur-[50px] rounded-full" />
                </div>

                <div className="p-8">
                  <p className="text-xs font-black text-[#2A4A6E] dark:text-[#FFC800] uppercase tracking-widest mb-1">{exam.fullName}</p>
                  <p className="text-gray-600 dark:text-gray-400 font-medium mb-8 leading-relaxed line-clamp-2">
                    {exam.description}
                  </p>

                  <div className="space-y-3">
                    {exam.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm font-bold text-gray-700 dark:text-gray-300">
                        <div className="w-5 h-5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                          <CheckCircle className="w-3 h-3" />
                        </div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-gray-400 group-hover:text-blue-600 transition-colors">
                    <span className="text-xs font-black uppercase tracking-widest">Start Practicing</span>
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Visual Call To Action */}
        <div className="bg-gray-900 dark:bg-white rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-4xl md:text-6xl font-black text-white dark:text-gray-900 mb-6 uppercase tracking-tighter">
              Ready to climb the <br /> <span className="text-blue-500">Leaderboard?</span>
            </h3>
            <p className="text-gray-400 dark:text-gray-500 text-lg mb-10 max-w-xl mx-auto font-medium">
              Join thousands of students competing for the top spot. See where you stand nationally!
            </p>
            <Link
              href="/study-hub/leaderboard"
              className="inline-flex items-center gap-3 bg-[#00143C] text-white px-10 py-5 rounded-[2rem] font-black text-lg hover:scale-105 transition-all shadow-xl shadow-blue-500/20"
            >
              <Trophy className="w-6 h-6" />
              View Leaderboard
            </Link>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 blur-[150px] opacity-20 rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 blur-[150px] opacity-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

