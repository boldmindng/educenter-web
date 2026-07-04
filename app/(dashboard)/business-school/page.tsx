'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { educenterAPI } from '../../../lib/api';
import { COURSE_CATEGORIES } from '../../../lib/config';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
    TrendingUp,
    ArrowRight,
    Lock,
    PlayCircle,
    //   Clock,
    Users,
    Star,
    BookOpen,
    CheckCircle,
} from 'lucide-react';

interface Course {
    id: string;
    slug: string;
    title: string;
    description?: string;
    category?: string;
    level?: string;
    isPublished: boolean;
    enrollCount?: number;
    createdAt: string;
}

export default function BusinessSchoolPage() {
    const router = useRouter();
    const { user } = useAuth();

    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [subscription, setSubscription] = useState<any>(null);

    useEffect(() => {
        if (!user) {
            toast.error('Please login to access Business School');
            router.push('/login');
            return;
        }

        loadSubscription();
        loadCourses();
    }, [user, router, selectedCategory]);

    const loadSubscription = async () => {
        try {
            const response = await educenterAPI.getMySubscription();
            setSubscription(response.data);
        } catch (error) {
            console.error('Error loading subscription:', error);
        }
    };

    const loadCourses = async () => {
        try {
            setLoading(true as boolean);
            const response = await educenterAPI.getCourses({
                category: selectedCategory || undefined,
            });
            setCourses(response.data || []);
        } catch (error) {
            console.error('Error loading courses:', error);
            toast.error('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (courseId: string) => {
        if (!subscription?.active) {
            toast.error('Please subscribe to enroll in courses');
            router.push('/subscription');
            return;
        }

        try {
            await educenterAPI.enrollCourse(courseId);
            toast.success('Successfully enrolled!');
            router.push(`/business-school/courses/${courseId}`);
        } catch (error: any) {
            console.error('Error enrolling:', error);
            toast.error(error.response?.data?.message || 'Failed to enroll');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading courses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center text-purple-100 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
                        Back to Dashboard
                    </Link>

                    <div className="text-center">
                        <h1 className="text-5xl font-bold mb-4">Digital Business School</h1>
                        <p className="text-xl text-purple-100 mb-8">
                            Master digital marketing, sales, and entrepreneurship
                        </p>

                        {!subscription?.active && (
                            <Link
                                href="/subscription"
                                className="inline-flex items-center space-x-2 bg-white text-[#2A4A6E] px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-lg"
                            >
                                <Lock className="w-5 h-5" />
                                <span>Subscribe to Access All Courses</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Courses</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                    {courses.length}
                                </p>
                            </div>
                            <BookOpen className="w-10 h-10 text-purple-500" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                    {COURSE_CATEGORIES.length}
                                </p>
                            </div>
                            <TrendingUp className="w-10 h-10 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Students</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                    {courses.reduce((sum, course) => sum + (course.enrollCount || 0), 0)}
                                </p>
                            </div>
                            <Users className="w-10 h-10 text-green-500" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Your Status</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                                    {subscription?.active ? 'Active' : 'Inactive'}
                                </p>
                            </div>
                            {subscription?.active ? (
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            ) : (
                                <Lock className="w-10 h-10 text-gray-400" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                        <button
                            onClick={() => setSelectedCategory('')}
                            className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${selectedCategory === ''
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            All Courses
                        </button>
                        {COURSE_CATEGORIES.map((category) => (
                            <button
                                key={category.value}
                                onClick={() => setSelectedCategory(category.value)}
                                className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${selectedCategory === category.value
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Courses Grid */}
                {courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all group"
                            >
                                <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center relative">
                                    <BookOpen className="w-20 h-20 text-white/30" />
                                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                        <span className="text-white text-sm font-semibold capitalize">{course.level}</span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-[#2A4A6E] dark:text-purple-400 text-sm font-semibold rounded-full capitalize">
                                            {course.category?.replace('-', ' ')}
                                        </span>
                                        <div className="flex items-center space-x-1 text-yellow-500">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span className="text-sm font-semibold">4.8</span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#2A4A6E] dark:group-hover:text-purple-400 transition-colors">
                                        {course.title}
                                    </h3>

                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                        {course.description}
                                    </p>

                                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="flex items-center space-x-1">
                                            <PlayCircle className="w-4 h-4" />
                                            <span>Online course</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Users className="w-4 h-4" />
                                            <span>{course.enrollCount || 0} students</span>
                                        </div>
                                    </div>

                                    {subscription?.active ? (
                                        <button
                                            onClick={() => handleEnroll(course.id)}
                                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                                        >
                                            Enroll Now
                                        </button>
                                    ) : (
                                        <Link
                                            href="/subscription"
                                            className="block w-full text-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 py-3 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            <Lock className="inline w-4 h-4 mr-2" />
                                            Subscribe to Access
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No courses available
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {selectedCategory
                                ? 'No courses in this category yet. Try another category.'
                                : 'Courses are coming soon. Check back later!'}
                        </p>
                    </div>
                )}

                {/* Features */}
                <div className="mt-16 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 p-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                        Why Choose Our Business School?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Expert-Led Content</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Learn from industry professionals with real-world experience
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                                <PlayCircle className="w-6 h-6" />
                            </div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Practical Projects</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Build real projects and apply what you learn immediately
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                                <Users className="w-6 h-6" />
                            </div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Community Support</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Join a community of entrepreneurs and marketers
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

