import { cookies } from 'next/headers';
import ProductsFeature from './_feature';
import { getProductList, getCategoryList } from '@/services/products';
import { getShopList } from '@/services/shop';
import {getBrandList,getUnitList} from '@/services/common'


export default async function Page() {
    const cookieStore = await cookies();
    const userInfoCookie = cookieStore.get('user_info')?.value;
    let userInfo = {};

    if (userInfoCookie) {
        try { userInfo = JSON.parse(userInfoCookie); } catch { /* ignore */ }
    }

    const headers = { Cookie: cookieStore.toString() };
    let products = [];
    let categories = [];
    let shops = [];
    let brand = [];
    let units = [];

    try {
        const [productRes, categoryRes, shopRes, brandRes, unitRes] = await Promise.all([
            getProductList(headers),
            getCategoryList(headers),
            getShopList(headers),
            getBrandList(headers),
            getUnitList(headers)
        ]);
        products = productRes?.data || [];
        categories = categoryRes?.data || [];
        shops = shopRes?.data || [];
        brand = brandRes?.data || [];
        units = unitRes?.data || [];
    } catch (error) {
        console.error('Failed to load products data:', error);
    }

    return (
        <ProductsFeature
            initialProducts={products}
            initialCategories={categories}
            shops={shops}
            userInfo={userInfo}
            brand={brand}
            units={units}
        />
    );
}

