import { fetchApi } from '@/lib/api';

export const getInvoiceList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/invoice', { method: 'GET', headers: customHeaders });
        return res;
    } catch (error) {
        throw error;
    }
};

export const getInvoiceDetail = async (id) => {
    try {
        const res = await fetchApi(`/invoice/${encodeURIComponent(id)}`, { method: 'GET' });
        return res;
    } catch (error) {
        throw error;
    }
};

export const saveInvoice = async (payload, customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/invoice', { method: 'POST', headers: customHeaders, body: payload });
        return res;
    } catch (error) {
        throw error;
    }
};
