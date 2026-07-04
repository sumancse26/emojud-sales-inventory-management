'use server';

import { cookies } from 'next/headers';
import { savePurchase } from '@/services/purchase';
import { saveSupplier } from '@/services/suppliers';

export const savePurchaseAction = async (payload) => {
    const cookieStore = await cookies();
    const headers = {
        Cookie: cookieStore.toString(),
    };

    return savePurchase(payload, headers);
};

export const saveSupplierAction = async (payload) => {
    const cookieStore = await cookies();
    const headers = {
        Cookie: cookieStore.toString(),
    };

    return saveSupplier(payload, headers);
};
