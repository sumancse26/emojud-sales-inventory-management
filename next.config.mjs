/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';
const productionDomain = '';
// const productionDomain = 'cyberneticsitbd.com';

const nextConfig = {
    reactCompiler: true,
    experimental: {
        serverActions: {
            bodySizeLimit: '500mb'
        }
    },

    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api'
    },

    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            { protocol: 'https', hostname: '*' },
            { protocol: 'http', hostname: '*' }
        ]
    },

    async headers() {
        const apiImgUrl = process.env.NEXT_PUBLIC_API_IMG_URL || '';
        const fileServerDomain = process.env.NEXT_PUBLIC_IMG_SERVER_DOMAIN || '';

        // Development-only sources
        const devSources = isDev
            ? 'localhost:3000 localhost:3001 localhost:3005 localhost:3006 localhost:5000 ws://localhost:*'
            : '';
        const devHttpSources = isDev
            ? 'http://localhost:3000 http://localhost:3001 http://localhost:3005 http://localhost:3006 http://localhost:5000'
            : '';

        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            `script-src 'self' 'unsafe-inline' 'unsafe-eval' *.google.com *.googletagmanager.com cdn.jsdelivr.net *.youtube.com www.youtube.com s.ytimg.com ${devSources}`.trim(),
                            "style-src 'self' 'unsafe-inline' *.googleapis.com *.gstatic.com",
                            "img-src 'self' data: http: https: blob: *.gravatar.com *.ytimg.com *.youtube.com",
                            "font-src 'self' *.gstatic.com",
                            `connect-src 'self' ${fileServerDomain} *.${productionDomain} ${devHttpSources} *.youtube.com www.youtube.com`.trim(),
                            `media-src 'self' ${fileServerDomain} ${apiImgUrl} *.${productionDomain}`.trim(),
                            "frame-src 'self' *.google.com *.youtube.com *.youtube-nocookie.com",
                            "object-src 'none'",
                            "base-uri 'self'",
                            "form-action 'self'",
                            "frame-ancestors 'none'"
                        ].join('; ')
                    }
                ]
            }
        ];
    }
};

export default nextConfig;
