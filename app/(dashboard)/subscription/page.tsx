'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { educenterAPI } from '../../../lib/api';
import { SUBSCRIPTION_PLANS } from '../../../lib/config';
import toast from 'react-hot-toast';
import { CheckCircle, Zap, Crown, Sparkles, Loader2 } from 'lucide-react';


interface SubscriptionData {
  active: boolean;
  plan?: string;
  expiresAt?: string;
}

export default function SubscriptionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState<SubscriptionData | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);

  useEffect(() => {
    if (!user) {
      toast.error('Please login first');
      router.push('/login');
      return;
    }

    // Load Paystack inline script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    // Load user subscription
    loadSubscription();

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [user, router]);

  const loadSubscription = async () => {
    try {
      const response = await educenterAPI.getMySubscription();
      const subs = response.data as any[];
      const active = subs?.find((s: any) => s.status === 'active');
      setActiveSubscription(active ? { active: true, plan: active.plan, expiresAt: active.expiresAt } : null);
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoadingSubscription(false);
    }
  };



  const handleSubscribe = async (pillar: string, plan: string, amount: number) => {
    if (!user) {
      toast.error('Please login first');
      router.push('/login');
      return;
    }

    setLoading(true);

    try {
      // Initialize payment
      const paymentData = await educenterAPI.initializePayment({
        productSlug: pillar,
        plan,
        email: user.email,
        callbackUrl: `${window.location.origin}/subscription`,
        amount,
        metadata: { pillar },
      });

      // Open Paystack popup
      if (!window.PaystackPop) {
        toast.error('Payment system not loaded. Please try again.');
        setLoading(false);
        return;
      }

      const verifyAndActivate = async (reference: string) => {
        try {
          await educenterAPI.verifyPayment(reference);
          toast.success('Subscription activated successfully!');
          await loadSubscription();
          router.push('/dashboard');
        } catch (error) {
          toast.error('Payment verification failed');
        }
      };

      const handler = window.PaystackPop.setup({
        key: process.env['NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY']!,
        email: user.email!,
        amount,
        ref: (paymentData as any).data?.reference ?? (paymentData as any).reference,
        metadata: {
          userId: user.id,
          plan,
          pillar,
        },
        onSuccess: (response: { reference: string }) => {
          verifyAndActivate(response.reference);
        },
        callback: (response: { reference: string }) => {
          verifyAndActivate(response.reference);
        },
        onClose: () => {
          toast.error('Payment cancelled');
          setLoading(false);
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to initialize payment');
      setLoading(false);
    }
  };

  const plans = [
    {
      pillar: 'studyHub',
      name: 'Study Hub',
      icon: Crown,
      color: 'from-blue-500 to-cyan-500',
      options: [
        {
          duration: '6 Months',
          price: '₦700',
          amount: SUBSCRIPTION_PLANS.studyHub.sixMonths.price,
          plan: 'sixMonths',
          features: SUBSCRIPTION_PLANS.studyHub.sixMonths.features,
        },
        {
          duration: '1 Year',
          price: '₦1,000',
          amount: SUBSCRIPTION_PLANS.studyHub.oneYear.price,
          plan: 'oneYear',
          features: SUBSCRIPTION_PLANS.studyHub.oneYear.features,
          popular: true,
        },
      ],
    },
    {
      pillar: 'businessSchool',
      name: 'Digital Business School',
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      options: [
        {
          duration: 'Lifetime',
          price: '₦1,000',
          amount: SUBSCRIPTION_PLANS.businessSchool.lifetime.price,
          plan: 'lifetime',
          features: SUBSCRIPTION_PLANS.businessSchool.lifetime.features,
        },
      ],
    },
    {
      pillar: 'aiLab',
      name: 'AI Skills Lab',
      icon: Sparkles,
      color: 'from-orange-500 to-red-500',
      options: [
        {
          duration: 'Lifetime',
          price: '₦1,000',
          amount: SUBSCRIPTION_PLANS.aiLab.lifetime.price,
          plan: 'lifetime',
          features: SUBSCRIPTION_PLANS.aiLab.lifetime.features,
        },
      ],
    },
  ];

  if (loadingSubscription) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2A4A6E] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Choose Your Learning Path</h1>
          <p className="text-xl text-blue-100">
            Unlock unlimited access to Africa's best learning resources
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Pricing Cards */}
        <div className="space-y-12">
          {plans.map((pillar, pillarIndex) => (
            <div key={pillarIndex}>
              <div className="flex items-center space-x-3 mb-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pillar.color} flex items-center justify-center`}>
                  <pillar.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{pillar.name}</h2>
                  {activeSubscription?.active && (
                    <span className="inline-block mt-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-semibold rounded-full">
                      Active
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pillar.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 ${option.popular
                      ? 'border-purple-500 ring-4 ring-purple-500/20 scale-105'
                      : 'border-gray-200 dark:border-gray-700'
                      } overflow-hidden relative`}
                  >
                    {option.popular && (
                      <div className="absolute top-0 right-0">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                          Most Popular
                        </div>
                      </div>
                    )}

                    <div className="p-8">
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {option.duration}
                        </h3>
                        <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                          {option.price}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">{option.duration.toLowerCase()}</p>
                      </div>

                      <ul className="space-y-4 mb-8">
                        {option.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {activeSubscription?.active ? (
                        <button
                          disabled
                          className="w-full py-4 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        >
                          Already Subscribed
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSubscribe(pillar.pillar, option.plan, option.amount)}
                          disabled={loading}
                          className={`w-full py-4 rounded-lg font-semibold transition-all ${option.popular
                            ? `bg-gradient-to-r ${pillar.color} text-white hover:shadow-lg`
                            : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                            } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <span>Subscribe Now</span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Need Help Choosing?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            All subscriptions include access to our community, regular updates, and customer support.
            You can upgrade or cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}

