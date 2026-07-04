'use server';

import { cookies } from 'next/headers';
import { saveCategorySubcategory } from '@/services/productCategory';

export const saveCategorySubcategoryAction = async (payload) => {
    const cookieStore = await cookies();
    const headers = {
        Cookie: cookieStore.toString(),
    };

    return saveCategorySubcategory(payload, headers);
};
