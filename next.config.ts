/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
      removeConsole: process.env.NODE_ENV === 'production',
    },

    async rewrites() {
      return [
        {
          source: '/__/auth/:path*',
          destination: 'https://dev-coffeeconnect-v1.firebaseapp.com/__/auth/:path*',
        },
      ]
    },
  };
  
  export default nextConfig;