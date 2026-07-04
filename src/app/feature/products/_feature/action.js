'use server';

import { cookies } from 'next/headers';
import { saveProduct } from '@/services/products';

export const saveProductAction = async (payload) => {
    const cookieStore = await cookies();
    const headers = {
        Cookie: cookieStore.toString(),
    };

    return saveProduct(payload, headers);
};
