'use server';

import { cookies } from 'next/headers';
import { saveInvoice } from '@/services/invoice';
import { saveCustomer } from '@/services/customers';

export const saveInvoiceAction = async (payload) => {
    const cookieStore = await cookies();
    const headers = {
        Cookie: cookieStore.toString(),
    };

    return saveInvoice(payload, headers);
};

export const saveCustomerAction = async (payload) => {
    const cookieStore = await cookies();
    const headers = {
        Cookie: cookieStore.toString(),
    };

    return saveCustomer(payload, headers);
};
