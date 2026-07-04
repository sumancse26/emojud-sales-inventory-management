import { fetchApi } from '@/lib/api';

export const getExpenseList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/expense', { method: 'GET', headers: customHeaders });
        return res;
    } catch (error) {
        throw error;
    }
};

export const getExpenseDetail = async (id) => {
    try {
        const res = await fetchApi(`/expense/${encodeURIComponent(id)}`, { method: 'GET' });
        return res;
    } catch (error) {
        throw error;
    }
};

export const saveExpense = async (payload, customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/expense', { method: 'POST', headers: customHeaders, body: payload });
        return res;
    } catch (error) {
        throw error;
    }
};

