import { cookies } from 'next/headers';
import SuppliersFeature from './_feature';
import { getSupplierList } from '@/services/suppliers';
import { getShopList } from '@/services/shop';

export default async function SuppliersPage() {
    const cookieStore = await cookies();
    const userInfoCookie = cookieStore.get('user_info')?.value;
    let userInfo = {};

    if (userInfoCookie) {
        try { userInfo = JSON.parse(userInfoCookie); } catch { /* ignore */ }
    }

    const headers = { Cookie: cookieStore.toString() };
    let suppliers = [];
    let shops = [];

    try {
        const [supplierRes, shopRes] = await Promise.all([
            getSupplierList(headers),
            getShopList(headers)
        ]);
        suppliers = supplierRes?.data || [];
        shops = shopRes?.data || [];
    } catch (error) {
        console.error('Failed to load suppliers data:', error);
    }

    return (
        <SuppliersFeature
            initialSuppliers={suppliers}
            shops={shops}
            userInfo={userInfo}
        />
    );
}

