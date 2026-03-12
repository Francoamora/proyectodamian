/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'francom.pythonanywhere.com', pathname: '/media/**' },
    ],
  },
};
export default nextConfig;