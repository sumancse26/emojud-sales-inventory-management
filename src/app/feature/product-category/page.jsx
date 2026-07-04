import { cookies } from 'next/headers';
import ProductCategoryFeature from './_feature';
import { getCategorySubcategoryList, getCategoryList } from '@/services/productCategory';

export default async function ProductCategoryPage() {
    const cookieStore = await cookies();
    const userInfoCookie = cookieStore.get('user_info')?.value;
    let userInfo = {};

    if (userInfoCookie) {
        try { userInfo = JSON.parse(userInfoCookie); } catch { /* ignore */ }
    }

    const headers = { Cookie: cookieStore.toString() };
    let categorySubcategoryList = [];
    let categories = [];

    try {
        const [listRes, catRes] = await Promise.all([
            getCategorySubcategoryList(headers),
            getCategoryList(headers),
        ]);
        categorySubcategoryList = listRes?.data || [];
        categories = catRes?.data || [];
    } catch (error) {
        console.error('Failed to load category data:', error);
    }

    return (
        <ProductCategoryFeature
            initialList={categorySubcategoryList}
            categories={categories}
            userInfo={userInfo}
        />
    );
}
