'use server';

import { cookies } from 'next/headers';
import { saveExpense } from '@/services/expense';

export const saveExpenseAction = async (payload) => {
    const cookieStore = await cookies();
    const headers = {
        Cookie: cookieStore.toString(),
    };

    return saveExpense(payload, headers);
};
