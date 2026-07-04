//APPS/WEB_APPS/educenter/app/(dashboard)/study-hub/practice/[subject]/[year]/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { educenterAPI } from '../../../../../../lib/api';
import toast from 'react-hot-toast';
import {
    ArrowRight,
    ArrowLeft,
    CheckCircle,
    XCircle,
    Clock,
    RotateCcw,
    Trophy,
} from 'lucide-react';

interface Question {
    id: string;
    question: string;
    options: Record<string, string>;
    image?: string;
}

interface Quiz {
    id: string;
    userId: string;
    examType: string;
    subject: string;
    totalQuestions: number;
    status: string;
}

interface QuizResult {
    quiz: any;
    results: Record<string, {
        userAnswer: string;
        correctAnswer: string;
        isCorrect: boolean;
    }>;
    score: number;
    total: number;
    percentage: number;
}

export default function PracticePage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    const subject = params['subject'] as string;
    const examType = (searchParams.get('examType') || 'JAMB').toUpperCase() as 'JAMB' | 'WAEC' | 'NECO' | 'GCE';

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
    const [result, setResult] = useState<QuizResult | null>(null);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(true);
    const [timeSpent, setTimeSpent] = useState(0);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!user) {
            toast.error('Please login to continue');
            router.push('/login');
            return;
        }

        startQuiz();

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [subject, examType, user]);

    const startQuiz = async () => {
        try {
            setLoading(true);
            const response = await educenterAPI.startQuiz({
                examType,
                subject,
                numberOfQuestions: 20,
            });

            const session = response.data;
            setQuiz({
                id: session.id,
                userId: '',
                examType: session.examType,
                subject: session.subject,
                totalQuestions: session.questions.length,
                status: session.status,
            });
            setQuestions(session.questions);

            // Start timer
            const interval = setInterval(() => {
                setTimeSpent((prev) => prev + 1);
            }, 1000);
            setTimer(interval);

            toast.success(`Loaded ${session.questions.length} questions`);
        } catch (error: any) {
            console.error('Error starting quiz:', error);
            toast.error(error.response?.data?.message || 'Failed to start quiz');
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (questionId: string, optionKey: string) => {
        if (showResults) return;
        setUserAnswers({ ...userAnswers, [questionId]: optionKey });
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleSubmit = async () => {
        if (Object.keys(userAnswers).length === 0) {
            toast.error('Please answer at least one question');
            return;
        }

        if (!quiz) {
            toast.error('Quiz not found');
            return;
        }

        if (timer) clearInterval(timer);

        try {
            const response = await educenterAPI.submitQuiz(quiz.id, userAnswers);
            const apiResult = response.data;
            const mappedResult: QuizResult = {
                quiz,
                results: Object.fromEntries(
                    (apiResult.review || []).map(r => [r.questionId, {
                        userAnswer: apiResult.answers[r.questionId] || '',
                        correctAnswer: r.correctAnswer,
                        isCorrect: r.correct,
                    }])
                ),
                score: apiResult.score,
                total: apiResult.total,
                percentage: apiResult.percentage,
            };
            setResult(mappedResult);
            setShowResults(true);

            toast.success(`You scored ${apiResult.percentage}%!`);
        } catch (error: any) {
            console.error('Error submitting quiz:', error);
            toast.error(error.response?.data?.message || 'Failed to submit quiz');
        }
    };

    const handleReset = () => {
        setUserAnswers({});
        setShowResults(false);
        setResult(null);
        setCurrentIndex(0);
        setTimeSpent(0);

        const interval = setInterval(() => {
            setTimeSpent((prev) => prev + 1);
        }, 1000);
        setTimer(interval);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading quiz...</p>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">No questions available</p>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                {subject} - {examType}
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Question {currentIndex + 1} of {questions.length}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                                <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                <span className="font-mono font-semibold text-gray-900 dark:text-white">
                                    {formatTime(timeSpent)}
                                </span>
                            </div>
                            {!showResults && (
                                <button
                                    onClick={handleSubmit}
                                    className="bg-gradient-to-r from-[#1E3A5F] to-[#2A4A6E] text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                                >
                                    Submit
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Question Navigator */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Question Navigator</h3>
                            <div className="grid grid-cols-5 gap-2">
                                {questions.map((q, index) => {
                                    const isAnswered = userAnswers[q.id] !== undefined;
                                    const isCurrent = index === currentIndex;
                                    const isCorrect = showResults && result?.results[q.id]?.isCorrect;
                                    const isWrong = showResults && userAnswers[q.id] && !result?.results[q.id]?.isCorrect;

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentIndex(index)}
                                            className={`
                        w-10 h-10 rounded-lg font-semibold transition-all
                        ${isCurrent ? 'ring-2 ring-blue-500' : ''}
                        ${showResults && isCorrect ? 'bg-green-500 text-white' : ''}
                        ${showResults && isWrong ? 'bg-red-500 text-white' : ''}
                        ${!showResults && isAnswered ? 'bg-blue-500 text-white' : ''}
                        ${!showResults && !isAnswered && !isCurrent ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300' : ''}
                        ${!showResults && !isAnswered && isCurrent ? 'bg-blue-100 dark:bg-blue-900/30 text-[#2A4A6E] dark:text-[#FFC800]' : ''}
                      `}
                                        >
                                            {index + 1}
                                        </button>
                                    );
                                })}
                            </div>

                            {showResults && result && (
                                <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <div className="flex items-center justify-center mb-3">
                                        <Trophy className="w-8 h-8 text-yellow-500" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-center">Results</h4>
                                    <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1 text-center">
                                        {result.percentage}%
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                                        {result.score} out of {result.total} correct
                                    </p>
                                    <button
                                        onClick={handleReset}
                                        className="w-full flex items-center justify-center space-x-2 bg-[#00143C] text-white py-2 rounded-lg hover:bg-[#1E3A5F] transition-colors"
                                    >
                                        <RotateCcw className="w-5 h-5" />
                                        <span>Try Again</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Question Area */}
                    <div className="lg:col-span-3">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                            {/* Question */}
                            <div className="mb-8">
                                <div className="flex items-start justify-between mb-4">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Question {currentIndex + 1}
                                    </h2>
                                    {showResults && result && (
                                        <div>
                                            {result.results[currentQuestion?.id || ""]?.isCorrect ? (
                                                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                                                    <CheckCircle className="w-6 h-6" />
                                                    <span className="font-semibold">Correct</span>
                                                </div>
                                            ) : userAnswers[currentQuestion?.id || ""] ? (
                                                <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                                                    <XCircle className="w-6 h-6" />
                                                    <span className="font-semibold">Incorrect</span>
                                                </div>
                                            ) : null}
                                        </div>
                                    )}
                                </div>
                                <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                                    {currentQuestion?.question}
                                </p>
                                {currentQuestion?.image && (
                                    <img
                                        src={currentQuestion?.image}
                                        alt="Question diagram"
                                        className="mt-4 max-w-full h-auto rounded-lg"
                                    />
                                )}
                            </div>

                            {/* Options */}
                            <div className="space-y-4 mb-8">
                                {Object.entries(currentQuestion?.options || {}).map(([key, value]) => {
                                    const isSelected = userAnswers[currentQuestion?.id || ""] === key;
                                    const isCorrect = showResults && result?.results[currentQuestion?.id || ""]?.correctAnswer === key;
                                    const showCorrect = showResults && isCorrect;
                                    const showWrong = showResults && isSelected && !isCorrect;

                                    return (
                                        <button
                                            key={key}
                                            onClick={() => handleAnswer(currentQuestion?.id || "", key)}
                                            disabled={showResults}
                                            className={`
                        w-full text-left p-4 rounded-xl border-2 transition-all
                        ${showCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''}
                        ${showWrong ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
                        ${!showResults && isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}
                        ${!showResults && !isSelected ? 'border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10' : ''}
                        ${showResults ? 'cursor-default' : 'cursor-pointer'}
                      `}
                                        >
                                            <div className="flex items-start space-x-3">
                                                <div
                                                    className={`
                            w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold
                            ${showCorrect ? 'bg-green-500 text-white' : ''}
                            ${showWrong ? 'bg-red-500 text-white' : ''}
                            ${!showResults && isSelected ? 'bg-blue-500 text-white' : ''}
                            ${!showResults && !isSelected ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300' : ''}
                          `}
                                                >
                                                    {key}
                                                </div>
                                                <span className="text-gray-800 dark:text-gray-200 flex-1">{value}</span>
                                                {showCorrect && <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />}
                                                {showWrong && <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentIndex === 0}
                                    className="flex items-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    <span>Previous</span>
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={currentIndex === questions.length - 1}
                                    className="flex items-center space-x-2 px-6 py-3 bg-[#00143C] text-white rounded-lg hover:bg-[#1E3A5F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span>Next</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

