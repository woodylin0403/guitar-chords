/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 🌟 就是這行！沒有它就絕對生不出 out
  images: { unoptimized: true } 
};
export default nextConfig;