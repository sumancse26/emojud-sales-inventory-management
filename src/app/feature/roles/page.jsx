import { cookies } from 'next/headers';
import RolesFeature from './_feature';
import { getRoleList } from '@/services/role';

export default async function RolesPage() {
    const cookieStore = await cookies();
    const userInfoCookie = cookieStore.get('user_info')?.value;
    let userInfo = {};

    if (userInfoCookie) {
        try { userInfo = JSON.parse(userInfoCookie); } catch { /* ignore */ }
    }

    const headers = { Cookie: cookieStore.toString() };
    let roles = [];

    try {
        const res = await getRoleList(headers);
        roles = res?.data || [];
    } catch (error) {
        console.error('Failed to load roles:', error);
    }

    return <RolesFeature initialList={roles} userInfo={userInfo} />;
}
