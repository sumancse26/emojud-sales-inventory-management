import { fetchApi } from '@/lib/api';

export const getPurchaseList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/purchase', { method: 'GET', headers: customHeaders });
        return res;
    } catch (error) {
        throw error;
    }
};

export const getPurchaseDetail = async (id) => {
    try {
        const res = await fetchApi(`/purchase/${encodeURIComponent(id)}`, { method: 'GET' });
        return res;
    } catch (error) {
        throw error;
    }
};

export const savePurchase = async (payload, customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/purchase', { method: 'POST', headers: customHeaders, body: payload });
        return res;
    } catch (error) {
        throw error;
    }
};
