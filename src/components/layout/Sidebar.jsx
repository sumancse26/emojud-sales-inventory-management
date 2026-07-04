import SidebarClient, { MobileSidebarClient } from './SidebarClient';
import { cookies } from 'next/headers';
import { getUserWiseShopList } from '@/services/shop';

export const fetchShopList = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
        return [];
    }

    const headers = {
        'Cookie': cookieStore.toString()
    };

    const res = await getUserWiseShopList(headers);

    return res.data || [];
};

export async function MobileSidebar({ featureData, userInfo }) {
    const resolvedFeatureData = featureData;
    const shopList = await fetchShopList();

    return <MobileSidebarClient featureData={resolvedFeatureData} userInfo={userInfo} shopList={shopList} />;
}

export default async function Sidebar({ featureData, userInfo, shopList: providedShopList }) {
    const resolvedFeatureData = featureData;
    const shopList = providedShopList ?? await fetchShopList();

    return <SidebarClient featureData={resolvedFeatureData} userInfo={userInfo} shopList={shopList} />;
}
