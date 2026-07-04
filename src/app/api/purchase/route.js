import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import pool from '@/lib/db';
import { sendWhatsAppMessage, sendAdminNotification } from '@/lib/whatsapp';

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
            CALL PD_PUR_REQ($1::jsonb)
        `;

        const result = await pool.query(query, [payload]);
        const data = result.rows[0]?.p_status;

        if (data && data.response_code === 200 && Number(payload.is_confirm) === 1) {
            // It was a confirmed purchase!
            let supplierPhone = null;
            let supplierName = 'Supplier';
            if (payload.supplier_id) {
                try {
                    const suppResult = await pool.query(
                        `SELECT supplier_name, phone FROM SUPPLIERS WHERE ID = $1`,
                        [payload.supplier_id]
                    );
                    if (suppResult.rows.length > 0) {
                        supplierName = suppResult.rows[0].supplier_name;
                        supplierPhone = suppResult.rows[0].phone;
                    }
                } catch (e) {
                    console.error('Error fetching supplier phone for whatsapp:', e);
                }
            }

            const purchaseNo = data.purchase_no || 'N/A';
            const netAmount = payload.net_amount || 0;
            const paidAmount = payload.paid_amount || 0;
            const dueAmount = payload.due_amount || 0;

            const supplierMessage = `📥 *Purchase Order Confirmed*\n\n` +
                `Dear *${supplierName}*,\n` +
                `A purchase order has been confirmed with you:\n\n` +
                `*PO Number:* ${purchaseNo}\n` +
                `*Total Amount:* ${netAmount} BDT\n` +
                `*Paid Amount:* ${paidAmount} BDT\n` +
                `*Due Amount:* ${dueAmount} BDT\n\n` +
                `Thank you for your service!`;

            const adminMessage = `📥 *Purchase Confirmed (PO #${purchaseNo})*\n\n` +
                `*Supplier:* ${supplierName}\n` +
                `*Total:* ${netAmount} BDT\n` +
                `*Paid:* ${paidAmount} BDT\n` +
                `*Due:* ${dueAmount} BDT`;

            // Send to supplier if phone number exists
            if (supplierPhone) {
                sendWhatsAppMessage(supplierPhone, supplierMessage).catch(err => {
                    console.error('Failed to send supplier whatsapp notification:', err);
                });
            }

            // Send copy to admin
            sendAdminNotification(adminMessage).catch(err => {
                console.error('Failed to send admin whatsapp notification:', err);
            });
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
            SELECT * FROM FD_GET_PUR_REQ_LIST($1)
        `;

        const values = [Number(userInfo.shop_id)];

        const result = await pool.query(query, values);
        const data = result.rows?.[0]?.fd_get_pur_req_list;

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
