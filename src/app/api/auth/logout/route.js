import { NextResponse } from 'next/server';

import pool from '@/lib/db';

export async function POST(req) {
    try {
        const body = await req.json();

        const query = `
            CALL PD_LOGOUT($1::jsonb)
        `;

        const values = [
            {
                user_id: body.user_id
            }
        ];

        const res = await pool.query(query, values);
        const logoutRes = res.rows[0]?.p_status;
        const response = NextResponse.json(logoutRes);

        if (logoutRes?.success !== false) {
            response.cookies.set('access_token', '', {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 0
            });
            response.cookies.set('refresh_token', '', {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 0
            });
            response.cookies.set('user_info', '', {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 0
            });
        }

        return response;
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
