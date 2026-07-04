'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { educenterAPI } from '../../../../lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
    History,
    ArrowRight,
    Trophy,
    Clock,
    Calendar,
    CheckCircle,
    // XCircle,
    Eye,
} from 'lucide-react';

interface Quiz {
    id: string;
    examType: string;
    subject: string;
    totalQuestions: number;
    score: number | null;
    timeSpent: number | null;
    status: string;
    startedAt: string;
    completedAt: string | null;
}

export default function QuizHistoryPage() {
    const router = useRouter();
    const { user } = useAuth();

    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'completed' | 'in_progress'>('all');

    useEffect(() => {
        if (!user) {
            toast.error('Please login to view history');
            router.push('/login');
            return;
        }

        loadQuizzes();
    }, [user, router]);

    const loadQuizzes = async () => {
        try {
            setLoading(true);
            const response = await educenterAPI.getMyQuizzes();
            setQuizzes((response.data as unknown as Quiz[]) || []);
        } catch (error: any) {
            console.error('Error loading quizzes:', error);
            toast.error('Failed to load quiz history');
        } finally {
            setLoading(false);
        }
    };

    const filteredQuizzes = quizzes.filter(quiz => {
        if (filter === 'all') return true;
        if (filter === 'completed') return quiz.status === 'COMPLETED';
        if (filter === 'in_progress') return quiz.status === 'IN_PROGRESS';
        return true;
    });

    const formatTime = (seconds: number | null) => {
        if (!seconds) return 'N/A';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getPercentage = (quiz: Quiz) => {
        if (!quiz.score || !quiz.totalQuestions) return 0;
        return Math.round((quiz.score / quiz.totalQuestions) * 100);
    };

    const getGrade = (percentage: number) => {
        if (percentage >= 90) return { grade: 'A', color: 'text-green-600 dark:text-green-400' };
        if (percentage >= 80) return { grade: 'B', color: 'text-[#2A4A6E] dark:text-[#FFC800]' };
        if (percentage >= 70) return { grade: 'C', color: 'text-yellow-600 dark:text-yellow-400' };
        if (percentage >= 60) return { grade: 'D', color: 'text-orange-600 dark:text-orange-400' };
        return { grade: 'F', color: 'text-red-600 dark:text-red-400' };
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading quiz history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2A4A6E] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Link
                        href="/study-hub"
                        className="inline-flex items-center text-purple-100 hover:text-white mb-4 transition-colors"
                    >
                        <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
                        Back to Study Hub
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2 flex items-center">
                                <History className="w-10 h-10 mr-3" />
                                Quiz History
                            </h1>
                            <p className="text-purple-100">Review your past quiz attempts</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Quizzes</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                    {quizzes.length}
                                </p>
                            </div>
                            <History className="w-10 h-10 text-purple-500" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                    {quizzes.filter(q => q.status === 'COMPLETED').length}
                                </p>
                            </div>
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                    {quizzes.filter(q => q.status === 'IN_PROGRESS').length}
                                </p>
                            </div>
                            <Clock className="w-10 h-10 text-yellow-500" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Score</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                    {quizzes.filter(q => q.score).length > 0
                                        ? Math.round(
                                            quizzes
                                                .filter(q => q.score && q.totalQuestions)
                                                .reduce((sum, q) => sum + getPercentage(q), 0) /
                                            quizzes.filter(q => q.score).length
                                        )
                                        : 0}%
                                </p>
                            </div>
                            <Trophy className="w-10 h-10 text-blue-500" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                                ? 'bg-[#00143C] text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            All ({quizzes.length})
                        </button>
                        <button
                            onClick={() => setFilter('completed')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'completed'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            Completed ({quizzes.filter(q => q.status === 'COMPLETED').length})
                        </button>
                        <button
                            onClick={() => setFilter('in_progress')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'in_progress'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            In Progress ({quizzes.filter(q => q.status === 'IN_PROGRESS').length})
                        </button>
                    </div>
                </div>

                {/* Quiz List */}
                {filteredQuizzes.length > 0 ? (
                    <div className="space-y-4">
                        {filteredQuizzes.map((quiz) => {
                            const percentage = getPercentage(quiz);
                            const gradeInfo = getGrade(percentage);

                            return (
                                <div
                                    key={quiz.id}
                                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                                                    {quiz.subject}
                                                </h3>
                                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-[#2A4A6E] dark:text-[#FFC800] rounded-full text-sm font-semibold">
                                                    {quiz.examType}
                                                </span>
                                                {quiz.status === 'COMPLETED' ? (
                                                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm font-semibold">
                                                        Completed
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full text-sm font-semibold">
                                                        In Progress
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{formatDate(quiz.startedAt)}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{formatTime(quiz.timeSpent)}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Trophy className="w-4 h-4" />
                                                    <span>{quiz.totalQuestions} questions</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-6">
                                            {quiz.status === 'COMPLETED' && quiz.score !== null && (
                                                <div className="text-center">
                                                    <div className={`text-4xl font-bold ${gradeInfo.color}`}>
                                                        {percentage}%
                                                    </div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                                        {quiz.score}/{quiz.totalQuestions} correct
                                                    </div>
                                                    <div className={`text-2xl font-bold ${gradeInfo.color} mt-1`}>
                                                        Grade: {gradeInfo.grade}
                                                    </div>
                                                </div>
                                            )}

                                            <Link
                                                href={`/study-hub/quiz/${quiz.id}`}
                                                className="flex items-center space-x-2 bg-[#00143C] text-white px-6 py-3 rounded-lg hover:bg-[#1E3A5F] transition-colors"
                                            >
                                                <Eye className="w-5 h-5" />
                                                <span>{quiz.status === 'COMPLETED' ? 'Review' : 'Continue'}</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                        <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {filter === 'all' ? 'No quizzes yet' : `No ${filter.replace('_', ' ')} quizzes`}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {filter === 'all'
                                ? 'Start practicing to see your quiz history here'
                                : `You don't have any ${filter.replace('_', ' ')} quizzes`}
                        </p>
                        <Link
                            href="/study-hub/subjects"
                            className="inline-flex items-center space-x-2 bg-[#00143C] text-white px-6 py-3 rounded-lg hover:bg-[#1E3A5F] transition-colors"
                        >
                            <span>Start Practicing</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

