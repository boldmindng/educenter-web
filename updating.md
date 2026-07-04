# educenter-web — Project Structure & Implementation Flow
**Repo: `educenter-web` (standalone Next.js 16.2 · TypeScript) | June 2026**
**Domain: `educenter.com.ng` | Pillar: Education**
**Stack: Next.js 16.2.0 · React 19.2.0 · TypeScript 5.x · Tailwind CSS 4.x · pnpm**

> **Scope:** This is a standalone Next.js repo. It is NOT a monorepo.
> It consumes `@boldmindng/*` packages as **published npm packages with pinned version numbers** — never `workspace:*`.
> Always check `package.json` for the current pinned versions before referencing any package.

---

## Table of Contents

1. [Package Dependencies (Actual)](#1-package-dependencies-actual)
2. [Config Files](#2-config-files)
3. [Complete Annotated Project Tree](#3-complete-project-tree)
4. [Route Map & Auth Guard](#4-route-map--auth-guard)
5. [Shared Package Usage](#5-shared-package-usage)
6. [Implementation Flow (Wave Order)](#6-implementation-flow)
7. [Key File Contracts](#7-key-file-contracts)
8. [Environment Variables](#8-environment-variables)
9. [PR Checklist](#9-pr-checklist)

---

## 1. Package Dependencies (Actual)

**From `package.json` — these are the source of truth. Never invent workspace refs.**

```json
{
  "name": "@boldmindng/educenter-web",
  "version": "2.2.0",
  "private": true,
  "type": "module",
  "dependencies": {
    "@boldmindng/ui":           "5.0.1",
    "@boldmindng/utils":        "4.1.1",
    "@boldmindng/auth":         "5.0.1",
    "@boldmindng/api-client":   "5.0.1",
    "next":                     "16.2.0",
    "react":                    "19.2.0",
    "react-dom":                "19.2.0",
    "axios":                    "^1.6.2",
    "clsx":                     "^2.0.0",
    "cookie":                   "^1.1.1",
    "date-fns":                 "^3.0.0",
    "framer-motion":            "^12.29.2",
    "lucide-react":             "^0.309.0",
    "react-hot-toast":          "^2.4.1",
    "recharts":                 "^2.10.3",
    "sonner":                   "^2.0.7",
    "tailwind-merge":           "^2.1.0",
    "tailwindcss":              "^4.1.0",
    "postcss":                  "^8.4.38",
    "autoprefixer":             "^10.4.19",
    "typescript":               "^5.9.3",
    "@types/node":              "24.10.0",
    "@types/react":             "19.2.2",
    "@types/react-dom":         "19.2.2"
  },
  "devDependencies": {
    "eslint":                   "^9.39.1",
    "eslint-config-next":       "14.2.35"
  }
}
```

**Packages NOT in this repo (do not import):**
- `@boldmindng/analytics` — not installed
- `@boldmindng/pwa` — not installed; PWA handled by `next-pwa` directly in `next.config.mjs`
- `@boldmindng/deploy-config` — not installed
- `@boldmindng/sms`, `@boldmindng/payments`, `@boldmindng/email` — server-side only, never in frontend

**Transpiled packages** (declared in `next.config.mjs`):
```
@boldmindng/ui
@boldmindng/auth
@boldmindng/utils
@boldmindng/api-client
```

---

## 2. Config Files

### `next.config.mjs` — Actual Pattern

```js
// @ts-check
import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: 'imagedelivery.net' },
      { protocol: 'https', hostname: '*.cloudflare.com' },
      { protocol: 'https', hostname: '**.boldmind.ng' },
      { protocol: 'https', hostname: '**.amebogist.ng' },
      { protocol: 'https', hostname: '**.educenter.com.ng' },
      { protocol: 'https', hostname: '**.villagecircle.ng' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: '**.vercel.app' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  async rewrites() { return []; },

  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options',           value: 'DENY' },
        { key: 'X-Content-Type-Options',    value: 'nosniff' },
        { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
      ],
    }];
  },

  transpilePackages: [
    '@boldmindng/ui',
    '@boldmindng/auth',
    '@boldmindng/utils',
    '@boldmindng/api-client',
  ],

  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

// PWA — runtime caching strategy
const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      // ALOC question packs — 24h CacheFirst
      urlPattern: /^https:\/\/questions\.aloc\.com\.ng\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'aloc-questions',
        expiration: { maxEntries: 200, maxAgeSeconds: 86400 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      // EduCenter API — NetworkFirst with 3s timeout fallback
      urlPattern: /^https:\/\/api\.boldmind\.ng\/api\/v1\/educenter\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'educenter-api',
        networkTimeoutSeconds: 3,
        expiration: { maxEntries: 50, maxAgeSeconds: 3600 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      // Static assets — CacheFirst 30 days
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif|ico|woff2?)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-assets',
        expiration: { maxEntries: 100, maxAgeSeconds: 2592000 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
  ],
});

export default pwaConfig(nextConfig);
```

### `middleware.ts` — Auth Guard (Actual Pattern)

Next.js 16.2 uses `middleware.ts` at the repo root (Edge Runtime). This repo does NOT use a custom `proxy.ts`.

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const HUB_URL =
  process.env['NEXT_PUBLIC_HUB_URL'] ||
  (process.env.NODE_ENV === 'production' ? 'https://boldmind.ng' : 'http://localhost:4001');

const SSO_COOKIE = 'boldmind_sso';

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SSO_COOKIE)?.value;

  // Authenticated users hitting auth pages → send to dashboard
  if (token && ['/login', '/register'].some(p => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Unauthenticated users → hub login with return_url
  if (!token) {
    const loginUrl = new URL(`${HUB_URL}/login`);
    loginUrl.searchParams.set('return_url', request.nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/cbt/:path*', '/profile/:path*', '/login', '/register'],
};
```

**SSO flow:** Auth lives in `boldmind.ng` (the Hub). EduCenter does not own its own login UI for SSO — unauthenticated users are bounced to Hub `/login?return_url=...`. The Hub sets `boldmind_sso` as a cross-domain cookie on `.boldmind.ng` and the shared ecosystem domain; this repo reads it. The `(auth)` route group pages (`/login`, `/register`) are local fallback/override pages (e.g. direct email sign-up) that are handled after the SSO redirect completes.

---

## 3. Complete Annotated Project Tree

```
educenter-web/
│
├── .gitignore
├── .npmrc                                    
│                                             
├── .vercelignore
├── package.json                              
├── tsconfig.json                             
├── tailwind.config.js                        
├── postcss.config.js
├── next.config.mjs                           
├── middleware.ts                             # Edge Auth: reads boldmind_sso cookie
│                                             
├── global.d.ts                               
├── project-tree.md                           
├── README.md
│
├── public/
│   ├── sw.js                                 
│   ├── manifest.json                         
│   ├── site.webmanifest                      # Alt manifest entry point
│   ├── favicon.ico / favicon.png
│   ├── hero-image.png
│   ├── logo.png
│   ├── apple-touch-icon.png
│   ├── browserconfig.xml
│   ├── socail-media-banner.png              
│   ├── icon-192x192.png / icon-192x192-maskable.png
│   ├── icon-512x512.png / icon-512x512-maskable.png
│   ├── icons/
│   │   ├── apple/                            # Apple touch icons (57–167px)
│   │   ├── pwa/                              
│   │   └── windows/                          # mstile variants
│   └── social/
│       ├── og-image.jpg + og-image.webp      # 1200×630
│       ├── twitter-card.jpg                  # 800×418
│       ├── facebook-cover.jpg
│       ├── linkedin-banner.jpg
│       ├── whatsapp-preview.jpg
│       └── youtube-art.jpg
│
├── app/
│   │
│   ├── layout.tsx                            # Root HTML shell
│   │                                         # Sets <
│   │                                         # Wraps with 
│   │                                         # Font: OpenDyslexic + Int
│   │
│   ├── educenterLayout.tsx                   # ✅ EXISTS — EduCenter brand shell
│   │                                         # SuperNavbar +
│   │                                         # Reads product data via getProdu
│   │                                         # from @boldmindng/utils
│   │
│   ├── globals.css                           # ✅ EXISTS — Tailw
│   │                                         # --edu-primary: #1E40AF 
│   │                                         # --edu-accent: #3B82F6
│   │
│   ├── manifest.ts                           # ✅ EXISTS — Next.js Metadata
│   │                                         # Returns TWA manifest 
│   │                                         # themeColor: '#1E40AF'
│   │
│   ├── robots.ts                             # ✅ EXISTS — sta
│   ├── sitemap.ts                            # ✅ EXISTS — dynamic sitemap
│   │                                         #[subject] for all subjects
│   │                                         # Includes /business-school/courses/[
│   │
│   ├── providers.tsx                         # ✅ EXISTS — React context root
│   │                                         # Does NOT import(not installed)
│   │                                         # Wraps: TanStack Query, Toaster/Sonner
│   │
│   ├── page.tsx                              # ✅ EXISTS — PUBLIC marketing landing
│   │                                         # CTA → /register (local) or HUB SSO
│   │
│   ├── pricing/
│   │   └── page.tsx                          # ✅ EXISTS — PUBLIC
│   │
│   ├── privacy/
│   │   └── page.tsx                          # ✅ EXISTS — PUBLIC: PrivacyPolicy from 
│   │
│   ├── terms/
│   │   └── page.tsx                          # ✅ EXISTS — PUBLIC: TermsAndConditions 
│   │
│   ├── api/
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts                  # ✅ EXISTS — SSO exchange after Hub logi
│   │                                         # Receives ?sso_token= from Hub redirect
│   │                                         # Calls boldmind-service /sso/exchange
│   │                                         # Sets local session / cookie
│   │                                         # Redirects to return_url or /dashboard
│   │
│   ├── (auth)/                               # Auth route group — no dashboard chrome
│   │   ├── layout.tsx                        # ✅ EXISTS — minimal shell (logo + back 
│   │   ├── login/
│   │   │   └── page.tsx                      # ✅ EXISTS — local email/password form (
│   │   │                                     # authApi.login() from @boldmindng/ap
│   │   ├── register/
│   │   │   └── page.tsx                      # ✅ EXISTS — registration + WhatsApp
│   │   ├── verify-email/
│   │   │   └── page.tsx                      # ✅ EXISTS — 6-digit email OTP entry
│   │   ├── reset-password/
│   │   │   └── page.tsx                      # ✅ EXISTS — enter email → OTP request
│   │   └── change-password/
│   │       └── page.tsx                      # ✅ EXISTS — OTP + new password form
│   │
│   └── (dashboard)/                          # Protected group — middleware.ts g
│       │
│       ├── layout.tsx                        # ✅ EXISTS — dashboard shell
│       │                                     # Renders: <Sidebar />, main con
│       │
│       ├── Sidebar.tsx                       # ✅ EXISTS — left nav
│       │                                     # Links: Dashboard, Study Hub, Busi
│       │                                     # Shows: user XP + study streak
│       │
│       ├── dashboard/
│       │   └── page.tsx                      # ✅ EXISTS — dashboard home
│       │                                     # JAMB/WAEC countdown, quick-start CB
│       │                                     # API: educenterApi.getStreak()
│       │
│       ├── study-hub/                        # ── EXAM PREP VERTICAL ──
│       │   │
│       │   ├── page.tsx                      # ✅ EXISTS — choose exam type (JAMB / W
│       │   │
│       │   ├── subjects/
│       │   │   ├── page.tsx                  # ✅ EXISTS — subject grid for chosen exa
│       │   │   └── [subject]/
│       │   │       └── page.tsx              # ✅ EXISTS — subject detail + year sele
│       │   │
│       │   ├── practice/
│       │   │   └── [subject]/
│       │   │       └── [year]/
│       │   │           └── page.tsx          # ✅ EXISTS — CBT simulator
│       │   │
│       │   ├── progress/
│       │   │   └── page.tsx                  # ✅ EXISTS — subject-by-subject perfo
│       │   │                                 # educenterApi.getProgress()
│       │   │                                 # Recharts BarChart — no recharts w
│       │   │                                 # (recharts already in dependencies)
│       │   │
│       │   ├── leaderboard/
│       │   │   └── page.tsx                  # ✅ EXISTS — national rank leaderboard
│       │   │                                 # educenterApi.getLeaderboard({ limit
│       │   │
│       │   ├── history/
│       │   │   └── page.tsx                  # ✅ EXISTS — past sessions + scores
│       │   │                                 # educenterApi.getSessions()
│       │   │
│       │   └── notes/
│       │       └── page.tsx                  # ✅ EXISTS — personal study notes

│       │
│       ├── business-school/
│       │   └── page.tsx                      # ✅ EXISTS — business school landing
│       │   ├── playbooks/                    ★ NEW Wave 2
│       │   │   ├── page.tsx                  # Full playbook browser (gated after 6)
│       │   │   └── [slug]/
│       │   │       └── page.tsx              # Playbook reader (HTML)
│       │   │                                 # educenterApi.getPlaybook(slug)
│       │   │                                 # PDF is Pro-gated via <GateGuard>
│       │   │
│       │   ├── courses/                      ★ NEW Wave 2
│       │   │   ├── page.tsx                  # Course library — first 6 public
│       │   │   │                             # educenterApi.getCourses()
│       │   │   └── [courseId]/
│       │   │       └── page.tsx              # Course player: video + quiz + 
│       │   │                                 # educenterApi.getCourse(courseId)
│       │   │                                 # educenterApi.updateEnrollmentProgress
│       │   │
│       │   └── certificates/                 ★ NEW Wave 2
│       │       └── page.tsx                  # Earned certificates
│       │                                     # educenterApi.getEnrollments() 
│       │
│       ├── lms/                              ★ NEW Wave 3 — LMS Builder Vertical
│       │   ├── page.tsx                      # My courses dashboard + revenue summary
│       │   │                                 # educenterLmsApi.listMyCourses()
│       │   ├── create/
│       │   │   └── page.tsx                  # New course wizard (metadata step)
│       │   │                                 # educenterLmsApi.createCourse()
│       │   ├── generate/
│       │   │   ├── page.tsx                  # AI course generator form
│       │   │   │                             # educenterLmsApi.generateCourse() → 
│       │   │   └── result/
│       │   │       └── page.tsx              # Poll job → preview AI output → "
│       │   └── [courseId]/
│       │       ├── page.tsx                  # Course overview + edit metadata
│       │       ├── lessons/
│       │       │   └── page.tsx              # Lesson manager 
│       │       ├── students/
│       │       │   └── page.tsx              # Enrolled students
│       │       └── earnings/
│       │           └── page.tsx              # Revenue + Paystack split history
│       │
│       ├── school/                           ★ NEW Wave 3 
│       │   ├── page.tsx                      # School admin dashboard
│       │   │                                 # 404 from API → redirect to /
│       │   ├── register/
│       │   │   └── page.tsx                  # Register school 
│       │   ├── students/
│       │   │   └── page.tsx                  # Student roster + CSV bulk enroll
│       │   ├── assignments/
│       │   │   └── page.tsx                  # Create /
│       │   ├── results/
│       │   │   └── page.tsx                  # Class performance analytics
│       │   └── billing/
│       │       └── page.tsx                  # Plan, slots used, renewal date
│       │
│       └── subscription/
│           └── page.tsx                      # ✅ EXISTS — plan management
│
├── components/
│   ├── index.ts                              # ✅ EXISTS — barrel exports
│   ├── Providers.tsx                         # ✅ EXISTS 
│   │
│   ├── study-hub/                            ★ NEW Wave 1
│   │   ├── CBTTimer.tsx                      # Countdown ring
│   │   │                                     # 
│   │   ├── QuestionCard.tsx                  # MCQ card: question text + 4 options
│   │   │                                     # Keyboard navigable (A/B/C/D keys)
│   │   ├── SubjectGrid.tsx                   # Grid of sub
│   │   ├── ProgressChart.tsx                 # recharts BarChart — subject scores
│   │   ├── StreakBadge.tsx                   # Flame icon + XP count
│   │   └── OfflineBanner.tsx                 # Fixed top ban
│   │                                         # Uses window 'online'/'offline' events
│   │
│   ├── business-school/                      ★ NEW Wave 2
│   │   ├── PlaybookCard.tsx                 
│   │   ├── CourseCard.tsx                    # Thumbnail + duration + enroll CTA
│   │   ├── CoursePlayer.tsx                  # Video embe
│   │   └── CertificateCard.tsx               # Certificate preview + LinkedIn 
│   │
│   ├── lms/                                  ★ NEW Wave 3
│   │   ├── CourseBuilderForm.tsx             # Multi-step wizard
│   │   ├── LessonEditor.tsx                  # Ri
│   │   ├── AICourseGenerator.tsx             # Form → job poll → preview
│   │   ├── StudentTable.tsx                  # Paginated enrolled students
│   │   └── EarningsChart.tsx                 # recharts LineChart monthly earnings
│   │
│   ├── school/                               ★ NEW Wave 3
│   │   ├── SchoolStats.tsx                   # Slots used/avai
│   │   ├── BulkEnrollDropzone.tsx            # CSV drag-and-drop → parse → preview → 
│   │   ├── AssignmentForm.tsx                # Class + subject + due date + ques
│   │   └── ClassPerformanceTable.tsx         # Subject × class heatmap grid
│   │
│   └── shared/                               ★ NEW Wave 1
│       ├── GateGuard.tsx                     # Wraps Pro-gat
│       │                                     # Reads s
│       └── ExamCountdown.tsx                 # Days until J
│
├── lib/
│   ├── api.ts                                # ✅ EXISTS — API client instantiation
│   │                                         # crea
│   │                                       
│   │                                        
│   │
│   ├── auth.tsx                              # ✅ EXISTS — auth utilities
│   │                                         # Wraps/re-exports from @boldmindng/auth
│   │            
│   │
│   ├── config.ts                             # ✅ EXISTS — env constants
│   │                                      
│   │                                         # runtime guard: throw if missing
│   │
│   └── user-api-adapter.ts                   # ✅ EXISTS — adapts UserProfile to 
│                                             # Extracts: examTarget, targetYea
│                                             # prefersPidgin, dyslexiaMode
│
├── hooks/                                    ★ NEW folder — Wave 1+
│   ├── useExamSession.ts                     # CBT session lifecycle wrapper
│   │                                         # createSession → answerQuestion → completeSession
│   │                                         # Local timer state + offline detection
│   ├── useStudyStreak.ts                     # Streak + XP display hook
│   │                                         # educenterApi.getStreak()
│   ├── useLMSCourse.ts                       # Wave 3: LMS CRUD wrapper
│   └── useSchoolPortal.ts                    # Wave 3: school admin data + actions
│
└── types/                                    ★ NEW folder — Wave 1
    ├── educenter.ts                          # Local TS types: CBTSession, StudyNote, ExamType
    └── lms.ts                               # Wave 3: CourseStatus, LessonType, etc.
```

---

## 4. Route Map & Auth Guard

### middleware.ts matcher (actual)

```
Protected (requires boldmind_sso cookie):
  /dashboard/:path*
  /cbt/:path*            ← note: /cbt/* is protected but not yet in project tree — placeholder
  /profile/:path*        ← note: same

Redirect if authenticated:
  /login
  /register
```

**What (dashboard) maps to:**

| Route | Protected | Subscription needed | Notes |
|---|---|---|---|
| `/dashboard` | ✅ | none | Home after SSO |
| `/study-hub/**` | ✅ | Basic+ | ALOC requires active subscription |
| `/business-school` | ✅ | none | Landing visible; content gated |
| `/business-school/playbooks/[slug]` | ✅ | Basic+ (PDF = Pro) | GateGuard on PDF download |
| `/business-school/courses/[courseId]` | ✅ | Basic+ | |
| `/business-school/certificates` | ✅ | Basic+ | |
| `/lms/**` | ✅ (Wave 3) | Basic+ | Creator role |
| `/school/**` | ✅ (Wave 3) | Basic+ | School admin role |
| `/subscription` | ✅ | none | Manage plan |
| `/pricing` | ❌ Public | — | |
| `/` | ❌ Public | — | Marketing landing |
| `/privacy`, `/terms` | ❌ Public | — | |

---

## 5. Shared Package Usage

### `@boldmindng/utils@4.1.1`

```typescript
import {
  getProductBySlug,       // app/page.tsx, educenterLayout.tsx — reads educenter product data
  BOLDMIND_PRICING,       // Available via PricingContent, but also importable if needed
  getProductFont,         // 'OpenDyslexic, "Inter", sans-serif' — set in layout.tsx
  formatNaira,            // Display subscription prices: formatNaira(kobo)
  formatLagosDate,        // All timestamps → Africa/Lagos display
  usePaystack,            // subscription/page.tsx upgrade flow
  validateNigerianPhone,  // (auth)/register/page.tsx
} from '@boldmindng/utils';

// Usage example — landing page:
const product = getProductBySlug('educenter');
// product.name, product.description, product.features[], product.users
// product.twa → { packageName: 'ng.educenter.app', themeColor: '#1E40AF', ... }
// product.social → { tiktok, facebook, youtube, whatsapp }
```

### `@boldmindng/auth@5.0.1`

```typescript
import {
  useUser,           // Sidebar.tsx — user name, avatar, subscription status
  usePermissions,    // GateGuard.tsx — check Pro gating
  AuthProvider,      // app/providers.tsx (if required by this version)
  getAccessToken,    // lib/api.ts — injected into api-client request headers
} from '@boldmindng/auth';
```

### `@boldmindng/api-client@5.0.1`

```typescript
// lib/api.ts
import { createClient } from '@boldmindng/api-client';

// Exported API namespaces used in this repo:
educenterApi.getSubjects(examType)
educenterApi.createSession({ examType, subject, totalQuestions, timeLimitSecs, year? })
educenterApi.answerQuestion(sessionId, { alocQuestionId, selectedAnswer })
educenterApi.completeSession(sessionId)
educenterApi.getSessions({ page, pageSize, examType?, subject? })
educenterApi.getProgress({ examType?, subject? })
educenterApi.getStreak()
educenterApi.getLeaderboard({ examType?, subject?, limit? })
educenterApi.getRandomQuestions({ examType, subject, count, year? })

educenterApi.getCourses({ category?, page, pageSize, isPremium? })
educenterApi.getCourse(courseId)   // or slug depending on API
educenterApi.enroll(courseId)
educenterApi.updateEnrollmentProgress(enrollmentId, { progressPercent, lastLessonId })
educenterApi.getEnrollments()

educenterApi.getPlaybooks({ category?, page, pageSize })
educenterApi.getPlaybook(slug)
educenterApi.downloadPlaybook(slug)  // PDF binary — Pro only

educenterApi.getPrompts({ category?, page, pageSize })
educenterApi.getPrompt(slug)

paymentApi.getSubscriptions()
paymentApi.getSubscription(productSlug)
paymentApi.initiate({ productSlug, planName, interval, amountNGN, email })

usersApi.getMe()

// Wave 3 — when boldmind-service LMS + School modules ship:
educenterLmsApi.createCourse(data)
educenterLmsApi.listMyCourses()
educenterLmsApi.getCourse(id)
educenterLmsApi.updateCourse(id, data)
educenterLmsApi.publishCourse(id)
educenterLmsApi.addLesson(courseId, data)
educenterLmsApi.updateLesson(id, data)
educenterLmsApi.deleteLesson(id)
educenterLmsApi.getCourseStudents(courseId, page, pageSize)
educenterLmsApi.getCourseEarnings(courseId, from?, to?)
educenterLmsApi.generateCourse(data)  // returns { jobId }

educenterSchoolApi.registerSchool(data)
educenterSchoolApi.getMySchool()
educenterSchoolApi.bulkEnrollStudents(students)
educenterSchoolApi.getMyStudents(page, pageSize, search?)
educenterSchoolApi.getClassPerformance(examType?, subject?)
educenterSchoolApi.createAssignment(data)
```

### `@boldmindng/ui@5.0.1`

```typescript
import {
  SuperNavbar,          // educenterLayout.tsx / (dashboard)/layout.tsx
  SuperFooter,          // educenterLayout.tsx
  PricingContent,       // pricing/page.tsx, subscription/page.tsx
  PrivacyPolicy,        // privacy/page.tsx
  TermsAndConditions,   // terms/page.tsx
  DyslexiaToggle,       // (dashboard)/Sidebar.tsx
  Button,
  Card,
  Input,
  Modal,
  LoadingSpinner,
  StatusBadge,
} from '@boldmindng/ui';

// SuperNavbar usage:
<SuperNavbar activeProduct="educenter.com.ng" user={user} />

// PricingContent — zero hardcoded prices:
<PricingContent productSlug="educenter" currency="NGN" />
```

---

## 6. Implementation Flow (Wave Order)

### Wave 0 — Audit & Harden Existing Files *(do now)*

No new files. Fix alignment issues in what already exists.

| Task | File | What to fix |
|---|---|---|
| Product data not hardcoded | `app/page.tsx` | Replace any hardcoded product copy with `getProductBySlug('educenter')` from `@boldmindng/utils` |
| Pricing not hardcoded | `app/pricing/page.tsx` | Use `<PricingContent productSlug="educenter" />` from `@boldmindng/ui` |
| Font correct | `app/layout.tsx` | Font stack must match `getProductFont('educenter')`: `OpenDyslexic, "Inter", sans-serif` |
| SSO callback correct | `app/api/auth/callback/route.ts` | Must call boldmind-service `/sso/exchange` with token from Hub, then set session |
| Subscription page | `(dashboard)/subscription/page.tsx` | Use `<PricingContent />`, never hardcoded tiers |
| All amounts display | Any page showing prices | `formatNaira(kobo)` from `@boldmindng/utils` — never raw number |
| All dates display | Any page showing timestamps | `formatLagosDate(date)` from `@boldmindng/utils` |

### Wave 1 — Study Hub Implementation *(current priority)*

All routes exist. This wave wires them to the real API and adds the component layer.

| Task | File | Notes |
|---|---|---|
| CBT session lifecycle | `study-hub/practice/[subject]/[year]/page.tsx` | `createSession` → `answerQuestion` → `completeSession` |
| useExamSession hook | `hooks/useExamSession.ts` | Timer state + offline detection + session state machine |
| CBTTimer component | `components/study-hub/CBTTimer.tsx` | framer-motion SVG ring, auto-submit at 0 |
| QuestionCard component | `components/study-hub/QuestionCard.tsx` | A/B/C/D keyboard shortcuts |
| OfflineBanner component | `components/shared/OfflineBanner.tsx` | `navigator.onLine` + window events |
| GateGuard component | `components/shared/GateGuard.tsx` | Checks subscription via `useUser()` |
| ProgressChart | `components/study-hub/ProgressChart.tsx` | `recharts` BarChart — already in dependencies |
| StreakBadge | `components/study-hub/StreakBadge.tsx` | In Sidebar.tsx |
| Streak in Sidebar | `(dashboard)/Sidebar.tsx` | `educenterApi.getStreak()` |
| DyslexiaToggle in Sidebar | `(dashboard)/Sidebar.tsx` | From `@boldmindng/ui` |
| ExamCountdown | `components/shared/ExamCountdown.tsx` | Days until JAMB/WAEC hardcoded dates |
| types/educenter.ts | `types/educenter.ts` | CBTSession, ExamType, StudyNote interfaces |

### Wave 2 — Business School Completion

| Task | File | Notes |
|---|---|---|
| Playbook browser page | `business-school/playbooks/page.tsx` | Gated after 6 via `<GateGuard>` |
| Playbook reader | `business-school/playbooks/[slug]/page.tsx` | HTML content + Pro PDF download |
| Course library | `business-school/courses/page.tsx` | First 6 free |
| Course player | `business-school/courses/[courseId]/page.tsx` | Video + progress tracking |
| Certificates page | `business-school/certificates/page.tsx` | Filter `getEnrollments()` by completed |
| PlaybookCard component | `components/business-school/PlaybookCard.tsx` | Lock icon for gated |
| CourseCard component | `components/business-school/CourseCard.tsx` | |
| CoursePlayer component | `components/business-school/CoursePlayer.tsx` | |
| CertificateCard component | `components/business-school/CertificateCard.tsx` | LinkedIn share |

### Wave 3 — LMS Builder + School Portal

**Prerequisite: `boldmind-service` LMS module (`src/modules/educenter/lms/`) and School module (`src/modules/educenter/school/`) must be deployed first.**

| Task | File | Notes |
|---|---|---|
| Add `/lms/**` to middleware matcher | `middleware.ts` | Add to protected paths |
| Add `/school/**` to middleware matcher | `middleware.ts` | Add to protected paths |
| Wire `educenterLmsApi` | `lib/api.ts` | Import from `@boldmindng/api-client@5.x` once exported |
| Wire `educenterSchoolApi` | `lib/api.ts` | Same |
| LMS dashboard | `lms/page.tsx` | |
| Course builder wizard | `lms/create/page.tsx` | |
| AI course generator | `lms/generate/page.tsx` + `result/page.tsx` | Job poll pattern |
| Course management | `lms/[courseId]/**` | 4 sub-pages |
| School dashboard | `school/page.tsx` | 404 → redirect to `/school/register` |
| School registration | `school/register/page.tsx` | |
| Bulk CSV enroll | `school/students/page.tsx` | + `BulkEnrollDropzone.tsx` |
| All LMS components | `components/lms/**` | 5 components |
| All school components | `components/school/**` | 4 components |
| types/lms.ts | `types/lms.ts` | |
| hooks/useLMSCourse.ts | `hooks/useLMSCourse.ts` | |
| hooks/useSchoolPortal.ts | `hooks/useSchoolPortal.ts` | |

---

## 7. Key File Contracts

### `lib/api.ts` — Actual pattern (no workspace refs)

```typescript
// lib/api.ts
import { createClient } from '@boldmindng/api-client';
import { getAccessToken } from '@boldmindng/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const apiClient = createClient(API_URL, {
  mode: 'jwt',
  getToken: () => getAccessToken(),
});

// Named re-exports for use across the app
export {
  educenterApi,
  paymentApi,
  usersApi,
  // Wave 3 — add when service modules are live:
  // educenterLmsApi,
  // educenterSchoolApi,
} from '@boldmindng/api-client';
```

### `components/shared/GateGuard.tsx` — Pro content gating

```typescript
// components/shared/GateGuard.tsx
'use client';
import { useUser } from '@boldmindng/auth';
import { Button } from '@boldmindng/ui';
import { useRouter } from 'next/navigation';

interface GateGuardProps {
  requiredPlan?: 'basic' | 'pro';
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

export function GateGuard({
  requiredPlan = 'basic',
  children,
  fallbackTitle = 'Upgrade Required',
  fallbackMessage = 'Upgrade your plan to access this content.',
}: GateGuardProps) {
  const { user } = useUser();
  const router = useRouter();

  // Determine access from user subscription status
  // Exact field depends on what @boldmindng/auth@5.0.1 exposes on user object
  const hasAccess = user?.subscriptionStatus === 'active';

  if (hasAccess) return <>{children}</>;

  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50 p-8 text-center">
      <h3 className="text-lg font-semibold text-blue-900 mb-2">{fallbackTitle}</h3>
      <p className="text-sm text-blue-700 mb-4">{fallbackMessage}</p>
      <Button onClick={() => router.push('/subscription')}>
        View Plans
      </Button>
    </div>
  );
}
```

### `hooks/useExamSession.ts` — CBT session lifecycle

```typescript
// hooks/useExamSession.ts
'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { educenterApi } from '@/lib/api';

type SessionState = 'idle' | 'loading' | 'active' | 'submitting' | 'complete' | 'error';

export function useExamSession() {
  const [state, setState] = useState<SessionState>('idle');
  const [session, setSession] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [result, setResult] = useState<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startSession = useCallback(async (params: {
    examType: string;
    subject: string;
    totalQuestions: number;
    timeLimitSecs: number;
    year?: string;
  }) => {
    setState('loading');
    try {
      const data = await educenterApi.createSession(params);
      setSession(data);
      setTimeRemaining(params.timeLimitSecs);
      setState('active');
    } catch {
      setState('error');
    }
  }, []);

  const submitAnswer = useCallback(async (alocQuestionId: string, selectedAnswer: string) => {
    if (!session) return;
    setAnswers(prev => ({ ...prev, [alocQuestionId]: selectedAnswer }));
    await educenterApi.answerQuestion(session.id, { alocQuestionId, selectedAnswer });
  }, [session]);

  const completeSession = useCallback(async () => {
    if (!session) return;
    setState('submitting');
    if (timerRef.current) clearInterval(timerRef.current);
    try {
      const data = await educenterApi.completeSession(session.id);
      setResult(data);
      setState('complete');
    } catch {
      setState('error');
    }
  }, [session]);

  // Timer tick
  useEffect(() => {
    if (state !== 'active') return;
    timerRef.current = setInterval(() => {
      setTimeRemaining(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          completeSession();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [state, completeSession]);

  return {
    state, session, currentIndex, answers, timeRemaining, result,
    startSession, submitAnswer, completeSession,
    setCurrentIndex,
  };
}
```

---

## 8. Environment Variables

```env
# ── Public (exposed to browser) ──────────────────────────────────────────────
NEXT_PUBLIC_API_URL=https://api.boldmind.ng/api/v1
NEXT_PUBLIC_HUB_URL=https://boldmind.ng
NEXT_PUBLIC_APP_URL=https://educenter.com.ng
NEXT_PUBLIC_PRODUCT_SLUG=educenter
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...
NEXT_PUBLIC_VAPID_PUBLIC_KEY=               # For PWA push subscription

# ── Server-side only ─────────────────────────────────────────────────────────
SSO_EXCHANGE_URL=https://api.boldmind.ng/api/v1/sso/exchange
# (used in app/api/auth/callback/route.ts)
```

These are validated in `lib/config.ts` at module load time. If a required public var is missing, throw with a clear message so the deployment fails loudly.

---

## 9. PR Checklist

```
REPO BOUNDARIES
[ ] This is a standalone repo — zero workspace:* references anywhere
[ ] All @boldmindng/* imports use the pinned versions from package.json
[ ] New package? Add to package.json with exact version AND to transpilePackages in next.config.mjs

STACK
[ ] Next.js 16.2 App Router — no pages/ directory, no getStaticProps/getServerSideProps
[ ] React 19.2 — hooks only, no class components
[ ] "type": "module" in package.json — use ESM imports, no require()

PRODUCTS & PRICING
[ ] Zero hardcoded product names, descriptions, or prices anywhere
[ ] Product data: getProductBySlug('educenter') from @boldmindng/utils
[ ] Pricing: <PricingContent productSlug="educenter" /> from @boldmindng/ui
[ ] Font: getProductFont('educenter') = 'OpenDyslexic, "Inter", sans-serif'

AUTH & SSO
[ ] middleware.ts matcher covers any new protected routes
[ ] SSO cookie name is 'boldmind_sso' — never renamed
[ ] app/api/auth/callback/route.ts calls /sso/exchange, not a custom JWT parse
[ ] No auth state in localStorage — Zustand or React state in-memory only

AMOUNTS & DATES
[ ] formatNaira(kobo) for all monetary display — never raw numbers
[ ] formatLagosDate(date) for all timestamp display

MOBILE
[ ] Works at 375px minimum width
[ ] Touch targets ≥ 44×44px
[ ] Input font-size ≥ 16px (prevents iOS auto-zoom)

OFFLINE / PWA
[ ] No manual sw.js edits — generated by next-pwa at build
[ ] ALOC question pack URLs match the runtimeCaching pattern in next.config.mjs
[ ] OfflineBanner component shows when navigator.onLine === false

GATING
[ ] Pro content wrapped in <GateGuard> — never conditionally hidden with CSS only
[ ] PDF downloads check subscription before calling downloadPlaybook()

LMS (Wave 3 gate)
[ ] educenterLmsApi not imported until @boldmindng/api-client exports it (service live)
[ ] generateCourse() result page polls job status — never treats response as synchronous

SCHOOL PORTAL (Wave 3 gate)
[ ] /school/page.tsx handles 404 from getMySchool() → redirect to /school/register
[ ] Student slot cap shown clearly before bulk enroll — error state if cap exceeded

ANALYTICS
[ ] No @boldmindng/analytics import — not installed. Use custom track() wrapper if needed
    or defer analytics to a future package upgrade cycle.

BUILD
[ ] next build passes with 0 type errors (pnpm type-check)
[ ] next lint passes
[ ] public/sw.js is NOT committed — it's a build artifact (add to .gitignore if not already)
```

---

## Appendix — File Status at a Glance

| File / Folder | Status | Wave |
|---|---|---|
| `middleware.ts` | ✅ Exists | 0 — confirm matcher is correct |
| `next.config.mjs` | ✅ Exists | 0 — confirm pattern |
| `package.json` | ✅ Exists | 0 — source of truth for versions |
| `app/layout.tsx` | ✅ Exists | 0 — audit font + AppLayout |
| `app/educenterLayout.tsx` | ✅ Exists | 0 |
| `app/globals.css` | ✅ Exists | 0 |
| `app/manifest.ts` | ✅ Exists | 0 — confirm TWA config |
| `app/robots.ts` | ✅ Exists | 0 |
| `app/sitemap.ts` | ✅ Exists | 0 |
| `app/providers.tsx` | ✅ Exists | 0 |
| `app/page.tsx` | ✅ Exists | 0 — audit for hardcoded copy |
| `app/pricing/page.tsx` | ✅ Exists | 0 — swap to PricingContent |
| `app/privacy/page.tsx` | ✅ Exists | 0 |
| `app/terms/page.tsx` | ✅ Exists | 0 |
| `app/api/auth/callback/route.ts` | ✅ Exists | 0 — audit SSO exchange |
| `app/(auth)/**` (6 pages) | ✅ Exists | 0 |
| `app/(dashboard)/layout.tsx` | ✅ Exists | 1 — add DyslexiaToggle |
| `app/(dashboard)/Sidebar.tsx` | ✅ Exists | 1 — add streak + DyslexiaToggle |
| `app/(dashboard)/dashboard/page.tsx` | ✅ Exists | 1 — wire API |
| `app/(dashboard)/study-hub/**` (8 routes) | ✅ Exists | 1 — wire API + add components |
| `app/(dashboard)/business-school/page.tsx` | ✅ Exists | 2 — wire API |
| `app/(dashboard)/subscription/page.tsx` | ✅ Exists | 0 — swap to PricingContent |
| `lib/api.ts` | ✅ Exists | 1 — confirm createClient pattern |
| `lib/auth.tsx` | ✅ Exists | 0 |
| `lib/config.ts` | ✅ Exists | 0 |
| `lib/user-api-adapter.ts` | ✅ Exists | 0 |
| `components/index.ts` | ✅ Exists | 0 |
| `components/Providers.tsx` | ✅ Exists | 0 |
| `global.d.ts` | ✅ Exists | 0 |
| `hooks/` (folder) | ★ NEW | 1 |
| `types/` (folder) | ★ NEW | 1 |
| `components/study-hub/**` | ★ NEW | 1 |
| `components/shared/**` | ★ NEW | 1 |
| `components/business-school/**` | ★ NEW | 2 |
| `app/(dashboard)/business-school/playbooks/**` | ★ NEW | 2 |
| `app/(dashboard)/business-school/courses/**` | ★ NEW | 2 |
| `app/(dashboard)/business-school/certificates/` | ★ NEW | 2 |
| `app/(dashboard)/lms/**` | ★ NEW | 3 (after service ships) |
| `app/(dashboard)/school/**` | ★ NEW | 3 (after service ships) |
| `components/lms/**` | ★ NEW | 3 |
| `components/school/**` | ★ NEW | 3 |
| `hooks/useLMSCourse.ts` | ★ NEW | 3 |
| `hooks/useSchoolPortal.ts` | ★ NEW | 3 |
| `types/lms.ts` | ★ NEW | 3 |

---

*educenter-web structure doc | June 2026*
*Update `project-tree.md` every time a file is added or removed.*
*Attach this doc + `project-tree.md` + system design docs when prompting AI for any new file.*