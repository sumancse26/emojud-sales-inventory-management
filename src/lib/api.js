class ApiError extends Error {
    constructor(message, status, details = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.details = details;
    }
}

export async function fetchApi(endpoint, options = {}) {
    const {
        token: explicitToken,
        headers: optionHeaders,
        body: rawBody,
        method: optionMethod,
        next,
        cache,
        ...restOptions
    } = options;

    // 1. Prepare Options & Check for File Upload
    const isFormData = rawBody instanceof FormData;
    const method = optionMethod || 'GET';
    let body = rawBody;

    if (body && !isFormData && typeof body === 'object') {
        body = JSON.stringify(body);
    }

    // 2. Get Base URL
    // Server-side: use localhost for direct backend calls
    // Client-side: use the public API URL (domain)
    const isServer = typeof window === 'undefined';
    let baseUrl;
    let finalEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const normalizedEndpoint = finalEndpoint;

    if (isFormData && process.env.NEXT_PUBLIC_API_IMG_URL) {
        // When uploading files (FormData), use the image API URL
        baseUrl = `${process.env.NEXT_PUBLIC_API_IMG_URL.replace(/\/+$/, '')}`;
    } else if (isServer) {
        if (normalizedEndpoint.startsWith('/api/')) {
            try {
                const { headers } = await import('next/headers');
                const headerStore = await headers();
                const protocol = headerStore.get('x-forwarded-proto') || 'http';
                const host = headerStore.get('x-forwarded-host') || headerStore.get('host');

                if (!host) {
                    throw new Error('Unable to resolve application host');
                }

                baseUrl = `${protocol}://${host}`;
            } catch {
                baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            }
        } else {
            // Server-side direct backend calls
            baseUrl = 'http://127.0.0.1:3006';
        }
    } else {
        // Client-side (browser): use the public-facing API URL
        baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

        if (!process.env.NEXT_PUBLIC_API_URL) {
            console.warn('NEXT_PUBLIC_API_URL is not defined in .env');
        }
    }

    // 3. Construct URL
    // Handle potential double slashes or missing slashes
    const normalizeUrl = (base, path) => {
        const b = base ? base.replace(/\/+$/, '') : '';
        const p = path.replace(/^\/+/, '');
        return `${b}/${p}`;
    };

    let url = normalizeUrl(baseUrl || '', finalEndpoint);

    // Build headers - no Authorization header needed since we're using httpOnly cookies
    const headers = {
        ...(!isFormData && body && { 'Content-Type': 'application/json' }),
        ...(optionHeaders || {}) // Merge custom headers here, including forwarded 'Cookie'
    };

    const finalOptions = {
        method,
        body,
        headers,
        credentials: 'include', // Important for cookies/sessions across CORS - this will send httpOnly cookies
        ...(next && { next }), // Next.js revalidation options
        ...(cache && { cache }), // Next.js cache options
        ...restOptions
    };

    try {
        let response = await fetch(url, finalOptions);

        // --- Frontend Refresh Token Logic ---
        if (!response.ok && response.status === 401 && !isServer && !options._retry && !url.includes('/api/auth/')) {
            try {
                const refreshUrl = normalizeUrl(baseUrl || '', '/api/auth/refresh');
                const refreshRes = await fetch(refreshUrl, {
                    method: 'POST',
                    credentials: 'include'
                });

                if (refreshRes.ok) {
                    // Token refreshed successfully, retry the original request
                    const retryOptions = { ...finalOptions, _retry: true };
                    response = await fetch(url, retryOptions);
                } else {
                    // Refresh failed, redirect to login
                    window.location.replace('/login');
                }
            } catch (err) {
                window.location.replace('/login');
            }
        }

        // 4. Handle Response Content
        const contentType = response.headers.get('content-type') || '';
        let data = null;

        // Check for HTML response (common error when hitting wrong endpoints/404s)
        if (contentType.includes('text/html')) {
            const text = await response.text();
            console.error(`API Error: Received HTML from ${url}. Likely 404 or Server Error.`);
            // Try to extract a title or message from HTML if possible, otherwise generic
            throw new ApiError(
                `Server returned HTML response (Status ${response.status}). Check API URL.`,
                response.status,
                text
            );
        }

        if (contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            data = text || null;
        }

        // 5. Handle HTTP Errors
        if (!response.ok) {
            const message = (data && data.message) || `Request failed with status ${response.status}`;

            if (!isServer && response.status === 401 && !options._retry) {
                window.location.replace('/login');
            }

            throw new ApiError(message, response.status, data);
        }

        return data;
    } catch (error) {
        console.error(`API call to "${url}" failed:`, error);

        // Ensure we don't double-toast if the caller handles it, or enable global toast here:
        // toast.error(error.message || "An unexpected error occurred.");

        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(error.message || 'An unexpected error occurred while contacting the server.', 0, null);
    }
}

export { ApiError };
