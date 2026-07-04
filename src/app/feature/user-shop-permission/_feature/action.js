'use server';

import { cookies } from 'next/headers';
import { saveUserShopPermission } from '@/services/userPermission';

export const saveUserShopPermissionAction = async (payload) => {
    const cookieStore = await cookies();
    const headers = {
        Cookie: cookieStore.toString(),
    };

    return saveUserShopPermission(payload, headers);
};
