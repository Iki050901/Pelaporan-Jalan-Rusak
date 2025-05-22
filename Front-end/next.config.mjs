/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'example.com',
                pathname: '/public/**',
            },
        ],
    },
};

export default nextConfig;
