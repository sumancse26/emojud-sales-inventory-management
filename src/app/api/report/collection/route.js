import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/lib/db';

export async function GET(req) {
    try {
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

        const userInfo = JSON.parse(userInfoCookie);

        // capture optional filters from query string: product_id, from_date, to_date
        const url = new URL(req.url);
        const from_date = url.searchParams.get('from_date');
        const to_date = url.searchParams.get('to_date');

        const query = `
            SELECT * FROM FD_RPT_COLLECTION($1, $2, $3)
        `;

        const values = [Number(userInfo.shop_id), from_date, to_date];

        const result = await pool.query(query, values);
        const data = result.rows?.[0]?.fd_rpt_collection;

        // Return the original data plus the captured params so frontend calls are visible here.
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
