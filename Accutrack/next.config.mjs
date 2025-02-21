/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      forceSwcTransforms: true, // Force SWC for Next.js even with Babel present
    },
  };
  
  export default nextConfig;
  