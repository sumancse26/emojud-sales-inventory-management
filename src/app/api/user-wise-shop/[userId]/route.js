import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import pool from '@/lib/db';

export async function GET(req, { params }) {
    try {
        const { userId } = await params;
        const cookieStore = await cookies();
        const userInfoCookie = cookieStore.get('user_info')?.value;

        if (!userInfoCookie) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized User' },
                { status: 401 }
            );
        }

        const userInfo = JSON.parse(userInfoCookie);

        const query = `SELECT * FROM FD_GET_USER_SHOP_LIST($1, $2)`;
        const result = await pool.query(query, [Number(userId), Number(userInfo.company_id)]);
        const data = result.rows?.[0]?.fd_get_user_shop_list;

        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
