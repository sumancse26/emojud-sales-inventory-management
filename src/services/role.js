import { fetchApi } from '@/lib/api';

export const getRoleList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/role', { method: 'GET', headers: customHeaders });
        return res;
    } catch (error) {
        throw error;
    }
};

export const saveRole = async (payload, customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/role', { method: 'POST', headers: customHeaders, body: payload });
        return res;
    } catch (error) {
        throw error;
    }
};
