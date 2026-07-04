import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import pool from '@/lib/db';

export async function GET(req, { params }) {
    try {
        const { id } = await params; //category id
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

        const query = `
            SELECT * FROM FD_GET_SUBCATEGORY_LIST($1, $2)
        `;

        const result = await pool.query(query, [Number(userInfo.company_id), Number(id)]);
        const data = result.rows?.[0]?.fd_get_subcategory_list;

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
