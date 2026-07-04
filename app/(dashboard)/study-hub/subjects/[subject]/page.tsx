'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { educenterAPI } from '../../../../../lib/api';
import toast from 'react-hot-toast';
import {
    Calendar,
    ArrowRight,
    PlayCircle,
    BookOpen,
    Trophy,
    TrendingUp,
} from 'lucide-react';

export default function SubjectDetailPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();

    const subject = params['subject'] as string;
    const examType = (searchParams.get('examType') || 'jamb').toLowerCase();

    const [years, setYears] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadYears();
    }, [examType]);

    const loadYears = async () => {
        try {
            setLoading(true);
            const response = await educenterAPI.getYears(examType);
            setYears(response.data || []);
        } catch (error) {
            console.error('Error loading years:', error);
            toast.error('Failed to load years');
        } finally {
            setLoading(false);
        }
    };

    const handleYearClick = (year: string) => {
        router.push(`/study-hub/practice/${subject}/${year}?examType=${examType}&subject=${subject}`);
    };

    const startRandomQuiz = () => {
        router.push(`/study-hub/practice/${subject}/all?examType=${examType}&subject=${subject}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading years...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Link
                        href={`/study-hub/subjects?examType=${examType}`}
                        className="inline-flex items-center text-blue-100 hover:text-white mb-4 transition-colors"
                    >
                        <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
                        Back to Subjects
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2 capitalize">{subject}</h1>
                            <p className="text-blue-100">{examType.toUpperCase()} Past Questions</p>
                        </div>
                        <BookOpen className="w-16 h-16 text-white/20" />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <button
                        onClick={startRandomQuiz}
                        className="bg-gradient-to-r from-[#1E3A5F] to-[#2A4A6E] text-white rounded-2xl p-6 hover:shadow-xl hover:scale-105 transition-all text-left group"
                    >
                        <PlayCircle className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-bold mb-2">Quick Practice</h3>
                        <p className="text-blue-100 text-sm">Start with random questions from all years</p>
                    </button>

                    <Link
                        href={`/study-hub/progress?subject=${subject}&examType=${examType}`}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all group"
                    >
                        <TrendingUp className="w-12 h-12 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">My Progress</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">View your performance analytics</p>
                    </Link>

                    <Link
                        href={`/study-hub/leaderboard?subject=${subject}&examType=${examType}`}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all group"
                    >
                        <Trophy className="w-12 h-12 text-yellow-500 mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Leaderboard</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">See how you rank against others</p>
                    </Link>
                </div>

                {/* Years Selection */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Select Year
                    </h2>

                    {years.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {years.map((year) => (
                                <button
                                    key={year}
                                    onClick={() => handleYearClick(year)}
                                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-105 hover:border-blue-500 transition-all group"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <Calendar className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
                                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {year}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Past Questions
                                    </p>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                No years available
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Questions for this subject are coming soon
                            </p>
                            <button
                                onClick={() => router.back()}
                                className="inline-flex items-center space-x-2 bg-[#00143C] text-white px-6 py-3 rounded-lg hover:bg-[#1E3A5F] transition-colors"
                            >
                                <ArrowRight className="w-5 h-5 rotate-180" />
                                <span>Choose Another Subject</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Tips Section */}
                {years.length > 0 && (
                    <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-8">
                        <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                            💡 Study Tips
                        </h3>
                        <ul className="space-y-3 text-blue-800 dark:text-blue-200">
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Start with recent years to understand current exam patterns</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Practice older years to cover all possible topics</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Use Quick Practice to get a mix of questions from all years</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Review your mistakes to improve your weak areas</span>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

