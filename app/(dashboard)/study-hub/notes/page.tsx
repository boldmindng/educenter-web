'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { educenterAPI } from '../../../../lib/api';
import { EXAM_TYPES } from '../../../../lib/config';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
    BookOpen,
    Download,
    ArrowRight,
    FileText,
    Lock,
    CheckCircle,
    Search,
} from 'lucide-react';

interface Note {
    id: string;
    title: string;
    content: string;
    topicsCovered: string[];
}

export default function NotesPage() {
    const router = useRouter();
    const { user } = useAuth();

    const [selectedExamType, setSelectedExamType] = useState('JAMB');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [subjects, setSubjects] = useState<string[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingSubjects, setLoadingSubjects] = useState(true);
    const [subscription, setSubscription] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!user) {
            toast.error('Please login to access notes');
            router.push('/login');
            return;
        }

        loadSubscription();
        loadSubjects();
    }, [user, router, selectedExamType]);

    const loadSubscription = async () => {
        try {
            const response = await educenterAPI.getMySubscription();
            setSubscription(response.data);
        } catch (error) {
            console.error('Error loading subscription:', error);
        }
    };

    const loadSubjects = async () => {
        try {
            setLoadingSubjects(true);
            const response = await educenterAPI.getSubjects(selectedExamType as any);
            setSubjects(response.data || []);
        } catch (error) {
            console.error('Error loading subjects:', error);
            toast.error('Failed to load subjects');
        } finally {
            setLoadingSubjects(false);
        }
    };

    const loadNotes = async () => {
        if (!selectedSubject) {
            toast.error('Please select a subject');
            return;
        }

        if (!subscription?.active) {
            toast.error('Please subscribe to access notes');
            router.push('/subscription');
            return;
        }

        try {
            setLoading(true);
            const response = await educenterAPI.getNotes(selectedExamType as any, selectedSubject);
            const noteData = ((response.data as unknown as any[]) || []).map((q: any) => ({
                id: q.id,
                title: q.topic || q.subject || 'Note',
                content: q.explanation || q.question || '',
                topicsCovered: [q.topic || q.subject].filter(Boolean) as string[],
            }));
            setNotes(noteData);
        } catch (error: any) {
            console.error('Error loading notes:', error);
            toast.error(error.response?.data?.error || 'Failed to load notes');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadNote = async (noteId: string) => {
        if (!subscription?.active) {
            toast.error('Please subscribe to download notes');
            router.push('/subscription');
            return;
        }

        try {
            await educenterAPI.downloadNote(noteId);
            toast.success('Note download started');
        } catch (error: any) {
            console.error('Error downloading note:', error);
            toast.error(error.response?.data?.error || 'Failed to download note');
        }
    };

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.topicsCovered.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Link
                        href="/study-hub"
                        className="inline-flex items-center text-green-100 hover:text-white mb-4 transition-colors"
                    >
                        <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
                        Back to Study Hub
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2 flex items-center">
                                <BookOpen className="w-10 h-10 mr-3" />
                                Study Notes
                            </h1>
                            <p className="text-green-100">Download comprehensive study materials</p>
                        </div>
                        {!subscription?.active && (
                            <Link
                                href="/subscription"
                                className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                            >
                                Subscribe to Access
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Exam Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Exam Type
                            </label>
                            <select
                                value={selectedExamType}
                                onChange={(e) => setSelectedExamType(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                            >
                                {EXAM_TYPES.map(exam => (
                                    <option key={exam.value} value={exam.value}>
                                        {exam.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Subject
                            </label>
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                disabled={loadingSubjects}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                            >
                                <option value="">Select Subject</option>
                                {subjects.map(subject => (
                                    <option key={subject} value={subject}>
                                        {subject}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Load Button */}
                        <div className="flex items-end">
                            <button
                                onClick={loadNotes}
                                disabled={!selectedSubject || loading}
                                className="w-full bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Loading...' : 'Load Notes'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search */}
                {notes.length > 0 && (
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search notes by title or topic..."
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                )}

                {/* Notes Grid */}
                {filteredNotes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNotes.map((note) => (
                            <div
                                key={note.id}
                                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <FileText className="w-10 h-10 text-green-500" />
                                    {subscription?.active ? (
                                        <CheckCircle className="w-6 h-6 text-green-500" />
                                    ) : (
                                        <Lock className="w-6 h-6 text-gray-400" />
                                    )}
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    {note.title}
                                </h3>

                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Topics Covered:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {note.topicsCovered.slice(0, 3).map((topic, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded-full"
                                            >
                                                {topic}
                                            </span>
                                        ))}
                                        {note.topicsCovered.length > 3 && (
                                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                                                +{note.topicsCovered.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDownloadNote(note.id)}
                                    disabled={!subscription?.active}
                                    className={`w-full flex items-center justify-center space-x-2 py-2 rounded-lg font-semibold transition-colors ${subscription?.active
                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    <Download className="w-5 h-5" />
                                    <span>{subscription?.active ? 'Download' : 'Subscribe to Download'}</span>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : notes.length === 0 && selectedSubject && !loading ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No notes available
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Notes for this subject are coming soon. Check back later!
                        </p>
                    </div>
                ) : !selectedSubject && !loading ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Select a subject to view notes
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Choose an exam type and subject from the filters above
                        </p>
                    </div>
                ) : null}

                {/* Info Box */}
                {subscription?.active && (
                    <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6">
                        <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-3">
                            📚 How to use study notes effectively
                        </h3>
                        <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Read through the notes before practicing questions</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Make summary cards of key points for quick revision</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Test yourself on the topics covered after reading</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Download notes for offline study access</span>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}