import { fetchApi } from '@/lib/api';

export const getSupplierPaymentList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/supplier-payment', {
            method: 'GET',
            headers: customHeaders
        });
        return res;
    } catch (error) {
        throw error;
    }
};
export const getShopWiseSupplierPaymentDueList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/supplier-payment/due', {
            method: 'GET',
            headers: customHeaders
        });
        return res;
    } catch (error) {
        throw error;
    }
};

export const getSupplierPendingPaymentList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/supplier-payment/pending', {
            method: 'GET',
            headers: customHeaders
        });
        return res;
    } catch (error) {
        throw error;
    }
};

export const saveSupplierPayment = async (payload, customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/supplier-payment', {
            method: 'POST',
            headers: customHeaders,
            body: payload
        });
        return res;
    } catch (error) {
        throw error;
    }
};
