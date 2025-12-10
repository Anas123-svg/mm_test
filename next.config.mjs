/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  
  // Performance optimizations
  swcMinify: true, // Use SWC for faster minification
  compress: true, // Enable gzip compression
  
  // Optimize images
  images: {
    minimumCacheTTL: 2678400 * 6, // 3 months
    formats: ['image/avif', 'image/webp'], // Modern formats
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'a0.muscache.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.gstatic.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Optimize bundle splitting
  webpack: (config, { isServer }) => {
    // Code splitting optimizations
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Separate vendor libraries
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              reuseExistingChunk: true,
            },
            // Separate React libraries
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react-vendors',
              priority: 20,
              reuseExistingChunk: true,
            },
            // Separate Google Maps
            maps: {
              test: /[\\/]node_modules[\\/](@react-google-maps|@vis\.gl)[\\/]/,
              name: 'maps-vendors',
              priority: 15,
              reuseExistingChunk: true,
            },
            // Separate UI libraries
            ui: {
              test: /[\\/]node_modules[\\/](@headlessui|embla-carousel|framer-motion|rc-slider)[\\/]/,
              name: 'ui-vendors',
              priority: 12,
              reuseExistingChunk: true,
            },
            // Common chunks
            common: {
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
              name: 'common',
            },
          },
        },
      }
    }
    return config
  },

  // Production optimizations
  productionBrowserSourceMaps: false, // Disable source maps in production for smaller bundle
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lodash', 'date-fns'], // Tree-shake unused imports
  },
}

export default nextConfig
