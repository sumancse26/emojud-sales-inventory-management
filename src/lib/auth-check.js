import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Routes that require login
const PROTECTED_PREFIXES = ['/dashboard', '/admin'];

// Auth pages (redirect if logged-in)
const AUTH_PAGES = new Set(['/auth/login', '/auth/register', '/auth/forgot-password']);

const matchesPrefix = (pathname, prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`);

/**
 * Server-side auth check for protected pages
 * Use this in page.jsx files that require authentication
 */
export async function requireAuth(pathname) {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    const isProtected = PROTECTED_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix));

    if (isProtected && !token) {
        redirect(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }

    return { token, isAuthenticated: !!token };
}

/**
 * Server-side check to redirect authenticated users away from auth pages
 * Use this in login/register page.jsx files
 */
export async function redirectIfAuthenticated(pathname) {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (token && AUTH_PAGES.has(pathname)) {
        redirect('/dashboard');
    }

    return { token, isAuthenticated: !!token };
}
