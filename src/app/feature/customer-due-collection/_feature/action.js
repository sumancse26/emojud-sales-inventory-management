'use server';

import { cookies } from 'next/headers';
import { saveCustomerDue } from '@/services/customerDue';

export const saveCustomerDueAction = async (payload) => {
    const cookieStore = await cookies();
    const headers = {
        Cookie: cookieStore.toString()
    };

    const res = await saveCustomerDue(payload, headers);
    return res;
};