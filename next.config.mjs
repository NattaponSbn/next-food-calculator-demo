// ใช้ import แทน require และต้องมี assert { type: 'json' }
import packageInfo from './package.json' with { type: 'json' };
/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,

     env: {
        // ตั้งชื่อตัวแปรว่าอะไรก็ได้ แต่ต้องขึ้นต้นด้วย NEXT_PUBLIC_
        // เพื่อให้ Next.js ส่งค่านี้ไปให้ฝั่ง Client (Browser) ใช้งานได้
        NEXT_PUBLIC_APP_VERSION: packageInfo.version,
    },
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
