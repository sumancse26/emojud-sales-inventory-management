import { fetchApi } from '@/lib/api';

export const getCustomerList = async (customHeaders = {}) => {
    try {
        const url = customHeaders?.Cookie ? '/api/customers' : '/customers';
        const res = await fetchApi(url, {
            method: 'GET',
            headers: customHeaders
        });
        return res;
    } catch (error) {
        throw error;
    }
};

export const getCustomerByPhone = async (phone) => {
    try {
        const res = await fetchApi(`/api/customers/${encodeURIComponent(phone)}`, {
            method: 'GET'
        });
        return res;
    } catch (error) {
        throw error;
    }
};

export const saveCustomer = async (payload, customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/customers', {
            method: 'POST',
            headers: customHeaders,
            body: payload
        });
        return res;
    } catch (error) {
        throw error;
    }
};
