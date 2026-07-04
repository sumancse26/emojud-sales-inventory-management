'use server';

import { cookies } from 'next/headers';
import { saveRole } from '@/services/role';

export const saveRoleAction = async (payload) => {
    const cookieStore = await cookies();
    const headers = {
        Cookie: cookieStore.toString(),
    };

    return saveRole(payload, headers);
};
