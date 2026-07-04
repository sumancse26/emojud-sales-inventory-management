'use server';

import { cookies } from 'next/headers';
import { saveWarehouse } from '@/services/warehouse';

export const saveWarehouseAction = async (payload) => {
    const cookieStore = await cookies();
    const headers = {
        Cookie: cookieStore.toString(),
    };

    return saveWarehouse(payload, headers);
};
