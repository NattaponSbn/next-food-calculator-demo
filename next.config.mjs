/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,

    images: {
        remotePatterns: [
        {
            protocol: 'https',
            hostname: 'cdn.dummyjson.com',
            port: '',
            pathname: '/product-images/**', // อนุญาตทุก path ที่ขึ้นต้นด้วย /product-images/
        },
        ],
    },
};

export default nextConfig;
