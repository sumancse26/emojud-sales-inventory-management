import { fetchApi } from '@/lib/api';

export const getProductList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/products', {
            method: 'GET',
            headers: customHeaders
        });
        return res;
    } catch (error) {
        throw error;
    }
};
export const getShopWiseProductList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/shop-wise-products', {
            method: 'GET',
            headers: customHeaders
        });
        return res;
    } catch (error) {
        throw error;
    }
};

export const saveProduct = async (payload, customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/products', {
            method: 'POST',
            headers: customHeaders,
            body: payload
        });
        return res;
    } catch (error) {
        throw error;
    }
};

export const getCategoryList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/product-category', {
            method: 'GET',
            headers: customHeaders
        });
        return res;
    } catch (error) {
        throw error;
    }
};

export const getSubcategoryList = async (categoryId) => {
    try {
        const res = await fetchApi(`/product-subcategory/${encodeURIComponent(categoryId)}`, {
            method: 'GET'
        });
        return res;
    } catch (error) {
        throw error;
    }
};
