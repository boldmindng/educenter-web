// lib/types.ts


import type { ExamType, LeaderboardPeriod } from './config';

// ─── Auth / User ─────────────────────────────────────────────────────────────

export interface UserDto {
  id: string;
  email: string;
  phone?: string;
  role: 'USER' | 'CREATOR' | 'ADMIN' | 'SUPER_ADMIN';
  isEmailVerified: boolean;
  profile: UserProfileDto;
  educenterAccess?: EduCenterAccessDto;
  featureFlags?: string[];
  createdAt: string;
}

export interface UserProfileDto {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  state?: string;
  lga?: string;
}

export interface EduCenterAccessDto {
  tier: 'free' | 'basic' | 'pro' | 'school';
  schoolId?: string;
  enrolledCourses: string[];
}

// ─── Subjects & Questions ─────────────────────────────────────────────────────

export interface SubjectDto {
  id: string;
  name: string;
  slug: string;
  icon: string;
  examTypes: ExamType[];
  availableYears: number[];
  totalQuestions: number;
  color: string; // tailwind bg class
}

export interface QuestionDto {
  id: string;
  question: string;
  image?: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
    e?: string;
  };
  answer: 'a' | 'b' | 'c' | 'd' | 'e';
  explanation?: string;
  subject: string;
  examType: ExamType;
  year: number;
}

export type AnswerKey = 'a' | 'b' | 'c' | 'd' | 'e';

export interface UserAnswer {
  questionId: string;
  selected: AnswerKey;
}

// ─── Quiz / Attempt ───────────────────────────────────────────────────────────

export interface QuizSubmitPayload {
  subject: string;
  examType: ExamType;
  year?: number;
  answers: UserAnswer[];
  timeTakenSecs: number;
}

export interface QuizResultDto {
  attemptId: string;
  score: number;       // 0–100
  correct: number;
  total: number;
  timeTakenSecs: number;
  xpEarned: number;
  newStreak: number;
  breakdown: QuestionResultDto[];
}

export interface QuestionResultDto {
  questionId: string;
  selected: AnswerKey | null;
  correct: AnswerKey;
  isCorrect: boolean;
  explanation?: string;
}

export interface QuizAttemptDto {
  id: string;
  subject: string;
  examType: ExamType;
  year?: number;
  score: number;
  correct: number;
  total: number;
  timeTakenSecs: number;
  createdAt: string;
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export interface SubjectProgressDto {
  subject: string;
  totalAttempts: number;
  bestScore: number;
  avgScore: number;
  totalQuestionsAnswered: number;
  lastAttemptAt: string;
  trend: 'up' | 'down' | 'flat';
}

export interface StudentProgressDto {
  streak: number;
  xp: number;
  rank: number;
  level: number;
  xpToNextLevel: number;
  subjects: SubjectProgressDto[];
  recentAttempts: QuizAttemptDto[];
  weakSubjects: string[];
  strongSubjects: string[];
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export interface LeaderboardEntryDto {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  state?: string;
  xp: number;
  avgScore: number;
  totalAttempts: number;
  isCurrentUser?: boolean;
}

export interface LeaderboardDto {
  period: LeaderboardPeriod;
  examType?: ExamType;
  entries: LeaderboardEntryDto[];
  currentUserEntry?: LeaderboardEntryDto;
  updatedAt: string;
}

// ─── Courses / LMS ────────────────────────────────────────────────────────────

export type CourseCategory =
  | 'exam-prep'
  | 'business-skills'
  | 'digital-skills'
  | 'soft-skills'
  | 'entrepreneurship';

export interface CourseDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: CourseCategory;
  thumbnailUrl: string;
  instructorName: string;
  instructorAvatarUrl?: string;
  durationMinutes: number;
  totalLessons: number;
  totalStudents: number;
  rating: number;
  priceNgn: number; // 0 = free
  tags: string[];
  isEnrolled?: boolean;
  completionPercent?: number;
  createdAt: string;
}

// ─── School Portal ────────────────────────────────────────────────────────────

export interface SchoolDto {
  id: string;
  name: string;
  state: string;
  studentSlots: number;
  usedSlots: number;
  plan: string;
  payingUntil?: string;
}

export interface StudentSummaryDto {
  userId: string;
  displayName: string;
  class: string;
  totalAttempts: number;
  avgScore: number;
  lastActiveAt: string;
  weakSubjects: string[];
}

// ─── Notes ────────────────────────────────────────────────────────────────────

export interface NoteDto {
  id: string;
  subject: string;
  title: string;
  content: string;          // markdown
  questionIds: string[];    // linked ALOC question IDs
  createdAt: string;
  updatedAt: string;
}

// ─── Subscription / Payment ───────────────────────────────────────────────────

export interface SubscriptionDto {
  id: string;
  productSlug: string;
  tier: 'free' | 'basic' | 'pro' | 'school';
  billingCycle: 'monthly' | 'yearly';
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'TRIALING' | 'PAST_DUE';
  currentPeriodEnd: string;
  cancelledAt?: string;
}

export interface PaymentInitResponse {
  authorizationUrl: string;
  reference: string;
  amountKobo: number;
}

// ─── API Response wrapper ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}