import { fetchApi } from '@/lib/api';

export const getDepartmentList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/departments', { method: 'GET', headers: customHeaders });
        return res;
    } catch (error) {
        throw error;
    }
};

export const saveDepartment = async (payload, customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/departments', { method: 'POST', headers: customHeaders, body: payload });
        return res;
    } catch (error) {
        throw error;
    }
};
