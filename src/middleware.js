import { NextResponse } from 'next/server';
import { verifyAuthToken, signAccessToken } from '@/lib/jwt';

const PUBLIC_AUTH_PAGES = new Set([
    '/login',
    '/register',
    '/logout',
    '/api/auth/login',
    '/api/auth/logout',
    '/api/auth/register',
    '/api/auth/refresh'
]);

export async function middleware(request) {
    const url = request.nextUrl;
    const pathname = url.pathname.replace(/\/+$/, '') || '/';
    const token = request.cookies.get('access_token')?.value;
    const refreshToken = request.cookies.get('refresh_token')?.value;

    if (
        pathname.startsWith('/api/') ||
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/favicon.ico') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    let isValidAccessToken = false;
    if (token) {
        const payload = await verifyAuthToken(token);
        if (payload) isValidAccessToken = true;
    }

    let newAccessTokenGenerated = null;

    if (!isValidAccessToken && refreshToken) {
        const refreshPayload = await verifyAuthToken(refreshToken);
        if (refreshPayload) {
            const userInfoStr = request.cookies.get('user_info')?.value;
            let company_id = null;
            if (userInfoStr) {
                try {
                    const userInfo = JSON.parse(userInfoStr);
                    company_id = userInfo.company_id;
                } catch (e) {
                    console.error('Failed to parse user_info cookie:', e);
                }
            }

            newAccessTokenGenerated = await signAccessToken({
                user_id: refreshPayload.user_id,
                company_id: company_id
            });
            isValidAccessToken = true;
        }
    }

    let response;

    if (isValidAccessToken && PUBLIC_AUTH_PAGES.has(pathname)) {
        const redirectUrl = url.clone();
        redirectUrl.pathname = '/feature/dashboard';
        redirectUrl.searchParams.delete('redirect');
        response = NextResponse.redirect(redirectUrl);
    } else if (!isValidAccessToken && !PUBLIC_AUTH_PAGES.has(pathname)) {
        const loginUrl = url.clone();
        loginUrl.pathname = '/login';
        loginUrl.searchParams.set('redirect', pathname);
        response = NextResponse.redirect(loginUrl);
    } else {
        response = NextResponse.next();
    }

    if (newAccessTokenGenerated) {
        response.cookies.set('access_token', newAccessTokenGenerated, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: process.env.JWT_ACCESS_EXPIRES
        });
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public (public assets)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)'
    ]
};
