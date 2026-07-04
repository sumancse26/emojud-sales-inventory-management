import { cookies } from 'next/headers';
import InvoiceFeature from './_feature';
import { getInvoiceList } from '@/services/invoice';
import { getCustomerList } from '@/services/customers';
import { getShopList } from '@/services/shop';
import { getShopWiseProductList } from '@/services/products';

export default async function InvoicePage() {
    const cookieStore = await cookies();
    const userInfoCookie = cookieStore.get('user_info')?.value;
    let userInfo = {};

    if (userInfoCookie) {
        try { userInfo = JSON.parse(userInfoCookie); } catch { /* ignore */ }
    }

    const headers = { Cookie: cookieStore.toString() };
    let invoices = [], customers = [], shops = [], products = [];

    try {
        const [invoiceRes, customerRes, shopRes, productRes] = await Promise.all([
            getInvoiceList(headers),
            getCustomerList(headers),
            getShopList(headers),
            getShopWiseProductList(headers),
        ]);
        invoices = invoiceRes?.data || [];
        customers = customerRes?.data || [];
        shops = shopRes?.data || [];
        products = productRes?.data || [];
    } catch (error) {
        console.error('Failed to load invoice data:', error);
    }

    return (
        <InvoiceFeature
            initialInvoices={invoices}
            customers={customers}
            shops={shops}
            products={products}
            userInfo={userInfo}
        />
    );
}

