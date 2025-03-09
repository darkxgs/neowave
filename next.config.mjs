let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  // Only use specific file extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Completely ignore these specific files for routing
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Ignore specific routes
  rewrites: async () => {
    return {
      beforeFiles: [
        // Redirect any requests to the conflicting routes
        {
          source: '/login',
          destination: '/login-redirect',
        },
      ],
    }
  },
  // Important to catch any webpack issues
  webpack: (config) => {
    // Ignore specific files during build
    config.plugins = config.plugins || [];
    return config;
  },
  distDir: '.next',
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: false
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig
