'use server';

import { cookies } from 'next/headers';
import { saveSupplier } from '@/services/suppliers';

export const saveSupplierAction = async (payload) => {
    const cookieStore = await cookies();
    const headers = {
        Cookie: cookieStore.toString(),
    };

    return saveSupplier(payload, headers);
};
