import { cookies } from 'next/headers';
import DepartmentsFeature from './_feature';
import { getDepartmentList } from '@/services/department';

export default async function DepartmentsPage() {
    const cookieStore = await cookies();
    const userInfoCookie = cookieStore.get('user_info')?.value;
    let userInfo = {};

    if (userInfoCookie) {
        try { userInfo = JSON.parse(userInfoCookie); } catch { /* ignore */ }
    }

    const headers = { Cookie: cookieStore.toString() };
    let departments = [];

    try {
        const res = await getDepartmentList(headers);
        departments = res?.data || [];
    } catch (error) {
        console.error('Failed to load departments:', error);
    }

    return <DepartmentsFeature initialList={departments} userInfo={userInfo} />;
}
