import { NextResponse } from 'next/server';

import pool from '@/lib/db';

export async function GET(req, { params }) {
    try {
        const { id } = await params;

        const query = `
            SELECT * FROM FD_GET_LOOKUP_DETAILS($1)
        `;

        const result = await pool.query(query, [Number(id)]);
        const data = result.rows?.[0]?.fd_get_lookup_details || [];

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
