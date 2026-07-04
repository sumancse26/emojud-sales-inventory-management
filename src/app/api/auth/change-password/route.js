import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import pool from '@/lib/db'; // adjust import as needed

export async function POST(req) {
    try {
        const cookieStore = await cookies();
        const userInfoCookie = cookieStore.get('user_info')?.value;
        const userInfo = userInfoCookie ? JSON.parse(userInfoCookie) : null;

        if (!userInfo) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Unauthorized User'
                },
                {
                    status: 401
                }
            );
        }

        const body = await req.json();

        const changePasswordQuery = `
            CALL PD_CHANGE_PASSWORD($1::jsonb)
        `;

        const changePasswordValues = [
            {
                user_id: userInfo.user_id,
                old_password: body.old_password,
                new_password: body.new_password
            }
        ];

        const changePasswordRes = await pool.query(changePasswordQuery, changePasswordValues);

        const changePasswordInfo = changePasswordRes.rows[0]?.p_status;

        // Password changed successfully
        if (changePasswordInfo?.response_code === 200) {
            const response = NextResponse.json(changePasswordInfo, {
                status: 200
            });

            response.cookies.set('access_token', '', {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 0
            });

            response.cookies.set('user_info', '', {
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 0
            });

            return response;
        }

        return NextResponse.json(changePasswordInfo, {
            status: changePasswordInfo?.response_code || 400
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: error.message || 'Internal Server Error'
            },
            {
                status: 500
            }
        );
    }
}
