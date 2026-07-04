'use client';

import React, { useEffect, useReducer } from 'react';
import type { ReactNode } from 'react';
import { boldMindAPI } from '@boldmindng/api-client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  isVerified: boolean;
  avatar?: string;
  lastLoginAt?: string;
  createdAt: string;
  profile?: {
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
    state?: string;
    prefersPidgin: boolean;
    dyslexiaMode: boolean;
    activeProducts: string[];
    onboardingDone: boolean;
    referralCode: string;
    examTarget?: string;
  };
  subscriptions?: Array<{
    productSlug: string;
    tier: string;
    currentPeriodEnd: string;
  }>;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  expiresAt: number;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

// ─── Module-level store (zustand-like without the dependency) ─────────────────

interface StoreState {
  status: AuthStatus;
  user: AuthUser | null;
  session: AuthSession | null;
}

let _state: StoreState = { status: 'loading', user: null, session: null };
const _listeners = new Set<() => void>();

function _setState(patch: Partial<StoreState>) {
  _state = { ..._state, ...patch };
  _listeners.forEach(fn => fn());
}

const _actions = {
  setSession: (session: AuthSession) =>
    _setState({ session, user: session.user, status: 'authenticated' }),
  setUser: (user: AuthUser) => _setState({ user }),
  setStatus: (status: AuthStatus) => _setState({ status }),
  clearSession: () =>
    _setState({ status: 'unauthenticated', user: null, session: null }),
};

export function useAuthStore() {
  const [, tick] = useReducer(x => x + 1, 0);
  useEffect(() => {
    _listeners.add(tick);
    return () => { _listeners.delete(tick); };
  }, []);
  return { ..._state, ..._actions };
}

// Static accessor so callers can do useAuthStore.getState().clearSession()
useAuthStore.getState = () => ({ ..._state, ..._actions });

// ─── Auth API ─────────────────────────────────────────────────────────────────

const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL || 'https://boldmind.ng';
const REFRESH_TOKEN_KEY = 'bm_rt';

export const authApi = {
  async getMe(_accessToken?: string): Promise<AuthUser> {
    return (await boldMindAPI.auth.me()) as unknown as AuthUser;
  },

  async logout(_refreshToken?: string): Promise<void> {
    clearRefreshToken();
  },

  googleLoginUrl(): string {
    return `${HUB_URL}/login?provider=google`;
  },
};

// ─── Utilities ────────────────────────────────────────────────────────────────

export function clearRefreshToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem('auth_tokens');
  }
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function saveRefreshToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
}

// ─── useAuth hook ─────────────────────────────────────────────────────────────

export function useAuth() {
  const store = useAuthStore();
  return {
    ...store,
    isAuthenticated: store.status === 'authenticated',
    isLoading: store.status === 'loading',
    register: async (_input: unknown) => {},
    login: async (_input: unknown) => {},
    logout: async () => {
      clearRefreshToken();
      store.clearSession();
    },
    logoutAll: async () => {
      clearRefreshToken();
      store.clearSession();
    },
    loginWithGoogle: () => {
      window.location.href = authApi.googleLoginUrl();
    },
  };
}

// ─── AuthProvider ─────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    boldMindAPI.auth.me()
      .then((user: unknown) => {
        if (user) {
          _actions.setSession({
            user: user as AuthUser,
            accessToken: '',
            expiresAt: Date.now() + 3_600_000,
          });
        } else {
          _actions.setStatus('unauthenticated');
        }
      })
      .catch(() => _actions.setStatus('unauthenticated'));
  }, []);

  return <>{children}</>;
}
