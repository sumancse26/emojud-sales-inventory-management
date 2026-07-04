import { cookies } from 'next/headers';
import DesignationFeature from './_feature';
import { getDesignationList } from '@/services/designation';

export default async function DesignationPage() {
    const cookieStore = await cookies();
    const userInfoCookie = cookieStore.get('user_info')?.value;
    let userInfo = {};

    if (userInfoCookie) {
        try { userInfo = JSON.parse(userInfoCookie); } catch { /* ignore */ }
    }

    const headers = { Cookie: cookieStore.toString() };
    let designations = [];

    try {
        const res = await getDesignationList(headers);
        designations = res?.data || [];
    } catch (error) {
        console.error('Failed to load designations:', error);
    }

    return <DesignationFeature initialList={designations} userInfo={userInfo} />;
}
