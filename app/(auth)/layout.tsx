'use client';

import { motion } from 'framer-motion';
import { SuperNavbar, SuperFooter } from '@boldmindng/ui';
import Link from 'next/link';
import { AuthProvider } from '@/lib/auth';
import { ReactNode } from 'react';

// Background dots pattern
const DotsPattern = () => (
  <div className="absolute inset-0 overflow-hidden opacity-[0.15]">
    <div className="absolute inset-0" style={{
      backgroundImage: 'radial-gradient(circle, #FFC800 1.5px, transparent 1.5px)',
      backgroundSize: '32px 32px'
    }} />
  </div>
);

// Animated floating circles
const FloatingCircles = () => (
  <>
    <motion.div
      className="absolute top-10 left-10 w-72 h-72 rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(255, 200, 0, 0.15) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }}
      animate={{
        y: [0, 20, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute bottom-20 right-10 w-96 h-96 rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(42, 74, 110, 0.2) 0%, transparent 70%)',
        filter: 'blur(60px)',
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, -20, 0],
        scale: [1, 1.15, 1]
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(0, 168, 89, 0.1) 0%, transparent 70%)',
        filter: 'blur(50px)',
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 0.8, 0.5]
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  </>
);

// Enhanced Testimonial Component
const Testimonial = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.8, duration: 0.6 }}
    className="relative group"
  >
    {/* Glow effect */}
    <div className="absolute -inset-1 bg-gradient-to-r from-[#FFC800]/20 via-transparent to-[#00A859]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

    <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFC800]/5 via-transparent to-[#00A859]/5 pointer-events-none" />

      {/* Quote icon */}
      <div className="absolute top-4 right-4 text-[#FFC800]/20">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>

      {/* Stars */}
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.span
            key={star}
            className="text-[#FFC800] text-sm"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + (star * 0.1) }}
          >
            ★
          </motion.span>
        ))}
        <span className="ml-2 text-white/40 text-xs font-medium tracking-wider">VERIFIED</span>
      </div>

      <blockquote className="relative z-10 mb-4">
        <p className="text-white/90 text-base leading-relaxed font-light">
          "Educenter helped me score 298<span className="text-[#FFC800] font-medium">and get into Medicine!</span> The CBT simulator was exactly like the real exam."
        </p>
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-white/10">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFC800] to-[#FF6B00] flex items-center justify-center text-[#00143C] font-bold text-sm shadow-lg shadow-[#FFC800]/20">
            CO
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#00A859] border-2 border-[#0A1F4F] rounded-full" />
        </div>
        <div>
          <p className="font-bold text-white text-sm">Chinyere Okafor</p>
          <p className="text-white/50 text-xs">Medicine & Surgery, UNILAG</p>
        </div>
      </div>
    </div>
  </motion.div>
);

// Stats Component
const StatsDisplay = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5, duration: 0.6 }}
    className="grid grid-cols-3 gap-4"
  >
    {[
      { value: '50k+', label: 'Active', delay: 0.6 },
      { value: '10k+', label: 'Practice Question', delay: 0.7 },
      { value: '95%', label: 'Exam Success Rate', delay: 0.8 },
    ].map((stat, index) => (
      <motion.div
        key={index}
        className="text-center p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: stat.delay, duration: 0.4 }}
        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
      >
        <div className="text-xl font-black text-[#FFC800] mb-1">{stat.value}</div>
        <div className="text-white/60 text-xs font-medium uppercase tracking-wider">{stat.label}</div>
      </motion.div>
    ))}
  </motion.div>
);

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <SuperNavbar
          logoSrc="/logo.png"
          theme="dark"
          sticky={true}
          showThemeControls={true}
          links={[
            { href: '/', label: 'Home' },
            { href: '/pricing', label: 'Pricing' },
            { href: '/community', label: 'Community' },
          ]}
          cta={{
            href: '/register',
            label: 'Get Started',
            variant: 'primary'
          }}
        />

        {/* Main Auth Content */}
        <div className="flex-1 flex overflow-hidden">
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#00143C] via-[#0A1F4F] to-[#1a365d] relative overflow-hidden">
            <FloatingCircles />
            <DotsPattern />

            <div className="relative z-10 flex flex-col p-12 w-full h-full">
              <div className="flex-1 flex flex-col justify-center gap-8">
                {/* Heading Section */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  <h2 className="text-4xl font-black text-white mb-6 leading-tight">
                    Boldmind EduCenter - Ace Exams
                    <br />
                    Build Business <span className="text-[#FFC800]">Master AI</span>
                  </h2>
                  <p className="text-white/70 text-lg max-w-md leading-relaxed">
                    Join  Nigeria's most comprehensive ed-tech platform. From JAMB
                    excellence to digital business mastery and AI skills -
                    everything you need for 21st century success..
                  </p>
                </motion.div>

                {/* Stats Section */}
                <div>
                  <StatsDisplay />
                </div>

                {/* Testimonial Section */}
                <div>
                  <Testimonial />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-gray-950 relative overflow-y-auto">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md mt-16 lg:mt-0"
            >
              {children}
            </motion.div>

            {/* Mobile Back Link */}
            <div className="lg:hidden absolute bottom-6 left-6 right-6 text-center">
              <Link
                href="/"
                className="text-gray-500 hover:text-[#00143C] dark:hover:text-white text-sm transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>

        <SuperFooter
          logoSrc="/logo.png"
          newsletter={true}
          showStats={false}
          className="bg-[#00143C]"
        />
      </div>
    </AuthProvider>
  );
}