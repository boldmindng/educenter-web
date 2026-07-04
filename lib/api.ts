
import { boldMindAPI, type ExamType, type StartCbtPayload } from '@boldmindng/api-client';

class EducenterAPI {
  // ==================== Users ====================

  async getUser(uid: string) {
    return boldMindAPI.users.get(uid);
  }

  async updateUser(uid: string, data: any) {
    return boldMindAPI.users.update(uid, data);
  }

  async createUser(data: any) {
    return boldMindAPI.users.updateProfile(data.uid, data);
  }

  async getCurrentUserDashboard() {
    return boldMindAPI.users.dashboard();
  }

  // ==================== Subjects ====================

  async getSubjects(examType: string) {
    return boldMindAPI.educenter.subjects(examType as ExamType);
  }

  // ==================== Years ====================

  async getYears(_examType: string): Promise<{ data: string[] }> {
    const currentYear = new Date().getFullYear();
    const years: string[] = [];
    for (let y = currentYear - 1; y >= 2000; y--) years.push(String(y));
    return { data: years };
  }

  // ==================== Notes ====================

  async getNotes(examType: ExamType, subject: string) {
    return boldMindAPI.educenter.questionsPreview({ examType, subject, limit: 100 });
  }

  async downloadNote(_noteId: string) {
    return boldMindAPI.educenter.questionsPreview({ limit: 1 });
  }

  // ==================== Questions ====================

  async getQuestionsPreview(params: {
    examType?: ExamType;
    subject?: string;
    limit?: number;
  }) {
    return boldMindAPI.educenter.questionsPreview(params);
  }

  async getTopQuestions(limit?: number) {
    return boldMindAPI.educenter.questionsPreview({ limit });
  }

  async getQuestionDetail(_id: string, subject: string) {
    // Note: You might need a dedicated endpoint for this
    // For now, using questionsPreview with filters
    return boldMindAPI.educenter.questionsPreview({ subject, limit: 1 });
  }

  // ==================== CBT/Quizzes ====================

  async startQuiz(data: {
    examType: ExamType;
    subject: string;
    numberOfQuestions?: number;
    year?: string;
  }) {
    return boldMindAPI.educenter.cbt.start(data as StartCbtPayload);
  }

  async startMockQuiz(data: {
    examType: ExamType;
    subject: string;
    numberOfQuestions?: number;
    year?: string;
  }) {
    return boldMindAPI.educenter.cbt.mock({ ...data, isMock: true });
  }

  async submitQuiz(quizId: string, answers: Record<string, string>, timeTaken?: number) {
    return boldMindAPI.educenter.cbt.submit(quizId, { answers, timeTaken });
  }

  async abandonQuiz(quizId: string) {
    return boldMindAPI.educenter.cbt.abandon(quizId);
  }

  async getQuiz(quizId: string) {
    return boldMindAPI.educenter.cbt.review(quizId);
  }

  async getMyQuizzes(params?: { page?: number; limit?: number }) {
    return boldMindAPI.educenter.sessions(params);
  }

  // ==================== Progress & Analytics ====================

  async getProgress() {
    return boldMindAPI.educenter.dashboard();
  }

  async getAnalytics(examType: ExamType, subject: string) {
    return boldMindAPI.educenter.analytics(examType, subject);
  }

  // ==================== Streak ====================

  async getStreak() {
    return boldMindAPI.educenter.streak.get();
  }

  async setStreakGoal(dailyGoal: number) {
    return boldMindAPI.educenter.streak.setGoal(dailyGoal);
  }

  // ==================== Leaderboard ====================

  async getLeaderboard(params?: {
    examType?: ExamType;
    subject?: string;
    page?: number;
  }) {
    return boldMindAPI.educenter.leaderboard.global(params);
  }

  async getMyRank(params?: {
    examType?: ExamType;
    subject?: string;
  }) {
    return boldMindAPI.educenter.leaderboard.myRank(params);
  }

  // ==================== AI Tutor ====================

  async askAiTutor(question: string, subject?: string, examType?: ExamType, context?: string) {
    return boldMindAPI.educenter.aiTutor({ question, subject, examType, context });
  }

  // ==================== Study Plan ====================

  async generateStudyPlan(examType: ExamType, subjects: string[], examDate: string, dailyHours?: number) {
    return boldMindAPI.educenter.studyPlan({ examType, subjects, examDate, dailyHours });
  }

  // ==================== Courses ====================

  async getCourses(params?: {
    category?: string;
    level?: string;
  }) {
    return boldMindAPI.educenter.courses.list(params);
  }

  async getCourse(slug: string) {
    return boldMindAPI.educenter.courses.get(slug);
  }

  async getMarketingPlaybooks() {
    return boldMindAPI.educenter.courses.marketingPlaybooks();
  }

  async getAiToolsTraining() {
    return boldMindAPI.educenter.courses.aiToolsTraining();
  }

  async createCourse(data: any) {
    return boldMindAPI.educenter.courses.create(data);
  }

  async updateCourse(courseId: string, _data: any) {
    return boldMindAPI.educenter.courses.publish(courseId);
  }

  async enrollCourse(courseId: string) {
    return boldMindAPI.educenter.courses.enroll(courseId);
  }

  async updateEnrollmentProgress(courseId: string, progressPercentage: number, completedAt?: string) {
    return boldMindAPI.educenter.courses.updateProgress(courseId, { progressPercentage, completedAt });
  }

  async publishCourse(courseId: string) {
    return boldMindAPI.educenter.courses.publish(courseId);
  }

  // ==================== Subscriptions ====================

  async subscribe(_plan: string) {
    // Note: Subscription management might be in payment API
    return boldMindAPI.payments.subscriptions();
  }

  async getMySubscription() {
    return boldMindAPI.payments.subscriptions();
  }

  async initializePayment(data: {
    productSlug: string;
    plan: string;
    email: string;
    callbackUrl: string;
    amount?: number;
    metadata?: Record<string, unknown>;
  }) {
    return boldMindAPI.payments.initialize(data);
  }

  async verifyPayment(reference: string) {
    return boldMindAPI.payments.verify(reference);
  }

  async getPaymentHistory() {
    return boldMindAPI.payments.history();
  }

  async checkProductAccess(productSlug: string) {
    return boldMindAPI.payments.checkAccess(productSlug);
  }

  async joinWaitlist(data: { email: string; productSlug: string; name?: string }) {
    return boldMindAPI.payments.joinWaitlist(data);
  }

}

// Export instance
export const educenterAPI = new EducenterAPI();