'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { educenterAPI } from '../../../../lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
    TrendingUp,
    ArrowRight,
    Trophy,
    Target,
    Clock,
    Calendar,
    BookOpen,
    Award,
    Zap,
} from 'lucide-react';

interface SubjectProgress {
    subject: string;
    examType: string;
    questionsAttempted: number;
    correctAnswers: number;
    totalTimeSpent: number;
    lastPractice: string;
    streakDays?: number;
}

export default function ProgressPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    const examType = searchParams.get('examType') || '';
    const subject = searchParams.get('subject') || '';

    const [progress, setProgress] = useState<SubjectProgress | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            toast.error('Please login to view progress');
            router.push('/login');
            return;
        }

        loadProgress();
    }, [user, router]);

    const loadProgress = async () => {
        try {
            setLoading(true);
            const response = await educenterAPI.getProgress();
            const dashboard = response.data;
            setProgress({
                subject: subject || 'Overall',
                examType: examType || '',
                questionsAttempted: dashboard.questionsAnswered,
                correctAnswers: Math.round((dashboard.avgScore / 100) * dashboard.questionsAnswered),
                totalTimeSpent: dashboard.totalSessions * 60,
                lastPractice: new Date().toISOString(),
            });
        } catch (error: any) {
            console.error('Error loading progress:', error);
            toast.error('Failed to load progress');
        } finally {
            setLoading(false);
        }
    };

    const getAccuracy = () => {
        if (!progress || progress.questionsAttempted === 0) return 0;
        return Math.round((progress.correctAnswers / progress.questionsAttempted) * 100);
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    const getPerformanceLevel = (accuracy: number) => {
        if (accuracy >= 90) return { level: 'Excellent', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' };
        if (accuracy >= 80) return { level: 'Very Good', color: 'text-[#2A4A6E] dark:text-[#FFC800]', bg: 'bg-blue-100 dark:bg-blue-900/30' };
        if (accuracy >= 70) return { level: 'Good', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30' };
        if (accuracy >= 60) return { level: 'Fair', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' };
        return { level: 'Needs Improvement', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' };
    };

    const getStrengthLevel = (questionsAttempted: number) => {
        if (questionsAttempted >= 500) return { label: 'Expert', color: 'text-[#2A4A6E] dark:text-purple-400' };
        if (questionsAttempted >= 200) return { label: 'Advanced', color: 'text-[#2A4A6E] dark:text-[#FFC800]' };
        if (questionsAttempted >= 100) return { label: 'Intermediate', color: 'text-green-600 dark:text-green-400' };
        if (questionsAttempted >= 50) return { label: 'Beginner', color: 'text-yellow-600 dark:text-yellow-400' };
        return { label: 'Novice', color: 'text-gray-600 dark:text-gray-400' };
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading progress...</p>
                </div>
            </div>
        );
    }

    if (!progress || progress.questionsAttempted === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2A4A6E] text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <Link
                            href="/study-hub"
                            className="inline-flex items-center text-blue-100 hover:text-white mb-4 transition-colors"
                        >
                            <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
                            Back to Study Hub
                        </Link>
                        <h1 className="text-4xl font-bold">Progress Analytics</h1>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                        <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No progress data yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Start practicing to track your progress and performance
                        </p>
                        <Link
                            href="/study-hub/subjects"
                            className="inline-flex items-center space-x-2 bg-[#00143C] text-white px-6 py-3 rounded-lg hover:bg-[#1E3A5F] transition-colors"
                        >
                            <span>Start Practicing</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const accuracy = getAccuracy();
    const performanceLevel = getPerformanceLevel(accuracy);
    const strengthLevel = getStrengthLevel(progress.questionsAttempted);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2A4A6E] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Link
                        href="/study-hub"
                        className="inline-flex items-center text-blue-100 hover:text-white mb-4 transition-colors"
                    >
                        <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
                        Back to Study Hub
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2 flex items-center">
                                <TrendingUp className="w-10 h-10 mr-3" />
                                Progress Analytics
                            </h1>
                            {subject && (
                                <p className="text-blue-100 capitalize">
                                    {subject} - {examType}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Overall Performance Card */}
                <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2A4A6E] rounded-2xl p-8 mb-8 text-white">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Overall Performance</h2>
                            <div className={`inline-block px-4 py-2 rounded-full ${performanceLevel.bg} border border-white/20`}>
                                <span className="font-semibold text-white">{performanceLevel.level}</span>
                            </div>
                        </div>
                        <Trophy className="w-16 h-16 text-white/30" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <p className="text-blue-100 text-sm mb-1">Accuracy</p>
                            <p className="text-4xl font-bold">{accuracy}%</p>
                        </div>
                        <div>
                            <p className="text-blue-100 text-sm mb-1">Questions</p>
                            <p className="text-4xl font-bold">{progress.questionsAttempted}</p>
                        </div>
                        <div>
                            <p className="text-blue-100 text-sm mb-1">Correct</p>
                            <p className="text-4xl font-bold">{progress.correctAnswers}</p>
                        </div>
                        <div>
                            <p className="text-blue-100 text-sm mb-1">Study Time</p>
                            <p className="text-4xl font-bold">{formatTime(progress.totalTimeSpent)}</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Mastery Level */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Mastery Level</h3>
                            <Award className="w-8 h-8 text-purple-500" />
                        </div>
                        <div className={`text-3xl font-bold ${strengthLevel.color} mb-2`}>
                            {strengthLevel.label}
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
                                style={{
                                    width: `${Math.min((progress.questionsAttempted / 500) * 100, 100)}%`,
                                }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {500 - progress.questionsAttempted > 0
                                ? `${500 - progress.questionsAttempted} more to Expert`
                                : 'Expert level achieved!'}
                        </p>
                    </div>

                    {/* Streak */}
                    {progress.streakDays !== undefined && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Study Streak</h3>
                                <Zap className="w-8 h-8 text-orange-500" />
                            </div>
                            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                                {progress.streakDays} days
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Keep it up! Consistency is key to success
                            </p>
                        </div>
                    )}

                    {/* Last Practice */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Last Practice</h3>
                            <Calendar className="w-8 h-8 text-blue-500" />
                        </div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {new Date(progress.lastPractice).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(progress.lastPractice).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                    </div>
                </div>

                {/* Detailed Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Performance Breakdown */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <Target className="w-6 h-6 mr-2 text-blue-500" />
                            Performance Breakdown
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Correct Answers</span>
                                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                        {progress.correctAnswers} / {progress.questionsAttempted}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-green-500 h-2 rounded-full"
                                        style={{ width: `${accuracy}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Incorrect Answers</span>
                                    <span className="text-sm font-bold text-red-600 dark:text-red-400">
                                        {progress.questionsAttempted - progress.correctAnswers} / {progress.questionsAttempted}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-red-500 h-2 rounded-full"
                                        style={{ width: `${100 - accuracy}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Study Insights */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <BookOpen className="w-6 h-6 mr-2 text-purple-500" />
                            Study Insights
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Clock className="w-5 h-5 text-[#2A4A6E] dark:text-[#FFC800]" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Avg. Time per Question
                                    </span>
                                </div>
                                <span className="font-bold text-[#2A4A6E] dark:text-[#FFC800]">
                                    {Math.round(progress.totalTimeSpent / progress.questionsAttempted)}s
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Trophy className="w-5 h-5 text-[#2A4A6E] dark:text-purple-400" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Success Rate
                                    </span>
                                </div>
                                <span className="font-bold text-[#2A4A6E] dark:text-purple-400">
                                    {accuracy}%
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Total Study Time
                                    </span>
                                </div>
                                <span className="font-bold text-green-600 dark:text-green-400">
                                    {formatTime(progress.totalTimeSpent)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommendations */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-800 p-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <Target className="w-6 h-6 mr-2 text-yellow-600 dark:text-yellow-400" />
                        Recommendations
                    </h3>
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                        {accuracy < 70 && (
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Focus on understanding concepts rather than memorizing. Review explanations carefully.</span>
                            </li>
                        )}
                        {progress.questionsAttempted < 100 && (
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Practice more questions to build confidence and familiarity with exam patterns.</span>
                            </li>
                        )}
                        {progress.streakDays && progress.streakDays < 3 && (
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Try to practice daily to build a strong study habit and improve retention.</span>
                            </li>
                        )}
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Review your quiz history to identify patterns in your mistakes.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Challenge yourself on the leaderboard to stay motivated!</span>
                        </li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex items-center justify-center space-x-4">
                    <Link
                        href="/study-hub/subjects"
                        className="inline-flex items-center space-x-2 bg-[#00143C] text-white px-6 py-3 rounded-lg hover:bg-[#1E3A5F] transition-colors"
                    >
                        <BookOpen className="w-5 h-5" />
                        <span>Continue Practicing</span>
                    </Link>
                    <Link
                        href="/study-hub/history"
                        className="inline-flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        <Clock className="w-5 h-5" />
                        <span>View History</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

