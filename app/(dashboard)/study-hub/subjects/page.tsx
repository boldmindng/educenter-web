//APPS/WEB_APPS/educenter/app/(dashboard)/study-hub/subjects/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { educenterAPI } from '../../../../lib/api';
import toast from 'react-hot-toast';
import {
  BookOpen,
  Search,
  ArrowRight,
  FlaskConical,
  Calculator,
  // Globe,
  Landmark,
  DollarSign,
  Microscope,
  Book,
  Cross,
  MapPin,
} from 'lucide-react';

const subjectIcons: Record<string, any> = {
  mathematics: Calculator,
  english: Book,
  physics: FlaskConical,
  chemistry: Microscope,
  biology: Microscope,
  geography: MapPin,
  government: Landmark,
  economics: DollarSign,
  commerce: DollarSign,
  crk: Cross,
  default: BookOpen,
};

export default function SubjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examType = (searchParams.get('examType') || 'jamb').toLowerCase();

  const [subjects, setSubjects] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('subject') || '');
  const [loading, setLoading] = useState(true);

  // Sync searchQuery with URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set('subject', searchQuery);
    } else {
      params.delete('subject');
    }
    router.replace(`/study-hub/subjects?${params.toString()}`, { scroll: false });
  }, [searchQuery]);

  useEffect(() => {
    loadSubjects();
  }, [examType]);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      console.log('🔍 [StudyHub] Fetching subjects for:', examType);
      const response = await educenterAPI.getSubjects(examType);
      console.log('📡 [StudyHub] Raw response from API:', response);

      // Deep unwrap helper to find the first array in the structure
      const deepUnwrapArray = (obj: any, depth = 0): string[] | null => {
        if (depth > 5) return null; // Prevent infinite recursion
        if (Array.isArray(obj)) return obj;
        if (obj && typeof obj === 'object') {
          // Check common keys
          if (Array.isArray(obj.data)) return obj.data;
          if (Array.isArray(obj.subjects)) return obj.subjects;

          // Recursively check all object properties
          for (const key in obj) {
            const result = deepUnwrapArray(obj[key], depth + 1);
            if (result) return result;
          }
        }
        return null;
      };

      let subjectsData = deepUnwrapArray(response) || [];
      console.log('✅ [StudyHub] Extracted subjects:', subjectsData.length);

      setSubjects(subjectsData);

      if (subjectsData.length === 0) {
        console.warn('⚠️ [StudyHub] No subjects found for:', examType);
      }
    } catch (error) {
      console.error('❌ [StudyHub] Error loading subjects:', error);
      toast.error('Failed to load subjects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSubjects = subjects.filter((subject) =>
    subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubjectClick = (subject: string) => {
    router.push(`/study-hub/subjects/${subject}?examType=${examType}&subject=${subject}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading subjects...</p>
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
            href="/study-hub"
            className="inline-flex items-center text-blue-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
            Back to Study Hub
          </Link>
          <h1 className="text-4xl font-bold mb-2">Select Subject</h1>
          <p className="text-blue-100">Choose a subject to start practicing - {examType.toUpperCase()}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects..."
              className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg"
            />
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => {
            const Icon = subjectIcons[subject.toLowerCase()] || subjectIcons['default'];

            return (
              <button
                key={subject}
                onClick={() => handleSubjectClick(subject)}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {subject}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Practice past questions
                </p>
              </button>
            );
          })}
        </div>

        {/* No Results */}
        {filteredSubjects.length === 0 && !loading && (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm animate-fade-in">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              No subjects found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-8 max-w-xs mx-auto">
              We couldn't load the subjects for {examType.toUpperCase()}. Please check your connection and try again.
            </p>
            <button
              onClick={loadSubjects}
              className="inline-flex items-center gap-2 bg-[#00143C] text-white px-8 py-4 rounded-2xl font-black hover:scale-105 transition-all shadow-lg shadow-blue-500/20"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

