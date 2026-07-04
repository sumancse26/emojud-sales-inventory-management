'use server';

import { cookies } from 'next/headers';
import { saveSupplierPayment } from '@/services/supplierPayment';

export const saveSupplierPaymentAction = async (payload) => {
    const cookieStore = await cookies();
    const headers = {
        Cookie: cookieStore.toString()
    };

    const res = await saveSupplierPayment(payload, headers);
    return res;
};