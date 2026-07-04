import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import pool from '@/lib/db';
import { sendAdminNotification } from '@/lib/whatsapp';

export async function POST(req) {
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

        const payload = await req.json();

        const query = `
            CALL PD_CREATE_UPDATE_PRODUCT($1::jsonb)
        `;

        const result = await pool.query(query, [payload]);
        const data = result.rows[0]?.p_status;

        if (data && data.response_code === 200) {
            const isCreated = data.message?.includes('created');
            if (isCreated) {
                const messageText = `📦 *New Product Added to Stock*\n\n` +
                    `*Product:* ${data.product_name || payload.product_name || 'N/A'}\n` +
                    `*Code:* ${data.product_code || 'N/A'}\n` +
                    `*MRP:* ${payload.sales_rate || 0} BDT\n` +
                    `*Min Stock Level:* ${payload.min_stock_qty || 0} pcs`;
                
                // Fire and forget so we don't delay the HTTP response
                sendAdminNotification(messageText).catch(err => {
                    console.error('Failed to send admin whatsapp notification:', err);
                });
            }
        }

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
        const query = `
            SELECT * FROM FD_GET_PRODUCT_LIST($1)
        `;

        const values = [Number(userInfo.shop_id)];

        const result = await pool.query(query, values);
        const data = result.rows?.[0]?.fd_get_product_list;

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
