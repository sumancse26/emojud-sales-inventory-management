import { cookies } from 'next/headers';
import PurchaseFeature from './_feature';
import { getPurchaseList } from '@/services/purchase';
import { getSupplierList } from '@/services/suppliers';
import { getWarehouseList } from '@/services/warehouse';
import { getShopList } from '@/services/shop';
import { getProductList } from '@/services/products';

export default async function PurchasePage() {
    const cookieStore = await cookies();
    const userInfoCookie = cookieStore.get('user_info')?.value;
    let userInfo = {};

    if (userInfoCookie) {
        try { userInfo = JSON.parse(userInfoCookie); } catch { /* ignore */ }
    }

    const headers = { Cookie: cookieStore.toString() };
    let purchases = [], suppliers = [], warehouses = [], shops = [], products = [];

    try {
        const [purchaseRes, supplierRes, warehouseRes, shopRes, productRes] = await Promise.all([
            getPurchaseList(headers),
            getSupplierList(headers),
            getWarehouseList(headers),
            getShopList(headers),
            getProductList(headers),
        ]);
        purchases = purchaseRes?.data || [];
        suppliers = supplierRes?.data || [];
        warehouses = warehouseRes?.data || [];
        shops = shopRes?.data || [];
        products = productRes?.data || [];
    } catch (error) {
        console.error('Failed to load purchase data:', error);
    }

    return (
        <PurchaseFeature
            initialPurchases={purchases}
            suppliers={suppliers}
            warehouses={warehouses}
            shops={shops}
            products={products}
            userInfo={userInfo}
        />
    );
}

