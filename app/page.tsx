"use client";


import { motion } from "framer-motion";
import { SuperNavbar, SuperFooter } from "@boldmindng/ui";
import {
  BookOpen,
  Award,
  TrendingUp,
  Users,
  CheckCircle,
  Star,
  ArrowRight,
  PlayCircle,
  Brain,
  Video,
  Zap,
  MessageSquare,
  BarChart3,
  Target,
  Shield,
  Clock,
  FileText,
  Rocket,
  GraduationCap,
  Calculator,
  Bot,
  Palette,
  Store,
  Users2,
  TrendingUp as TrendingUpIcon,
  Sparkles,
  Twitter,
  Facebook,
  Instagram,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function EduCenterHomePage() {
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex(
        (prev) => (prev + 1) % coreFeatures.flatMap((f) => f.features).length,
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/pricing", label: "Pricing" },
    { href: "https://amebogist.ng", label: "Blog", isExternal: true },
    { href: "https://villagecircle.ng", label: "Community", isExternal: true },
    { href: "/login", label: "Login" },
  ];

  const footerSections = [
    {
      title: "📚 EXAM PREP",
      links: [
        { href: "/register", label: "Get Started" },
        { href: "/login", label: "Login to Practice" },
        { href: "/pricing", label: "View Plans" },
      ],
    },
    {
      title: "💼 PLATFORM",
      links: [
        { href: "/register", label: "Create Account" },
        { href: "/login", label: "Sign In" },
        { href: "/pricing", label: "Pricing" },
      ],
    },
    {
      title: "🌍 ECOSYSTEM",
      links: [
        { href: "https://amebogist.ng", label: "Blog (AmeboGist)", isExternal: true },
        { href: "https://villagecircle.ng", label: "Community (VillageCircle)", isExternal: true },
        { href: "https://villagecircle.ng/vibecoders", label: "Vibe Coders Bootcamp ↗", isExternal: true },
        { href: "https://boldmind.ng", label: "BoldMind Ecosystem", isExternal: true },
      ],
    },
    {
      title: "📋 LEGAL",
      links: [
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms of Service" },
      ],
    },
  ];

  const coreFeatures = [
    {
      category: "📚 Exam Excellence",
      features: [
        { text: "JAMB/WAEC/NECO Past Questions (10,000+)", icon: BookOpen },
        { text: "Subject-Based Practice & Mock Exams", icon: FileText },
        {
          text: "CBT Simulation Mode (Real Exam Experience)",
          icon: Calculator,
        },
        { text: "Performance Tracking & Analytics Dashboard", icon: BarChart3 },
        { text: "Study Streak System & Daily Goals", icon: Target },
        { text: "Random Practice (5 free attempts daily)", icon: Zap },
        { text: "National Leaderboard & Competition", icon: TrendingUpIcon },
      ],
    },
    {
      category: "💼 Business Mastery",
      features: [
        { text: "Course Library (Free & Premium)", icon: BookOpen },
        { text: "Sales Funnel Templates", icon: TrendingUp },
        { text: "WhatsApp Automation Guides", icon: MessageSquare },
        { text: "Marketing Playbooks & Strategies", icon: Award },
        { text: "Expert-Led Masterclasses", icon: GraduationCap },
        { text: "Business Community Access", icon: Users2 },
      ],
    },
    {
      category: "🤖 AI-Powered Learning",
      features: [
        { text: "AI Video Generation Tool", icon: Video },
        { text: "Prompt Engineering Course", icon: Brain },
        { text: "WhatsApp AI Automation", icon: Bot },
        { text: "Content Creation Suite", icon: Palette },
        { text: "AI Tools Marketplace", icon: Store },
        { text: "AI Skills Certification", icon: Shield },
      ],
    },
  ];

  const learningPaths = [
    {
      title: "JAMB Aspirant",
      icon: "🎯",
      description: "Score 300+ in JAMB 2026",
      href: "/study-hub",
      steps: [
        "Diagnostic Test",
        "Personalized Plan",
        "Daily Practice",
        "Mock Exams",
        "Final Prep",
      ],
      duration: "3-6 months",
      students: "25K+",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Business Builder",
      icon: "💼",
      description: "Start & Scale Digital Business",
      href: "/business-school",
      steps: [
        "Idea Validation",
        "Sales Funnels",
        "Automation",
        "Marketing",
        "Scaling",
      ],
      duration: "2-4 months",
      students: "8K+",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "AI Specialist",
      icon: "🤖",
      description: "Master AI Tools for Career",
      href: "/subscription",
      steps: [
        "AI Fundamentals",
        "Prompt Engineering",
        "Automation",
        "Content Creation",
        "Portfolio",
      ],
      duration: "1-3 months",
      students: "12K+",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "WAEC Excellence",
      icon: "🏆",
      description: "Ace All WAEC Subjects",
      href: "/study-hub",
      steps: [
        "Weakness Analysis",
        "Topic Mastery",
        "Past Papers",
        "Time Management",
        "Exam Strategy",
      ],
      duration: "4-8 months",
      students: "18K+",
      color: "from-orange-500 to-red-500",
    },
  ];

  const stats = [
    {
      value: "50K+",
      label: "Active Students",
      icon: Users,
      trend: "+35% this month",
    },
    {
      value: "10K+",
      label: "Practice Questions",
      icon: BookOpen,
      trend: "Updated Weekly",
    },
    {
      value: "95%",
      label: "Exam Success Rate",
      icon: Award,
      trend: "Of our students",
    },
    {
      value: "4.8/5",
      label: "Student Rating",
      icon: Star,
      trend: "Based on 2K reviews",
    },
    {
      value: "₦60M+",
      label: "Revenue Generated",
      icon: TrendingUp,
      trend: "For our partners",
    },
    {
      value: "24/7",
      label: "Support Available",
      icon: Clock,
      trend: "Via WhatsApp",
    },
  ];

  const testimonials = [
    {
      name: "Chinyere Okafor",
      score: "298/400",
      image: "👩‍⚕️",
      text: "EduCenter helped me score 298 and get into Medicine! The CBT simulator was exactly like the real exam.",
      subject: "Medicine & Surgery, UNILAG",
      feature: "JAMB CBT Simulator",
    },
    {
      name: "Olumide Adeyemi",
      score: "315/400",
      image: "👨‍💻",
      text: "From 180 to 315! The performance analytics showed me exactly where to improve. Best ₦3k I ever spent.",
      subject: "Computer Science, UI",
      feature: "Performance Analytics",
    },
    {
      name: "Fatima Abubakar",
      score: "210/400",
      image: "👩‍⚖️",
      text: "The WhatsApp AI automation course helped me start a digital business while preparing for Law school.",
      subject: "Law, ABU",
      feature: "Business + AI Tools",
    },
    {
      name: "Emeka Nwosu",
      score: "305/400",
      image: "👨‍🔬",
      text: "10,000+ past questions with detailed explanations. I practiced every topic until I mastered it.",
      subject: "Engineering, FUTA",
      feature: "Question Bank",
    },
  ];


  const [activeStep, setActiveStep] = useState(0);

  const howItWorks = [
    {
      step: "01",
      title: "Create Your Free Account",
      desc: "Sign up in 30 seconds. No credit card. Pick your exam target — JAMB, WAEC, NECO, or GCE.",
      icon: Rocket,
      color: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50",
      detail: ["Instant access to 500 free questions", "Diagnostic test to find your weak spots", "Personalised study plan generated automatically"],
    },
    {
      step: "02",
      title: "Practice & Learn Daily",
      desc: "Use CBT simulation, past questions, video lessons, and AI-powered explanations to master every topic.",
      icon: Brain,
      color: "from-purple-500 to-pink-500",
      bg: "bg-purple-50",
      detail: ["10,000+ past questions with full explanations", "Track streaks and earn daily XP", "Business & AI courses alongside exam prep"],
    },
    {
      step: "03",
      title: "Hit Your Target Score",
      desc: "Watch your performance analytics climb. Compete on the national leaderboard. Walk into your exam confident.",
      icon: Target,
      color: "from-green-500 to-emerald-500",
      bg: "bg-green-50",
      detail: ["Real-time analytics on every subject", "Mock exams with timer (CBT mode)", "Certificate of completion for business courses"],
    },
  ];

  const handleNavClick = (href: string) => {
    // Log navigation for analytics
    if (process.env.NODE_ENV === 'development') {
      console.log("Navigating to:", href);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <SuperNavbar
        links={navLinks}
        cta={{
          href: "/register",
          label: "Sign Up",
          variant: "secondary",
        }}
        logoSrc="/logo.png"
        showThemeControls={true}
        onLinkClick={handleNavClick}
      />

      {/* Hero Section - Redesigned */}
      <section className="relative bg-gradient-to-br from-[#1E3A5F] via-[#2A4A6E] to-[#0F2744] text-white overflow-hidden pt-20 pb-20 md:pt-24 md:pb-32">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-10 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-2xl" />
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 right-20 animate-float">
          <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center">
            <div className="text-2xl">🎯</div>
          </div>
        </div>
        <div className="absolute bottom-40 left-20 animate-float-delayed">
          <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center">
            <div className="text-xl">📈</div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Trust badge */}
              <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-lg rounded-2xl mb-8 border border-white/20">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="font-bold text-sm sm:text-base">LIVE Platform</span>
                </div>
                <div className="hidden sm:block h-6 w-px bg-white/30" />
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="font-bold text-sm sm:text-base">50K+ Students</span>
                </div>
                <div className="hidden sm:block h-6 w-px bg-white/30" />
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <span className="font-bold text-sm sm:text-base">₦60M+ Revenue</span>
                </div>
              </div>

              {/* Main headline */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                Ace Exams.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-300 to-purple-400 animate-gradient">
                  Build Business.
                </span>
                <br />
                Master AI.
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
                Nigeria's most comprehensive ed-tech platform. From JAMB
                excellence to digital business mastery and AI skills -
                everything you need for 21st century success.
              </p>

              {/* Dynamic feature highlight */}
              <motion.div
                key={currentFeatureIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium">
                    Featured:{" "}
                    {
                      coreFeatures.flatMap((f) => f.features)[
                        currentFeatureIndex
                      ]?.text
                    }
                  </span>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/register"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl transition-all shadow-lg"
                >
                  Start Free Trial (₦0)
                  <ArrowRight className="w-5 h-5" />
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://wa.me/2349138349271"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 border-2 border-white/30 text-white font-bold text-lg rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm"
                >
                  <PlayCircle className="w-5 h-5" />
                  Chat on WhatsApp
                </motion.a>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>7-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </motion.div>

            {/* Right side - Interactive dashboard preview */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative lg:mt-0"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-5 sm:p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <div className="text-2xl">🎓</div>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">Student Dashboard</h3>
                      <p className="text-sm text-gray-300">Live Preview</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
                    LIVE
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {stats.slice(0, 4).map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="bg-white/5 p-4 rounded-xl border border-white/10"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <stat.icon className="w-4 h-4" />
                        <div className="text-2xl font-black">{stat.value}</div>
                      </div>
                      <div className="text-xs text-gray-300">{stat.label}</div>
                      <div className="text-xs text-green-400 mt-1">
                        {stat.trend}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>JAMB Progress</span>
                    <span className="font-bold">78%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "78%" }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="/study-hub"
                    className="p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-center text-sm transition-colors"
                  >
                    Practice Now
                  </a>
                  <a
                    href="/business-school"
                    className="p-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-center text-sm transition-colors"
                  >
                    Explore Courses
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="text-3xl md:text-4xl font-black text-[#2A4A6E] mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
                <div className="text-xs text-green-600 font-medium mt-1">
                  {stat.trend}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-[#2A4A6E] mb-6">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From exam prep to business skills and AI mastery - we've got you
              covered
            </p>
          </div>

          {coreFeatures.map((category, catIndex) => (
            <motion.div
              key={catIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIndex * 0.2 }}
              className="mb-16"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="text-3xl">
                  {category.category.split(" ")[0]}
                </div>
                <h3 className="text-3xl font-bold text-[#2A4A6E]">
                  {category.category.slice(2)}
                </h3>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.features.map((feature, featureIndex) => (
                  <motion.div
                    key={featureIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: featureIndex * 0.05 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="group p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 group-hover:from-blue-200 group-hover:to-blue-100 flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 mb-2">
                          {feature.text}
                        </h4>
                        <a
                          href="#"
                          className="text-blue-600 text-sm font-medium hover:underline inline-flex items-center gap-1"
                        >
                          Learn more
                          <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-[#2A4A6E] mb-6">
              Choose Your Success Path
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Structured learning journeys designed for specific goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {learningPaths.map((path, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${path.color} flex items-center justify-center text-3xl mb-6`}
                >
                  {path.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {path.title}
                </h3>
                <p className="text-gray-600 mb-6">{path.description}</p>

                <div className="space-y-3 mb-6">
                  {path.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                        {stepIndex + 1}
                      </div>
                      <span className="text-sm text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{path.duration}</span>
                  <span className="font-bold text-blue-600">
                    {path.students} students
                  </span>
                </div>

                <a
                  href={path.href}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Start This Path
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-[#2A4A6E] mb-6">
              Real Students, Real Results
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of students who transformed their future with
              EduCenter
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200 hover:border-blue-400 transition-colors"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-5xl">{testimonial.image}</div>
                  <div>
                    <h4 className="font-bold text-[#2A4A6E]">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.subject}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 italic leading-relaxed">
                  "{testimonial.text}"
                </p>

                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">
                    Used feature:
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    <Zap className="w-3 h-3" />
                    {testimonial.feature}
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-bold text-sm">
                  <Award className="w-4 h-4" />
                  JAMB: {testimonial.score}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BoldMind Flywheel / Ecosystem */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#0F2744] to-[#1E3A5F] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6 border border-white/20">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              The BoldMind Ecosystem
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              From Awareness to Enablement
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              EduCenter is one pillar of the BoldmindNG flywheel — four interconnected platforms designed to take you from knowing to doing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                step: "01",
                label: "Awareness",
                name: "AmeboGist NG",
                url: "https://amebogist.ng",
                emoji: "📰",
                color: "from-orange-500 to-amber-500",
                description: "Nigeria's trending stories, culture & entertainment. Where the conversation starts.",
                cta: "Read the Blog",
              },
              {
                step: "02",
                label: "Conviction",
                name: "VillageCircle NG",
                url: "https://villagecircle.ng",
                emoji: "🏘️",
                color: "from-green-500 to-emerald-500",
                description: "Peer community, accountability circles & the Vibe Coders bootcamp. Where resolve is built.",
                cta: "Join Community",
              },
              {
                step: "03",
                label: "Education",
                name: "Boldmind EduCenter",
                url: "/",
                emoji: "🎓",
                color: "from-blue-500 to-cyan-500",
                description: "Exam prep, digital business school & AI skills lab. Where transformation happens.",
                cta: "You are here",
                active: true,
              },
              {
                step: "04",
                label: "Enablement",
                name: "PlanAI by BoldmindNG",
                url: "https://planai.boldmind.ng",
                emoji: "⚡",
                color: "from-purple-500 to-pink-500",
                description: "Tools, APIs & infrastructure for creators and builders. Where ambition ships.",
                cta: "Explore Platform",
              },
            ].map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className={`relative bg-white/5 rounded-2xl p-6 border ${pillar.active ? "border-blue-400 ring-2 ring-blue-400/30" : "border-white/10"} hover:border-white/30 transition-all`}
              >
                {pillar.active && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 rounded-full text-xs font-bold whitespace-nowrap">
                    You're here
                  </div>
                )}
                <div className="text-xs font-bold text-white/40 mb-3 tracking-widest">STEP {pillar.step}</div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pillar.color} flex items-center justify-center text-2xl mb-4`}>
                  {pillar.emoji}
                </div>
                <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">{pillar.label}</div>
                <h3 className="text-xl font-bold mb-3">{pillar.name}</h3>
                <p className="text-sm text-blue-200 mb-5 leading-relaxed">{pillar.description}</p>
                {pillar.active ? (
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300">
                    <CheckCircle className="w-4 h-4" />
                    {pillar.cta}
                  </span>
                ) : (
                  <a
                    href={pillar.url}
                    target={pillar.url.startsWith("http") ? "_blank" : undefined}
                    rel={pillar.url.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-blue-300 transition-colors"
                  >
                    {pillar.cta}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>

          {/* Vibe Coders callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                💻
              </div>
              <div>
                <div className="text-xs font-bold text-green-400 uppercase tracking-wider mb-1">Coming Soon via VillageCircle</div>
                <h3 className="text-xl font-bold">Vibe Coders Bootcamp</h3>
                <p className="text-blue-200 text-sm mt-1">
                  A hands-on coding & tech entrepreneurship bootcamp for Nigerian youth.
                </p>
              </div>
            </div>
            <a
              href="https://villagecircle.ng/vibe-coders"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-colors"
            >
              Join Waitlist
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold mb-4 border border-blue-100">
              <Zap className="w-4 h-4" />
              Simple 3-step process
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#2A4A6E] mb-4">
              From Zero to Top Score
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Everything you need, in one place, in three steps.
            </p>
          </div>

          {/* Step tabs */}
          <div className="flex flex-col md:flex-row gap-3 mb-10 justify-center">
            {howItWorks.map((s, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl font-semibold transition-all text-left ${
                  activeStep === i
                    ? "bg-[#2A4A6E] text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span className={`text-xs font-black ${activeStep === i ? "text-blue-300" : "text-gray-400"}`}>
                  {s.step}
                </span>
                {s.title}
              </button>
            ))}
          </div>

          {/* Active step detail */}
          {howItWorks.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={activeStep === i ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.3 }}
              className={`${activeStep === i ? "block" : "hidden"}`}
            >
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <s.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-[#2A4A6E] mb-4">{s.title}</h3>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">{s.desc}</p>
                  <a
                    href="/register"
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold bg-gradient-to-r ${s.color} hover:shadow-lg transition-all`}
                  >
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
                <div className={`${s.bg} rounded-2xl p-8 border-2 border-gray-100`}>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">What you get</div>
                  <ul className="space-y-4">
                    {s.detail.map((d, di) => (
                      <li key={di} className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-700 font-medium">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Step dots */}
          <div className="flex justify-center gap-2 mt-10">
            {howItWorks.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`rounded-full transition-all ${activeStep === i ? "w-8 h-3 bg-[#2A4A6E]" : "w-3 h-3 bg-gray-300 hover:bg-gray-400"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-[#0F1E35]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left: Copy */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold mb-6 border border-green-500/30">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                50,000+ students already enrolled
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Your future starts
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"> tonight.</span>
              </h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Every day you wait is a day your competition is practising. Start free — no card, no risk, no regrets.
              </p>
              <div className="space-y-3">
                {[
                  "500 free questions, no credit card",
                  "Full CBT simulator for JAMB & WAEC",
                  "Business & AI courses included",
                  "National leaderboard & community",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {["👩‍⚕️","👨‍💻","👩‍⚖️","👨‍🔬"].map((e, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-[#0F1E35] flex items-center justify-center text-lg">
                      {e}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-400 mt-0.5">4.8 from 2,000+ reviews</p>
                </div>
              </div>
            </motion.div>

            {/* Right: Pricing card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                <div className="text-center mb-6">
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Start with</div>
                  <div className="text-6xl font-black text-[#2A4A6E]">₦0</div>
                  <div className="text-gray-500 mt-1">Free forever on the basics</div>
                </div>

                <div className="border-t border-gray-100 pt-6 mb-6 space-y-3">
                  {[
                    { label: "Practice Questions", value: "500 free" },
                    { label: "CBT Simulator", value: "✓ Included" },
                    { label: "Study Hub Access", value: "✓ Included" },
                    { label: "Business Courses", value: "Subscribe to unlock" },
                    { label: "AI Skills Lab", value: "Subscribe to unlock" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{row.label}</span>
                      <span className={`font-semibold ${row.value.startsWith("✓") ? "text-green-600" : row.value === "500 free" ? "text-blue-600" : "text-gray-400"}`}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                <a
                  href="/register"
                  className="block w-full text-center py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:shadow-xl transition-all mb-4"
                >
                  Create Free Account →
                </a>

                <a
                  href="https://wa.me/2349138349271"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-green-400 hover:text-green-600 transition-all text-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  Have questions? Chat on WhatsApp
                </a>

                <p className="text-center text-xs text-gray-400 mt-4">
                  No credit card · Cancel anytime · 7-day refund guarantee
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <SuperFooter
        logoSrc="/logo.png"
        sections={footerSections}
        variant="compact"
        contactInfo={{
          email: "support@educenter.com.ng",
          phone: "+2349138349271",
          whatsapp: "+2349138349271",
          address: "Lagos, Nigeria",
        }}
        socialLinks={[
          {
            platform: "Twitter",
            url: "https://twitter.com/educenter_ng",
            icon: <Twitter className="w-5 h-5" />,
          },
          {
            platform: "Facebook",
            url: "https://facebook.com/educenterng",
            icon: <Facebook className="w-5 h-5" />,
          },
          {
            platform: "Instagram",
            url: "https://instagram.com/educenter_ng",
            icon: <Instagram className="w-5 h-5" />,
          },
        ]}
        newsletter={true}
        copyright={`© ${new Date().getFullYear()} EduCenter.com.ng - A BoldMind Ecosystem Product`}
      />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/2349138349271"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50"
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </a>
    </div>
  );
}
