import { fetchApi } from '@/lib/api';

/*
id =============== For what
1  --------------  Gender
2  --------------  Blood Group
3  --------------  Brand
4  --------------  Unit
6  --------------  Expense Head
7  --------------  Payment Method

*/

export const getGenderList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/lookup/1', {
            method: 'GET',
            headers: customHeaders
        });
        return res;
    } catch (error) {
        throw error;
    }
};
export const getBloodGroupList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/lookup/2', {
            method: 'GET',
            headers: customHeaders
        });
        return res;
    } catch (error) {
        throw error;
    }
};
export const getBrandList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/lookup/3', {
            method: 'GET',
            headers: customHeaders
        });
        return res;
    } catch (error) {
        throw error;
    }
};
export const getUnitList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/lookup/4', {
            method: 'GET',
            headers: customHeaders
        });
        return res;
    } catch (error) {
        throw error;
    }
};
export const getExpenseHeadList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/lookup/6', {
            method: 'GET',
            headers: customHeaders
        });
        return res;
    } catch (error) {
        throw error;
    }
};
export const getPaymentMethodList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/lookup/7', {
            method: 'GET',
            headers: customHeaders
        });
        return res;
    } catch (error) {
        throw error;
    }
};
