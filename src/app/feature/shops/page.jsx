import { cookies } from 'next/headers';
import { getShopList } from '@/services/shop';
import ShopsFeature from './_feature';

export default async function Page() {
    const cookieStore = await cookies();
    const userInfoCookie = cookieStore.get('user_info')?.value;
    const userInfo = userInfoCookie ? JSON.parse(userInfoCookie) : null;
    const customHeaders = { Cookie: cookieStore.toString() };

    const shopRes = await getShopList(customHeaders).catch(() => null);
    const shops = shopRes?.data ?? [];

    return <ShopsFeature initialShops={shops} userInfo={userInfo} />;
}

