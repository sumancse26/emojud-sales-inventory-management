import { fetchApi } from '@/lib/api';

export const getCommissionProfitList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/shop-wise-commission-profit', {
            method: 'GET',
            headers: customHeaders,
        });
        return res;
    } catch (error) {
        throw error;
    }
};

export const saveCommissionProfit = async (payload, customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/shop-wise-commission-profit', {
            method: 'POST',
            headers: customHeaders,
            body: payload,
        });
        return res;
    } catch (error) {
        throw error;
    }
};
