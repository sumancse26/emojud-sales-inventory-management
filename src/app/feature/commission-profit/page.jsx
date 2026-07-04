import { cookies } from 'next/headers';
import CommissionProfitFeature from './_feature';
import { getCommissionProfitList } from '@/services/commissionProfit';

const normalizeList = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.response?.data)) return res.response.data;
    return [];
};

export default async function CommissionProfitPage() {
    const cookieStore = await cookies();
    const userInfoCookie = cookieStore.get('user_info')?.value;
    let userInfo = {};

    if (userInfoCookie) {
        try {
            userInfo = JSON.parse(userInfoCookie);
        } catch {
            userInfo = {};
        }
    }

    const headers = { Cookie: cookieStore.toString() };

    let commissions = [];

    try {
        const commissionRes = await getCommissionProfitList(headers);
        commissions = normalizeList(commissionRes);
    } catch (error) {
        console.error('Failed to load commission profit data:', error);
    }

    return <CommissionProfitFeature initialCommissions={commissions} userInfo={userInfo} />;
}
