import { fetchApi } from '@/lib/api';

export const register = async (data) => {
    const res = await fetchApi('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
    });
    return res;
};

export const login = async (data, customHeaders = {}) => {
    const res = await fetchApi('/api/auth/login', {
        method: 'POST',
        headers: customHeaders,
        body: JSON.stringify(data)
    });
    return res;
};

export const logout = async (data, customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/auth/logout', {
            method: 'POST',
            headers: customHeaders,
            body: JSON.stringify(data)
        });
        return res;
    } catch (error) {
        console.error('Logout error:', error);

        throw error;
    }
};

export const navMenu = async (customHeaders = {}) => {
    try {
        const res = await fetchApi('/api/auth/nav-menu', {
            method: 'GET',
            headers: customHeaders
        });
        return res;
    } catch (error) {
        console.error('Nav menu error:', error);

        throw error;
    }
};

export const checkSession = async () => {
    const res = await fetchApi('/api/auth/me', {
        method: 'GET'
    });
    return res;
};
