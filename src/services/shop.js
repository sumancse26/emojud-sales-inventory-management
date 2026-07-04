import { fetchApi } from '@/lib/api';

export const getUserWiseShopList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/user-wise-shop', {
            method: 'GET',
            headers: customHeaders
        });
        return res;
    } catch (error) {
        console.error('Nav menu error:', error);
        throw error;
    }
};
export const getShopList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/shop', {
            method: 'GET',
            headers: customHeaders
        });
        return res;
    } catch (error) {
        console.error('Nav menu error:', error);
        throw error;
    }
};

export const saveShop = async (payload, customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/shop', {
            method: 'POST',
            headers: customHeaders,
            body: payload
        });
        return res;
    } catch (error) {
        throw error;
    }
};
