/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pocketbase-production-2a51.up.railway.app',
                port: '',
                pathname: '/api/**',
            },
        ],
    },
}

module.exports = nextConfig
