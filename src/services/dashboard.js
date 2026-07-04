import { fetchApi } from '@/lib/api';

export const getDashboardSummary = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/dashboard', {
            method: 'GET',
            headers: customHeaders
        });
        return res;
    } catch (error) {
        throw error;
    }
};
export const getRecentOperations = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/dashboard/recent-operations', {
            method: 'GET',
            headers: customHeaders
        });
        return res;
    } catch (error) {
        throw error;
    }
};
export const getDashboardOverview = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/dashboard/overview', {
            method: 'GET',
            headers: customHeaders
        });
        return res;
    } catch (error) {
        throw error;
    }
};
export const getStockOverview = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/dashboard/stock-overview', {
            method: 'GET',
            headers: customHeaders
        });
        return res;
    } catch (error) {
        throw error;
    }
};
