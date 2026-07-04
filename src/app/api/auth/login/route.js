import { NextResponse } from 'next/server';

import pool from '@/lib/db';

export async function POST(req) {
    try {
        const body = await req.json();

        // LOGIN PROCEDURE
        const loginQuery = `
            CALL PD_LOGIN($1::jsonb)
        `;

        const loginValues = [
            {
                username: body.username,
                password: body.password
            }
        ];

        const loginRes = await pool.query(loginQuery, loginValues);

        const loginInfo = loginRes.rows[0]?.p_status;

        // CHECK LOGIN RESPONSE
        if (loginInfo?.response_code !== 200) {
            return NextResponse.json(loginInfo, {
                status: 401
            });
        }

        // USER INFO QUERY
        const userInfoQuery = `
            SELECT *
            FROM FD_GET_USER_INFO($1, $2)
        `;

        const userInfoValues = [loginInfo.company_id, loginInfo.user_id];

        const userInfoRes = await pool.query(userInfoQuery, userInfoValues);

        const response = {
            response_code: 200,
            message: 'Login Successful',
            data: {
                ...userInfoRes.rows[0].fd_get_user_info?.data,
                user_id: loginInfo?.user_id,
                company_id: loginInfo?.company_id,
                session_id: loginInfo?.session_id
            }
        };

        const nextResponse = NextResponse.json(response);

        // JWT Authentication
        const { signAccessToken, signRefreshToken } = await import('@/lib/jwt');

        const accessToken = await signAccessToken({
            user_id: loginInfo.user_id,
            company_id: loginInfo.company_id
        });

        const refreshToken = await signRefreshToken({
            user_id: loginInfo.user_id,
            session_id: loginInfo.session_id
        });

        nextResponse.cookies.set('access_token', accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: process.env.JWT_ACCESS_EXPIRES // 15 minutes
        });

        nextResponse.cookies.set('refresh_token', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: process.env.JWT_REFRESH_EXPIRES // 7 days
        });

        nextResponse.cookies.set('user_info', JSON.stringify(response.data), {
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: process.env.JWT_REFRESH_EXPIRES // 7 days
        });

        return nextResponse;
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: error.message
            },
            {
                status: 500
            }
        );
    }
}
