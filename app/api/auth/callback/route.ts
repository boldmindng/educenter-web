import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const next = searchParams.get('next');
    const destination = next?.startsWith('/') ? next : '/dashboard';

    return NextResponse.redirect(`${origin}${destination}`);
}
