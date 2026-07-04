// app/providers.tsx
// Root client providers: auth, analytics init, UTM capture, toast.
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";

// ── BoldmindNG shared packages ────────────────────────────────────────────────
import { AuthProvider } from "@boldmindng/auth";
import {
  initAnalytics,
  createUsePageTracking,
  createUseUtm,
  captureUtm,
} from "@boldmindng/analytics";

// ── Local ─────────────────────────────────────────────────────────────────────
import { POSTHOG_KEY, POSTHOG_HOST, SITE } from "@/lib/config";

// ─── Analytics init (runs once) ───────────────────────────────────────────────
// initAnalytics is idempotent — safe to call at module level
initAnalytics({
  posthogKey: POSTHOG_KEY,
  posthogHost: POSTHOG_HOST,
  productSlug: SITE.slug,
  productName: SITE.name,
  enabled: Boolean(POSTHOG_KEY),
  debug: process.env.NODE_ENV === "development",
});

// ─── Hook factories (framework-agnostic, from analytics package) ──────────────
const usePageTracking = createUsePageTracking(useEffect);
const useUtm = createUseUtm(useEffect, useState);

// ─── Inner component (needs hooks, must be a client component) ────────────────
function AnalyticsBootstrap({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Fire page_view on every route change
  usePageTracking(pathname);

  // Capture UTM params and persist to sessionStorage
  useUtm();

  return <>{children}</>;
}

// ─── Root Providers ───────────────────────────────────────────────────────────
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider productSlug={SITE.slug}>
      <AnalyticsBootstrap>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "var(--font-body, OpenDyslexic, sans-serif)",
              borderRadius: "0.75rem",
            },
          }}
        />
      </AnalyticsBootstrap>
    </AuthProvider>
  );
}
