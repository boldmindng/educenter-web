'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL || 'https://boldmind.ng';

function ChangePasswordContent() {
  const params = useSearchParams();
  const token = params.get('token') || '';
  const email = params.get('email') || '';
  const returnUrl =
    params.get('callbackUrl') ||
    params.get('return_url') ||
    params.get('redirect') ||
    (typeof window !== 'undefined' ? window.location.origin + '/login' : '');

  useEffect(() => {
    const url = new URL(`${HUB_URL}/change-password`);
    if (token) url.searchParams.set('token', token);
    if (email) url.searchParams.set('email', email);
    if (returnUrl) url.searchParams.set('return_url', returnUrl as string);
    window.location.replace(url.toString());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={null}>
      <ChangePasswordContent />
    </Suspense>
  );
}
