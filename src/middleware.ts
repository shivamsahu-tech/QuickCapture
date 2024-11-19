import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function middleware(request: Request) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken');
  const isGuest = cookieStore.get('isGuest')?.value;

  const response = NextResponse.next();

  
  if (!accessToken && (!isGuest || isGuest === 'false')) {
    return NextResponse.redirect(new URL('/sign-up', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/'],
};
