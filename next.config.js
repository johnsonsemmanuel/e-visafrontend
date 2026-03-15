/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  // Ensure proper trailing slash handling
  trailingSlash: true,
  
  // Base path if deploying to subdirectory
  // basePath: '/your-app-name',
  
  // Asset prefix if deploying to subdirectory  
  // assetPrefix: '/your-app-name',
  
  // Turbopack config for Next.js 16
  turbopack: {},
  
  // Webpack configuration for better compatibility
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        util: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
