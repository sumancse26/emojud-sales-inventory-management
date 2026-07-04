import { fetchApi } from '@/lib/api';

export const getEmployeeList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/employees', {
            method: 'GET',
            headers: customHeaders
        });
        return res;
    } catch (error) {
        throw error;
    }
};

export const saveEmployee = async (payload, customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/employees', {
            method: 'POST',
            headers: customHeaders,
            body: payload
        });
        return res;
    } catch (error) {
        throw error;
    }
};

export const getDepartmentList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/departments', {
            method: 'GET',
            headers: customHeaders
        });
        return res;
    } catch (error) {
        throw error;
    }
};
export const getDesignationList = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/designation', {
            method: 'GET',
            headers: customHeaders
        });
        return res;
    } catch (error) {
        throw error;
    }
};
