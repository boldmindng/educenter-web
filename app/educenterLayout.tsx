// app/educenterLayout.tsx
// Shared public-facing layout shell: top nav + ecosystem footer.
// Used by the landing page (app/page.tsx), pricing, privacy, terms.

import Link from "next/link";
import Image from "next/image";
import { SITE, ECOSYSTEM } from "@/lib/config";

interface EduCenterLayoutProps {
  children: React.ReactNode;
}

export default function EduCenterLayout({ children }: EduCenterLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      {/* ── Top Nav ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-surface-border bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 focus-visible:rounded"
          >
            <Image
              src="/logo.png"
              alt="Boldmind EduCenter"
              width={32}
              height={32}
              className="rounded-lg"
              priority
            />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-edu-800">EduCenter</span>
              <span className="text-[10px] text-surface-muted">
                by BoldmindNG
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <nav
            className="hidden items-center gap-6 md:flex"
            aria-label="Main navigation"
          >
            <NavLink href="/pricing">Pricing</NavLink>
            <NavLink href="/#features">Features</NavLink>
            <NavLink href={ECOSYSTEM.amebogist} external>
              AmeboGist
            </NavLink>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-edu-800 hover:underline sm:block"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-edu-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-edu-700 focus-visible:ring-2 focus-visible:ring-edu-800 focus-visible:ring-offset-2"
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* ── Page content ────────────────────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-surface-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand column */}
            <div>
              <p className="text-sm font-bold text-edu-800">{SITE.name}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-surface-muted">
                Nigeria&apos;s premier exam prep platform. Ace JAMB, WAEC &amp;
                NECO.
              </p>
            </div>

            {/* Product */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-edu-800">
                Product
              </p>
              <ul className="mt-3 space-y-2 text-sm text-surface-muted">
                <li>
                  <Link href="/pricing" className="hover:text-edu-800">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/#features" className="hover:text-edu-800">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-edu-800">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Ecosystem */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-edu-800">
                Ecosystem
              </p>
              <ul className="mt-3 space-y-2 text-sm text-surface-muted">
                <li>
                  <a
                    href={ECOSYSTEM.boldmind}
                    className="hover:text-edu-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    BoldmindNG
                  </a>
                </li>
                <li>
                  <a
                    href={ECOSYSTEM.amebogist}
                    className="hover:text-edu-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    AmeboGist
                  </a>
                </li>
                <li>
                  <a
                    href={ECOSYSTEM.planai}
                    className="hover:text-edu-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    PlanAI
                  </a>
                </li>
                <li>
                  <a
                    href={ECOSYSTEM.villagecircle}
                    className="hover:text-edu-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    VillageCircle
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-edu-800">
                Legal
              </p>
              <ul className="mt-3 space-y-2 text-sm text-surface-muted">
                <li>
                  <Link href="/privacy" className="hover:text-edu-800">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-edu-800">
                    Terms of Use
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <p className="mt-10 text-center text-xs text-surface-muted">
            © {new Date().getFullYear()} {SITE.name}. Part of the{" "}
            <a
              href={ECOSYSTEM.boldmind}
              className="text-edu-700 hover:underline"
            >
              BoldmindNG
            </a>{" "}
            ecosystem.
          </p>
        </div>
      </footer>
    </div>
  );
}

function NavLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  if (external) {
    return (
      <a
        href={href}
        className="text-sm text-surface-muted transition-colors hover:text-edu-800"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      href={href}
      className="text-sm text-surface-muted transition-colors hover:text-edu-800"
    >
      {children}
    </Link>
  );
}
