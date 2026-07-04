import { fetchApi } from '@/lib/api';

export const getStockSummaryList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/stock-summary', {
            method: 'GET',
            headers: customHeaders,
        });
        return res;
    } catch (error) {
        throw error;
    }
};

export const getStockSummaryDetail = async (id, customHeaders = {}) => {
    try {
        const res = await fetchApi(`/stock-summary/${id}`, {
            method: 'GET',
            headers: customHeaders,
        });
        return res;
    } catch (error) {
        throw error;
    }
};
