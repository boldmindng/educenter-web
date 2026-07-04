import type { Metadata } from 'next';
import Link from 'next/link';
import { SuperNavbar, SuperFooter } from '@boldmindng/ui';
import {
  CheckCircle,
  Zap,
  BookOpen,
  TrendingUp,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Twitter,
  Facebook,
  Instagram,
  Star,
  Shield,
} from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Pricing — EduCenter',
  description:
    'Simple, honest pricing for JAMB/WAEC/NECO exam prep, digital business school, and AI skills. Free tier available — start today.',
  openGraph: {
    title: 'EduCenter Pricing — Exam Prep & Digital Skills',
    description: 'Start free. Upgrade for as little as ₦700.',
    url: 'https://educenter.com.ng/pricing',
  },
};

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/pricing', label: 'Pricing' },
  { href: 'https://amebogist.ng', label: 'Blog', isExternal: true },
  { href: 'https://villagecircle.ng', label: 'Community', isExternal: true },
  { href: '/login', label: 'Login' },
];

const footerSections = [
  {
    title: '📚 EXAM PREP',
    links: [
      { href: '/register', label: 'Get Started' },
      { href: '/login', label: 'Login to Practice' },
      { href: '/pricing', label: 'View Plans' },
    ],
  },
  {
    title: '💼 PLATFORM',
    links: [
      { href: '/register', label: 'Create Account' },
      { href: '/login', label: 'Sign In' },
      { href: '/pricing', label: 'Pricing' },
    ],
  },
  {
    title: '🌍 ECOSYSTEM',
    links: [
      { href: 'https://amebogist.ng', label: 'Blog (AmeboGist)', isExternal: true },
      { href: 'https://villagecircle.ng', label: 'Community (VillageCircle)', isExternal: true },
      { href: 'https://boldmind.ng', label: 'BoldMind Ecosystem', isExternal: true },
    ],
  },
  {
    title: '📋 LEGAL',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
    ],
  },
];

interface Plan {
  name: string;
  icon: React.ElementType;
  price: string;
  period: string;
  altPrice?: string;
  altPeriod?: string;
  description: string;
  badge?: string | null;
  highlighted: boolean;
  features: string[];
  cta: { label: string; href: string };
}

const plans: Plan[] = [
  {
    name: 'Free',
    icon: Zap,
    price: '₦0',
    period: 'forever',
    description: 'Start practising today — no card needed',
    badge: null,
    highlighted: false,
    features: [
      '500 free practice questions',
      'JAMB, WAEC & NECO subjects',
      'CBT practice mode',
      'Basic performance stats',
      '5 free practice attempts daily',
    ],
    cta: { label: 'Start Free', href: '/register' },
  },
  {
    name: 'Study Hub',
    icon: BookOpen,
    price: '₦700',
    period: '6 months',
    altPrice: '₦1,000',
    altPeriod: '1 year',
    description: 'Full access to all past questions & analytics',
    badge: 'Most Popular',
    highlighted: true,
    features: SUBSCRIPTION_PLANS.studyHub.oneYear.features,
    cta: { label: 'Get Study Hub', href: '/subscription' },
  },
  {
    name: 'Business School',
    icon: TrendingUp,
    price: '₦1,000',
    period: 'lifetime',
    description: 'Digital business mastery for Nigerian entrepreneurs',
    badge: 'One-time fee',
    highlighted: false,
    features: SUBSCRIPTION_PLANS.businessSchool.lifetime.features,
    cta: { label: 'Enrol Now', href: '/subscription' },
  },
  {
    name: 'AI Skills Lab',
    icon: Sparkles,
    price: '₦1,000',
    period: 'lifetime',
    description: 'Master AI tools and automation',
    badge: 'One-time fee',
    highlighted: false,
    features: SUBSCRIPTION_PLANS.aiLab.lifetime.features,
    cta: { label: 'Join AI Lab', href: '/subscription' },
  },
];

