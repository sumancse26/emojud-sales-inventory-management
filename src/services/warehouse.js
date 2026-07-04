import { fetchApi } from '@/lib/api';

export const getWarehouseList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/warehouse', {
            method: 'GET',
            headers: customHeaders
        });
        return res;
    } catch (error) {
        throw error;
    }
};

export const saveWarehouse = async (payload, customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/warehouse', {
            method: 'POST',
            headers: customHeaders,
            body: payload
        });
        return res;
    } catch (error) {
        throw error;
    }
};
