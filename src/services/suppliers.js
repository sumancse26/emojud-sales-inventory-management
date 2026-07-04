import { fetchApi } from '@/lib/api';

export const getSupplierList = async (customHeaders = {}) => {
    try {
        const url = customHeaders?.Cookie ? '/api/suppliers' : '/suppliers';
        const res = await fetchApi(url, {
            method: 'GET',
            headers: customHeaders
        });
        return res;
    } catch (error) {
        throw error;
    }
};

export const saveSupplier = async (payload, customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/suppliers', {
            method: 'POST',
            headers: customHeaders,
            body: payload
        });
        return res;
    } catch (error) {
        throw error;
    }
};

export const getSupplierByPhone = async (phone) => {
    try {
        const res = await fetchApi(`/api/suppliers/${encodeURIComponent(phone)}`, {
            method: 'GET'
        });
        return res;
    } catch (error) {
        throw error;
    }
};
