'use server';

import { cookies } from 'next/headers';
import { saveCommissionProfit } from '@/services/commissionProfit';

export const saveCommissionProfitAction = async (payload) => {
    const cookieStore = await cookies();
    const headers = {
        Cookie: cookieStore.toString()
    };

    const res = await saveCommissionProfit(payload, headers);
    return res;
};
