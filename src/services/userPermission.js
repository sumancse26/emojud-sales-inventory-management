import { fetchApi } from '@/lib/api';

export const getUserPermissionList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/user-wise-permission', {
            method: 'GET',
            headers: customHeaders,
        });
        return res;
    } catch (error) {
        throw error;
    }
};

export const getUserShopsByUserId = async (userId) => {
    try {
        const res = await fetchApi(`/user-wise-shop/${userId}`, {
            method: 'GET',
        });
        return res;
    } catch (error) {
        throw error;
    }
};

export const saveUserShopPermission = async (payload, customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/user-wise-permission', {
            method: 'POST',
            headers: customHeaders,
            body: payload,
        });
        return res;
    } catch (error) {
        throw error;
    }
};
