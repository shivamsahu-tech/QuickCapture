// middleware.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function middleware(request: Request) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken');

    console.log("Reacde in middleware!!")

  if (!accessToken) {
    return NextResponse.redirect(new URL('/sign-up', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [],
};
