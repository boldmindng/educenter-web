'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { educenterAPI } from '../../../../lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
    Trophy,
    Medal,
    TrendingUp,
    ArrowRight,
    Crown,
    Award,
    Filter,
} from 'lucide-react';

interface LeaderboardEntry {
    rank: number;
    userId: string;
    fullName?: string;
    avatar?: string;
    score: number;
    sessions: number;
    streakDays?: number;
}

interface UserRank {
    rank: number;
    userId: string;
    score: number;
    sessions: number;
}

export default function LeaderboardPage() {
    // const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    const examType = searchParams.get('examType') || '';
    const subject = searchParams.get('subject') || '';

    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [userRank, setUserRank] = useState<UserRank | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedExamType, setSelectedExamType] = useState(examType);
    const [selectedSubject, setSelectedSubject] = useState(subject);

    useEffect(() => {
        loadLeaderboard();
        if (user) {
            loadUserRank();
        }
    }, [selectedExamType, selectedSubject, user]);

    const loadLeaderboard = async () => {
        try {
            setLoading(true);
            const response = await educenterAPI.getLeaderboard({
                examType: (selectedExamType as any) || undefined,
                subject: selectedSubject || undefined,
            });
            setLeaderboard(response.data || []);
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            toast.error('Failed to load leaderboard');
        } finally {
            setLoading(false);
        }
    };

    const loadUserRank = async () => {
        if (!user) return;

        try {
            const response = await educenterAPI.getMyRank({
                examType: (selectedExamType as any) || undefined,
                subject: selectedSubject || undefined,
            });
            setUserRank(response.data as unknown as UserRank);
        } catch (error) {
            console.error('Error loading user rank:', error);
        }
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
        if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
        if (rank === 3) return <Medal className="w-6 h-6 text-orange-600" />;
        return null;
    };

    const getRankBadge = (rank: number) => {
        if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
        if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
        if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading leaderboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Link
                        href="/study-hub"
                        className="inline-flex items-center text-yellow-100 hover:text-white mb-4 transition-colors"
                    >
                        <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
                        Back to Study Hub
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2 flex items-center">
                                <Trophy className="w-10 h-10 mr-3" />
                                Leaderboard
                            </h1>
                            <p className="text-yellow-100">See how you rank against other students</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
                    <div className="flex items-center space-x-2 mb-4">
                        <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Filter Leaderboard</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Exam Type
                            </label>
                            <select
                                value={selectedExamType}
                                onChange={(e) => setSelectedExamType(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Exams</option>
                                <option value="jamb">JAMB</option>
                                <option value="waec">WAEC</option>
                                <option value="neco">NECO</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Subject
                            </label>
                            <input
                                type="text"
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                placeholder="All subjects"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* User Rank Card */}
                {userRank && (
                    <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2A4A6E] text-white rounded-2xl p-6 mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 mb-1">Your Rank</p>
                                <h2 className="text-4xl font-bold">#{userRank.rank}</h2>
                                <p className="text-blue-100 mt-1">Score: {userRank.score}</p>
                            </div>
                            <TrendingUp className="w-16 h-16 text-white/30" />
                        </div>
                    </div>
                )}

                {/* Top 3 Podium */}
                {leaderboard.length >= 3 && (
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {/* 2nd Place */}
                        <div className="pt-12">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-300 dark:border-gray-600 p-6 text-center">
                                <div className="flex justify-center mb-3">
                                    <Medal className="w-12 h-12 text-gray-400" />
                                </div>
                                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-gray-700 dark:text-gray-300">
                                    2
                                </div>
                                <p className="font-bold text-gray-900 dark:text-white mb-1">User #{leaderboard[1]?.userId.slice(0, 8)}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Score: {leaderboard[1]?.score}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">{leaderboard[1]?.sessions} sessions</p>
                            </div>
                        </div>

                        {/* 1st Place */}
                        <div>
                            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl border-4 border-yellow-500 p-6 text-center">
                                <div className="flex justify-center mb-3">
                                    <Crown className="w-16 h-16 text-white" />
                                </div>
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-3xl font-bold text-yellow-600">
                                    1
                                </div>
                                <p className="font-bold text-white mb-1">User #{leaderboard[0]?.userId.slice(0, 8)}</p>
                                <p className="text-sm text-yellow-100">Score: {leaderboard[0]?.score}</p>
                                <p className="text-xs text-yellow-200">{leaderboard[0]?.sessions} sessions</p>
                            </div>
                        </div>

                        {/* 3rd Place */}
                        <div className="pt-12">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-orange-400 dark:border-orange-600 p-6 text-center">
                                <div className="flex justify-center mb-3">
                                    <Medal className="w-12 h-12 text-orange-600" />
                                </div>
                                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-orange-600">
                                    3
                                </div>
                                <p className="font-bold text-gray-900 dark:text-white mb-1">User #{leaderboard[2]?.userId.slice(0, 8)}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Score: {leaderboard[2]?.score}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">{leaderboard[2]?.sessions} sessions</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Full Leaderboard */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Rank</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">User</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Sessions</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Score</th>
                                    {leaderboard.some(e => e.streakDays) && (
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Streak</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {leaderboard.map((entry, index) => (
                                    <tr
                                        key={index}
                                        className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${entry.userId === user?.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                            }`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                {getRankIcon(entry.rank)}
                                                <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getRankBadge(entry.rank)}`}>
                                                    {entry.rank}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                    {entry.userId.slice(0, 2).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    User #{entry.userId.slice(0, 8)}
                                                    {entry.userId === user?.id && (
                                                        <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded-full">You</span>
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 dark:text-white">{entry.sessions}</td>
                                        <td className="px-6 py-4 text-green-600 dark:text-green-400 font-semibold">{entry.score}</td>
                                        {leaderboard.some(e => e.streakDays) && (
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center space-x-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-sm font-semibold">
                                                    <Award className="w-4 h-4" />
                                                    <span>{entry.streakDays || 0} days</span>
                                                </span>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {leaderboard.length === 0 && (
                        <div className="text-center py-12">
                            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                No data available
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Be the first to start practicing and get on the leaderboard!
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
        </div>
    );
}

