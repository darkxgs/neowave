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
  // In Next.js 15.x, the default output is 'export'
  // For server components, we need 'standalone'
  output: 'standalone',
  // Disable experimental features that might be causing issues
  experimental: {
    // These are known to cause issues with the standalone output
    webpackBuildWorker: false,
    parallelServerBuildTraces: false,
    parallelServerCompiles: false,
  },
  // Only use specific file extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Increase timeouts for build process
  staticPageGenerationTimeout: 120,
  // Other standard options
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: false,
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
