'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL || 'https://boldmind.ng';

function ResetPasswordContent() {
  const params = useSearchParams();
  const returnUrl =
    params.get('callbackUrl') ||
    params.get('return_url') ||
    params.get('redirect') ||
    (typeof window !== 'undefined' ? window.location.origin + '/login' : '');

  useEffect(() => {
    const url = new URL(`${HUB_URL}/reset-password`);
    if (returnUrl) url.searchParams.set('return_url', returnUrl as string);
    window.location.replace(url.toString());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
