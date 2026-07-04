import { NextResponse } from 'next/server';
import { verifyAuthToken, signAccessToken } from '@/lib/jwt';

export async function POST(req) {
    try {
        const refreshToken = req.cookies.get('refresh_token')?.value;

        if (!refreshToken) {
            return NextResponse.json({ success: false, message: 'Refresh token not found' }, { status: 401 });
        }

        const payload = await verifyAuthToken(refreshToken);

        if (!payload) {
            return NextResponse.json({ success: false, message: 'Invalid or expired refresh token' }, { status: 401 });
        }

        // Token is valid, let's create a new access token.
        // We might not have company_id in the refresh token payload if we didn't add it.
        // But we added user_id and session_id.
        // We can just use what's in the refresh token, or require re-fetching user info.
        // For now, let's just create an access token with the user_id.

        // Let's actually fetch the user_info cookie which usually has company_id
        const userInfoStr = req.cookies.get('user_info')?.value;
        let company_id = null;
        if (userInfoStr) {
            try {
                const userInfo = JSON.parse(userInfoStr);
                company_id = userInfo.company_id;
            } catch (e) {
                console.error('Failed to parse user_info cookie:', e);
            }
        }

        const newAccessToken = await signAccessToken({
            user_id: payload.user_id,
            company_id: company_id
        });

        const response = NextResponse.json({
            success: true,
            message: 'Token refreshed successfully'
        });

        response.cookies.set('access_token', newAccessToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: process.env.JWT_ACCESS_EXPIRES
        });

        return response;
    } catch (error) {
        console.error('Refresh token error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
