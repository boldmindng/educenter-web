// lib/config.ts
// App constants & env vars for educenter-web (standalone Next.js 16.2).
// Only NEXT_PUBLIC_ vars are safe on the client side.

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? 'https://educenter.com.ng';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://api.boldmind.ng/api/v1';

export const PAYSTACK_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? '';

export const POSTHOG_KEY  = process.env.NEXT_PUBLIC_POSTHOG_KEY  ?? '';
export const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com';

// ─── App identity ─────────────────────────────────────────────────────────────

export const SITE = {
  name:            'Boldmind EduCenter',
  shortName:       'EduCenter',
  slug:            'educenter',
  pillar:          'education' as const,
  domain:          'educenter.com.ng',
  url:             APP_URL,
  description:
    'Nigerian exam prep — JAMB, WAEC, NECO past questions, CBT simulator, AI tutoring, and business skills.',
  themeColor:      '#1E40AF',
  backgroundColor: '#F8FAFC',
  locale:          'en-NG',
  timezone:        'Africa/Lagos',
  twitterHandle:   '@boldmindeducenter',
  ogImage:         `${APP_URL}/social/og-image.jpg`,
} as const;

// ─── Ecosystem cross-links (CoreDomain from products.ts) ─────────────────────

export const ECOSYSTEM = {
  boldmind:      'https://boldmind.ng',
  amebogist:     'https://amebogist.ng',
  villagecircle: 'https://villagecircle.ng',
  planai:        'https://planai.boldmind.ng',
  marketplace:   'https://marketplace.boldmind.ng',
} as const;

// ─── Exam / quiz config ───────────────────────────────────────────────────────

export const EXAM_TYPES = ['JAMB', 'WAEC', 'NECO', 'POST_UTME'] as const;
export type ExamType = (typeof EXAM_TYPES)[number];

export const LEADERBOARD_PERIODS = ['weekly', 'monthly', 'alltime'] as const;
export type LeaderboardPeriod = (typeof LEADERBOARD_PERIODS)[number];

export const DEFAULT_QUESTION_COUNT = 40;
export const CBT_TIMER_SECONDS      = 60 * 60; // 1 hour default

// ─── Pricing (from pricing.ts educenter tiers) ───────────────────────────────

export const PRICING = {
  free:  { ngn: 0,     usd: 0 },
  basic: { ngn: 2_500, usd: 2 },
  pro:   { ngn: 6_250, usd: 5 },
} as const;

export type SubscriptionTier = keyof typeof PRICING;

// ─── Feature flags (resolved from /api/v1/users/me at runtime) ───────────────

export const DEFAULT_FEATURE_FLAGS = {
  offlineQuestionPacks: true,
  lms:                  true,
  schoolPortal:         true,
  businessPlaybook:     true,
  aiTutor:              false,
  peerStudyRooms:       false,
} as const;