const faqs = [
  {
    q: 'Can I start for free?',
    a: 'Yes. The Free plan gives you 500 practice questions and full CBT mode access with no credit card required.',
  },
  {
    q: 'What exams are covered?',
    a: 'JAMB, WAEC, NECO, and GCE past questions across all major subjects.',
  },
  {
    q: 'Is the Business School lifetime access really one payment?',
    a: 'Yes — pay ₦1,000 once and access all free Business School content forever. Premium courses are priced separately.',
  },
  {
    q: 'How do I pay?',
    a: 'We use Paystack — you can pay with card, bank transfer, or USSD. Completely secure.',
  },
  {
    q: 'Can I get a refund?',
    a: 'Yes. We offer a 7-day money-back guarantee on all paid plans — no questions asked.',
  },
  {
    q: 'Can I combine plans?',
    a: 'Absolutely. You can subscribe to Study Hub, Business School, and AI Lab independently or all together.',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <SuperNavbar
        links={navLinks}
        cta={{ href: '/register', label: 'Sign Up', variant: 'secondary' }}
        logoSrc="/logo.png"
        showThemeControls={true}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#00143C] via-[#1E3A5F] to-[#0F2744] text-white pt-28 pb-20 text-center px-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-semibold mb-6">
          <Shield className="w-4 h-4 text-[#FFC800]" />
          7-day money-back guarantee on all plans
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-5 leading-tight">
          Simple, Honest Pricing
        </h1>
        <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-8">
          From free exam practice to full business &amp; AI mastery — pick the plan that fits where you are.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          {['No credit card required', '7-day refund guarantee', 'Paystack-secured payments'].map((t) => (
            <div key={t} className="flex items-center gap-2 text-blue-200">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl flex flex-col transition-all hover:-translate-y-1 hover:shadow-2xl ${
                    plan.highlighted
                      ? 'bg-[#00143C] text-white ring-4 ring-[#FFC800] shadow-xl'
                      : 'bg-white text-gray-900 border border-gray-200 shadow-md'
                  }`}
                >
                  {plan.badge && (
                    <div
                      className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black tracking-wide whitespace-nowrap ${
                        plan.highlighted
                          ? 'bg-[#FFC800] text-[#00143C]'
                          : 'bg-[#00143C] text-white'
                      }`}
                    >
                      {plan.badge}
                    </div>
                  )}

                  <div className="p-7 flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          plan.highlighted ? 'bg-[#FFC800]/20' : 'bg-[#00143C]/10'
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${plan.highlighted ? 'text-[#FFC800]' : 'text-[#00143C]'}`}
                        />
                      </div>
                      <h3 className="text-lg font-black">{plan.name}</h3>
                    </div>

                    {/* Price */}
                    <div className="mb-2">
                      <span className="text-4xl font-black">{plan.price}</span>
                      <span className={`text-sm ml-1.5 ${plan.highlighted ? 'text-blue-200' : 'text-gray-500'}`}>
                        / {plan.period}
                      </span>
                    </div>
                    {plan.altPrice && (
                      <p className={`text-sm mb-4 ${plan.highlighted ? 'text-[#FFC800] font-semibold' : 'text-[#00143C] font-semibold'}`}>
                        or {plan.altPrice} / {plan.altPeriod}
                      </p>
                    )}

                    <p className={`text-sm mb-6 leading-relaxed ${plan.highlighted ? 'text-blue-200' : 'text-gray-500'}`}>
                      {plan.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2.5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm">
                          <CheckCircle
                            className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                              plan.highlighted ? 'text-[#FFC800]' : 'text-[#00143C]'
                            }`}
                          />
                          <span className={plan.highlighted ? 'text-blue-100' : 'text-gray-700'}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="px-7 pb-7">
                    <Link
                      href={plan.cta.href}
                      className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all ${
                        plan.highlighted
                          ? 'bg-[#FFC800] text-[#00143C] hover:bg-yellow-400 hover:shadow-lg'
                          : 'bg-[#00143C] text-white hover:bg-[#1E3A5F] hover:shadow-lg'
                      }`}
                    >
                      {plan.cta.label}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bundle nudge */}
          <div className="mt-10 bg-gradient-to-r from-[#00143C] to-[#1E3A5F] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFC800]/20 flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-[#FFC800]" />
              </div>
              <div>
                <h3 className="font-black text-lg">Get all three paid plans for just ₦2,700</h3>
                <p className="text-blue-200 text-sm mt-0.5">
                  Study Hub (1yr) + Business School + AI Lab — everything you need to win in 2025.
                </p>
              </div>
            </div>
            <Link
              href="/subscription"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-[#FFC800] text-[#00143C] font-black rounded-xl hover:bg-yellow-400 transition-colors"
            >
              Subscribe Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-[#00143C] text-center mb-12">
            What&apos;s included in each plan?
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#00143C] text-white">
                  <th className="text-left px-6 py-4 font-bold">Feature</th>
                  <th className="px-4 py-4 font-bold text-center">Free</th>
                  <th className="px-4 py-4 font-bold text-center text-[#FFC800]">Study Hub</th>
                  <th className="px-4 py-4 font-bold text-center">Business</th>
                  <th className="px-4 py-4 font-bold text-center">AI Lab</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Practice questions', '500', 'Unlimited', '—', '—'],
                  ['CBT simulator', '✓', '✓', '—', '—'],
                  ['Performance analytics', 'Basic', 'Full', '—', '—'],
                  ['Study plans & reminders', '—', '✓', '—', '—'],
                  ['Offline access', '—', '✓', '—', '—'],
                  ['Priority support', '—', '✓', '—', '—'],
                  ['Business courses (free)', '—', '—', '✓', '—'],
                  ['Sales funnel templates', '—', '—', '✓', '—'],
                  ['Marketing playbooks', '—', '—', '✓', '—'],
                  ['Community access', '—', '—', '✓', '—'],
                  ['AI tools access', '—', '—', '—', '✓'],
                  ['Prompt engineering course', '—', '—', '—', '✓'],
                  ['AI automation templates', '—', '—', '—', '✓'],
                  ['Weekly AI updates', '—', '—', '—', '✓'],
                ].map(([feature, free, study, biz, ai], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-3 text-gray-700 font-medium">{feature}</td>
                    {[free, study, biz, ai].map((val, j) => (
                      <td key={j} className="px-4 py-3 text-center">
                        {val === '✓' ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : val === '—' ? (
                          <span className="text-gray-300">—</span>
                        ) : (
                          <span className={`font-semibold ${j === 1 ? 'text-[#00143C]' : 'text-gray-700'}`}>{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-[#00143C] text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <div key={q} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-[#00143C] mb-2">{q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#0F1E35] py-20 px-6 text-center text-white">
        <h2 className="text-3xl md:text-5xl font-black mb-4">
          Ready to start?
        </h2>
        <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
          Create a free account in 30 seconds. No card. No risk. Just results.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FFC800] text-[#00143C] font-black text-lg rounded-xl hover:bg-yellow-400 transition-all shadow-lg"
          >
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="https://wa.me/2349138349271"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border-2 border-white/30 text-white font-bold text-lg rounded-xl hover:bg-white/20 transition-all"
          >
            <MessageSquare className="w-5 h-5" />
            Chat on WhatsApp
          </a>
        </div>
      </section>

      <SuperFooter
        logoSrc="/logo.png"
        sections={footerSections}
        variant="compact"
        contactInfo={{
          email: 'support@educenter.com.ng',
          phone: '+2349138349271',
          whatsapp: '+2349138349271',
          address: 'Lagos, Nigeria',
        }}
        socialLinks={[
          { platform: 'Twitter', url: 'https://twitter.com/educenter_ng', icon: <Twitter className="w-5 h-5" /> },
          { platform: 'Facebook', url: 'https://facebook.com/educenterng', icon: <Facebook className="w-5 h-5" /> },
          { platform: 'Instagram', url: 'https://instagram.com/educenter_ng', icon: <Instagram className="w-5 h-5" /> },
        ]}
        newsletter={true}
        copyright={`© ${new Date().getFullYear()} EduCenter.com.ng - A BoldMind Ecosystem Product`}
      />

      <a
        href="https://wa.me/2349138349271"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50"
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </a>
    </div>
  );
}
