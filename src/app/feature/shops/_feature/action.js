'use server';

import { cookies } from 'next/headers';
import { saveShop } from '@/services/shop';

export const saveShopAction = async (payload) => {
    const cookieStore = await cookies();
    const headers = {
        Cookie: cookieStore.toString()
    };

    const res = await saveShop(payload, headers);
    return res;
};
