'use server';

import { cookies } from 'next/headers';
import { login, logout, navMenu } from '@/services/auth';

export const loginAction = async (data) => {
    const cookieStore = await cookies();
    const headers = {
        Cookie: cookieStore.toString()
    };

    const res = await login(data, headers);

    if (res?.response_code === 200 && res?.data?.session_id) {
        const { signAccessToken, signRefreshToken } = await import('@/lib/jwt');

        const accessToken = await signAccessToken({
            user_id: res.data.user_id,
            company_id: res.data.company_id
        });

        const refreshToken = await signRefreshToken({
            user_id: res.data.user_id,
            session_id: res.data.session_id
        });

        cookieStore.set('access_token', accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: process.env.JWT_ACCESS_EXPIRES // e.g. 900 for 15m
        });

        cookieStore.set('refresh_token', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: process.env.JWT_REFRESH_EXPIRES // e.g. 604800 for 7d
        });

        cookieStore.set('user_info', JSON.stringify(res.data), {
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: process.env.JWT_REFRESH_EXPIRES
        });
    }

    return res;
};

export const logoutAction = async (data) => {
    const cookieStore = await cookies();
    const headers = {
        Cookie: cookieStore.toString()
    };

    const res = await logout(data, headers);

    cookieStore.set('access_token', '', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 0
    });

    cookieStore.set('refresh_token', '', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 0
    });

    cookieStore.set('user_info', '', {
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 0
    });

    return res;
};

export const refetchNavMenu = async (data) => {
    const cookieStore = await cookies();
    const existingUserInfo = cookieStore.get('user_info')?.value;

    let parsedUserInfo = {};

    if (existingUserInfo) {
        try {
            parsedUserInfo = JSON.parse(existingUserInfo);
        } catch (error) {
            console.error('Failed to parse user_info cookie:', error);
        }
    }
    const nextUserInfo = {
        ...parsedUserInfo,
        shop_id: Number(data.shop_id),
        warehouse_id: Number(data.warehouse_id)
    };

    cookieStore.set('user_info', JSON.stringify(nextUserInfo), {
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/'
    });

    const headers = {
        Cookie: cookieStore.toString()
    };

    const res = await navMenu(headers);

    return res;
};
