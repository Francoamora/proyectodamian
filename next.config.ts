const nextConfig = {
  images: {
    unoptimized: true, 
    remotePatterns: [
      { protocol: 'https', hostname: 'francom.pythonanywhere.com', pathname: '/media/**' },
    ],
  },
};
export default nextConfig;