import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { EducenterLayout } from "./educenterLayout";
import { ErrorBoundary, FacebookSDK, CookieConsent } from "@boldmindng/ui";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: false,
});

const getCanonicalUrl = () => {
  const baseUrl = process.env['NEXT_PUBLIC_APP_URL'] || "https://educenter.com.ng";
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
};
const canonicalUrl = getCanonicalUrl();

export const metadata: Metadata = {
  metadataBase: new URL(canonicalUrl),
  title: {
    default: "Boldmind EduCenter — JAMB, WAEC & NECO Exam Prep + Digital Business & AI Skills",
    template: "%s | Boldmind EduCenter",
  },
  description:
    "Nigeria's leading ed-tech platform. 10,000+ JAMB, WAEC, and NECO past questions with CBT simulator, post-UTME prep, digital business courses, and AI tools training for Nigerian students and professionals.",
  keywords: [
    "JAMB preparation Nigeria",
    "WAEC past questions",
    "NECO exam prep",
    "EduCenter Nigeria",
    "Nigerian education platform",
    "CBT simulator Nigeria",
    "UTME preparation",
    "post-UTME prep Nigeria",
    "Nigerian exam past questions",
    "JAMB CBT practice",
    "WAEC CBT practice",
    "NECO past questions",
    "digital skills Nigeria",
    "AI training Nigeria",
    "e-learning Nigeria",
    "online education Nigeria",
    "scholarship Nigeria",
    "digital business course Nigeria",
    "ed-tech Nigeria",
    "study app Nigeria",
  ],
  authors: [
    { name: "Boldmind EduCenter", url: canonicalUrl },
    { name: "Boldmind Technology Solution Enterprise", url: "https://boldmind.ng" },
  ],
  creator: "Boldmind Technology Solution Enterprise",
  publisher: "Boldmind Technology Solution Enterprise",
  formatDetection: { email: false, telephone: false },
  category: "education",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: { canonical: canonicalUrl, languages: { "en-NG": canonicalUrl } },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: canonicalUrl,
    title: "Boldmind EduCenter — Master JAMB, WAEC, NECO & Build Digital Skills",
    siteName: "Boldmind EduCenter",
    description:
      "10,000+ JAMB, WAEC, and NECO past questions with CBT simulation, plus digital business and AI skills training. Nigeria's most complete ed-tech platform.",
    images: [
      {
        url: `${canonicalUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Boldmind EduCenter — Nigerian Exam Prep & Digital Skills",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "",
    title: "Boldmind EduCenter — JAMB, WAEC, NECO Prep & Digital Skills Nigeria",
    description:
      "10,000+ past questions, CBT simulation, and digital skills training for Nigerian students.",
    images: [`${canonicalUrl}/og-image.png`],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  appleWebApp: { title: "EduCenter", statusBarStyle: "black-translucent" },
  other: {
    "application-name": "EduCenter",
    "apple-mobile-web-app-title": "EduCenter",
    "msapplication-TileColor": "#1E40AF",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1E40AF" },
    { media: "(prefers-color-scheme: dark)", color: "#1E3A8A" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

const educenterSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Boldmind EduCenter",
  url: canonicalUrl,
  logo: `${canonicalUrl}/logo.png`,
  description:
    "Nigeria's comprehensive ed-tech platform for JAMB, WAEC, and NECO exam prep plus digital and AI skills training.",
  foundingDate: "2025",
  address: { "@type": "PostalAddress", addressCountry: "NG", addressRegion: "Lagos" },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "hello@educenter.com.ng",
  },
  sameAs: ["https://boldmind.ng"],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Boldmind EduCenter",
  url: canonicalUrl,
  inLanguage: "en-NG",
  potentialAction: {
    "@type": "SearchAction",
    target: `${canonicalUrl}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const courseListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Boldmind EduCenter Course Catalogue",
  description: "JAMB, WAEC, NECO exam prep and digital skills courses",
  numberOfItems: 3,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Course",
        name: "JAMB UTME Preparation",
        description:
          "Comprehensive JAMB UTME prep with 10,000+ past questions and CBT simulator",
        provider: { "@type": "Organization", name: "Boldmind EduCenter", url: canonicalUrl },
        url: `${canonicalUrl}/jamb`,
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Course",
        name: "WAEC & NECO Exam Preparation",
        description: "Complete WAEC and NECO past questions with detailed explanations",
        provider: { "@type": "Organization", name: "Boldmind EduCenter", url: canonicalUrl },
        url: `${canonicalUrl}/waec`,
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Course",
        name: "Digital Business & AI Skills",
        description:
          "Modern digital business skills and AI tools training for Nigerian professionals",
        provider: { "@type": "Organization", name: "Boldmind EduCenter", url: canonicalUrl },
        url: `${canonicalUrl}/digital-skills`,
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" className={`scroll-smooth ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Blocking font script — prevents FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var f=localStorage.getItem('boldmind-font-mode')||'dyslexic';document.documentElement.setAttribute('data-font',f);document.documentElement.setAttribute('data-product','educenter');}catch(e){document.documentElement.setAttribute('data-font','dyslexic');document.documentElement.setAttribute('data-product','educenter');}})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.cdnfonts.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//api.boldmind.ng" />
        <link rel="dns-prefetch" href="//cdn.boldmind.ng" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        <meta name="application-name" content="Boldmind EduCenter" />
        <meta name="description" content="Pass exams. Build business. Master AI." />
        <meta name="theme-color" content="#1E40AF" />
        <meta name="msapplication-TileColor" content="#1E40AF" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/icons/favicon-96x96.png" />

        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="57x57"   href="/icons/apple/apple-touch-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60"   href="/icons/apple/apple-touch-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72"   href="/icons/apple/apple-touch-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76"   href="/icons/apple/apple-touch-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/icons/apple/apple-touch-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple/apple-touch-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/apple/apple-touch-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple/apple-touch-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/apple/apple-touch-icon-167x167.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple/apple-touch-icon-180x180.png" />

        <link rel="manifest" href="/site.webmanifest" />

        <meta property="og:type"        content="website" />
        <meta property="og:url"         content="https://educenter.com.ng" />
        <meta property="og:site_name"   content="Boldmind EduCenter" />
        <meta property="og:title"       content="Boldmind EduCenter" />
        <meta property="og:description" content="Pass exams. Build business. Master AI." />
        <meta property="og:image"       content="https://educenter.com.ng/social/og-image.jpg" />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt"   content="EduCenter NG — Pass exams. Build business. Master AI." />
        <meta property="og:locale"      content="en_NG" />

        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:site"        content="" />
        <meta name="twitter:creator"     content="@boldmindng" />
        <meta name="twitter:title"       content="Boldmind EduCenter" />
        <meta name="twitter:description" content="Pass exams. Build business. Master AI." />
        <meta name="twitter:image"       content="https://educenter.com.ng/social/twitter-card.jpg" />


        <meta name="msapplication-square70x70logo"   content="/icons/windows/mstile-70x70.png" />
        <meta name="msapplication-square150x150logo" content="/icons/windows/mstile-150x150.png" />
        <meta name="msapplication-wide310x150logo"   content="/icons/windows/mstile-310x150.png" />
        <meta name="msapplication-square310x310logo" content="/icons/windows/mstile-310x310.png" />
        <meta name="mobile-web-app-capable" content="yes" />
         <meta name="facebook-domain-verification" content="s5hbjxwm6eqlaopdgfit3mk3okv4jy" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="geo.region" content="NG-LA" />
        <meta name="geo.placename" content="Lagos, Nigeria" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(educenterSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseListSchema) }}
        />
      </head>
      <body className="antialiased">
        <ErrorBoundary>
          <EducenterLayout>{children}</EducenterLayout>
          <CookieConsent />
          <FacebookSDK
            appId={process.env['NEXT_PUBLIC_FACEBOOK_APP_ID']}
            pixelId={process.env['NEXT_PUBLIC_FACEBOOK_PIXEL_ID']}
          />
        </ErrorBoundary>
      </body>
    </html>
  );
}
