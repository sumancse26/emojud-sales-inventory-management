import { fetchApi } from '@/lib/api';

export const getCategorySubcategoryList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/product-category-subcategory', {
            method: 'GET',
            headers: customHeaders,
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
            headers: customHeaders,
        });
        return res;
    } catch (error) {
        throw error;
    }
};

export const saveCategorySubcategory = async (payload, customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/product-category-subcategory', {
            method: 'POST',
            headers: customHeaders,
            body: payload,
        });
        return res;
    } catch (error) {
        throw error;
    }
};
