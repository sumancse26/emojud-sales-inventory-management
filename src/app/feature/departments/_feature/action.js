'use server';

import { cookies } from 'next/headers';
import { saveDepartment } from '@/services/department';

export const saveDepartmentAction = async (payload) => {
    const cookieStore = await cookies();
    const headers = {
        Cookie: cookieStore.toString(),
    };

    return saveDepartment(payload, headers);
};
