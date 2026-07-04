import { fetchApi } from '@/lib/api';

export const getDesignationList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/designation', { method: 'GET', headers: customHeaders });
        return res;
    } catch (error) {
        throw error;
    }
};

export const saveDesignation = async (payload, customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/designation', { method: 'POST', headers: customHeaders, body: payload });
        return res;
    } catch (error) {
        throw error;
    }
};
