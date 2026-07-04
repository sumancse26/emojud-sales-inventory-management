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
            CALL PD_INVOICE($1::jsonb)
        `;

        const result = await pool.query(query, [payload]);
        const data = result.rows[0]?.p_status;

        if (data && data.response_code === 200 && Number(payload.is_submit) === 1) {
            // It was a submitted invoice!
            let customerPhone = null;
            let customerName = 'Customer';
            if (payload.customer_id) {
                try {
                    const custResult = await pool.query(
                        `SELECT customer_name, phone FROM CUSTOMERS WHERE ID = $1`,
                        [payload.customer_id]
                    );
                    if (custResult.rows.length > 0) {
                        customerName = custResult.rows[0].customer_name;
                        customerPhone = custResult.rows[0].phone;
                    }
                } catch (e) {
                    console.error('Error fetching customer phone for whatsapp:', e);
                }
            }

            const invoiceNo = data.invoice_no || 'N/A';
            const netAmount = payload.net_amount || 0;
            const paidAmount = payload.paid_amount || 0;
            const dueAmount = payload.due_amount || 0;

            const customerMessage = `🧾 *Invoice Notification*\n\n` +
                `Dear *${customerName}*,\n` +
                `Thank you for your purchase! Here are your invoice details:\n\n` +
                `*Invoice No:* ${invoiceNo}\n` +
                `*Total Amount:* ${netAmount} BDT\n` +
                `*Paid Amount:* ${paidAmount} BDT\n` +
                `*Due Amount:* ${dueAmount} BDT\n\n` +
                `We appreciate your business!`;

            const adminMessage = `🧾 *New Sale Submitted (Invoice #${invoiceNo})*\n\n` +
                `*Customer:* ${customerName}\n` +
                `*Total:* ${netAmount} BDT\n` +
                `*Paid:* ${paidAmount} BDT\n` +
                `*Due:* ${dueAmount} BDT`;

            // Send to customer if phone number exists
            if (customerPhone) {
                sendWhatsAppMessage(customerPhone, customerMessage).catch(err => {
                    console.error('Failed to send customer whatsapp notification:', err);
                });
            }

            // Send copy to admin
            sendAdminNotification(adminMessage).catch(err => {
                console.error('Failed to send admin whatsapp notification:', err);
            });

            // Check for low stock on all products in the invoice
            if (payload.products && Array.isArray(payload.products)) {
                for (const item of payload.products) {
                    const productId = item.product_id;
                    if (productId) {
                        try {
                            const stockResult = await pool.query(
                                `SELECT p.product_name, p.product_code, p.min_stock_qty, s.current_stock 
                                 FROM PRODUCTS p 
                                 LEFT JOIN STOCK_MST s ON s.PROD_ID = p.ID AND s.SHOP_ID = $1
                                 WHERE p.ID = $2`,
                                [payload.shop_id, productId]
                            );
                            if (stockResult.rows.length > 0) {
                                const prod = stockResult.rows[0];
                                const currentStock = Number(prod.current_stock || 0);
                                const minStock = Number(prod.min_stock_qty || 0);
                                if (currentStock <= minStock) {
                                    const lowStockMsg = `⚠️ *Low Stock Alert*\n\n` +
                                        `*Product:* ${prod.product_name} (${prod.product_code || 'N/A'})\n` +
                                        `*Available Stock:* ${currentStock} pcs\n` +
                                        `*Min. Stock Level:* ${minStock} pcs\n\n` +
                                        `Please restock this product soon!`;
                                    
                                    sendAdminNotification(lowStockMsg).catch(err => {
                                        console.error('Failed to send low stock alert:', err);
                                    });
                                }
                            }
                        } catch (e) {
                            console.error('Error checking stock level for product:', productId, e);
                        }
                    }
                }
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
            SELECT * FROM FD_GET_INVOICE_LIST($1)
        `;

        const values = [Number(userInfo.shop_id)];

        const result = await pool.query(query, values);
        const data = result.rows?.[0]?.fd_get_invoice_list || [];

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
