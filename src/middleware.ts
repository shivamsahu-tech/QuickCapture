// middleware.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function middleware(request: Request) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken');
  const isGuest = cookieStore.get('isGuest');

  if (!accessToken && !isGuest) {
    return NextResponse.redirect(new URL('/sign-up', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
