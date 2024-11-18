import { cookies } from "next/headers";

export async function GET(request:Request) {
    const cookieStore = cookies();
    const maxAge = 15 * 60;
    cookieStore.set('isGuest', 'true', {
        maxAge,
        path: '/',
        httpOnly: true,
    })

    return new Response(JSON.stringify({
        success: true,
        message: 'Guest signed in'
    }),{
        status: 203
    });
}