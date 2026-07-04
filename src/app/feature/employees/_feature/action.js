'use server';

import { cookies } from 'next/headers';
import { saveEmployee } from '@/services/employees';

export const saveEmployeeAction = async (payload) => {
    const cookieStore = await cookies();
    const headers = {
        Cookie: cookieStore.toString(),
    };

    return saveEmployee(payload, headers);
};
