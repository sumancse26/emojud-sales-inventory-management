import { fetchApi } from '@/lib/api';

export const getCustomerDueList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/customer-due', {
            method: 'GET',
            headers: customHeaders
        });
        return res;
    } catch (error) {
        throw error;
    }
};

export const getCustomerPendingDueList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/customer-due/pending', {
            method: 'GET',
            headers: customHeaders
        });
        return res;
    } catch (error) {
        throw error;
    }
};

export const getInvoiceWiseDueList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/customer-due/invoice', {
            method: 'GET',
            headers: customHeaders
        });
        return res;
    } catch (error) {
        throw error;
    }
};

export const saveCustomerDue = async (payload, customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/customer-due', {
            method: 'POST',
            headers: customHeaders,
            body: payload
        });
        return res;
    } catch (error) {
        throw error;
    }
};
