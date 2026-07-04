'use server';

import { cookies } from 'next/headers';
import { saveDesignation } from '@/services/designation';

export const saveDesignationAction = async (payload) => {
    const cookieStore = await cookies();
    const headers = {
        Cookie: cookieStore.toString(),
    };

    return saveDesignation(payload, headers);
};
