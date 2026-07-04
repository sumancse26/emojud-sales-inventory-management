import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import pool from '@/lib/db';

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const userInfoCookie = cookieStore.get('user_info')?.value;

        if (!userInfoCookie) {
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

        const query = `
            SELECT * FROM FD_GET_EXPENSE_DTL($1)
        `;

        const values = [Number(id)];

        const result = await pool.query(query, values);
        const data = result.rows?.[0]?.fd_get_expense_dtl || {};

        return NextResponse.json(data);
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
