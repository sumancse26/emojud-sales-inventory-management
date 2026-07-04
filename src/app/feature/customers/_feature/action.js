'use server';

import { cookies } from 'next/headers';
import { saveCustomer } from '@/services/customers';

export const saveCustomerAction = async (payload) => {
    const cookieStore = await cookies();
    const headers = {
        Cookie: cookieStore.toString(),
    };

    return saveCustomer(payload, headers);
};
