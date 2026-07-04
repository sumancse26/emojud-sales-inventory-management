import { cookies } from 'next/headers';
import WarehouseFeature from './_feature';
import { getWarehouseList } from '@/services/warehouse';
import { getShopList } from '@/services/shop';

export default async function WarehousePage() {
    const cookieStore = await cookies();
    const userInfoCookie = cookieStore.get('user_info')?.value;
    let userInfo = {};

    if (userInfoCookie) {
        try { userInfo = JSON.parse(userInfoCookie); } catch { /* ignore */ }
    }

    const headers = { Cookie: cookieStore.toString() };
    let warehouses = [];
    let shops = [];

    try {
        const [warehouseRes, shopRes] = await Promise.all([
            getWarehouseList(headers),
            getShopList(headers)
        ]);
        warehouses = warehouseRes?.data || [];
        shops = shopRes?.data || [];
    } catch (error) {
        console.error('Failed to load warehouse data:', error);
    }

    return (
        <WarehouseFeature
            initialWarehouses={warehouses}
            shops={shops}
            userInfo={userInfo}
        />
    );
}
