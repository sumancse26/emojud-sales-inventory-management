import { cookies } from 'next/headers';
import UserShopPermissionFeature from './_feature';
import { getUserPermissionList } from '@/services/userPermission';
import { getShopList } from '@/services/shop';

export default async function UserShopPermissionPage() {
    const cookieStore = await cookies();
    const userInfoCookie = cookieStore.get('user_info')?.value;
    let userInfo = {};

    if (userInfoCookie) {
        try { userInfo = JSON.parse(userInfoCookie); } catch { /* ignore */ }
    }

    const headers = { Cookie: cookieStore.toString() };
    let users = [];
    let shops = [];

    try {
        const [userRes, shopRes] = await Promise.all([
            getUserPermissionList(headers),
            getShopList(headers),
        ]);
        users = Array.isArray(userRes) ? userRes : (userRes?.data || []);
        shops = shopRes?.data || [];
    } catch (error) {
        console.error('Failed to load permission data:', error);
    }

    return (
        <UserShopPermissionFeature
            initialUsers={users}
            shops={shops}
            userInfo={userInfo}
        />
    );
}
