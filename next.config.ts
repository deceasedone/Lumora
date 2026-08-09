import path from "path"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  webpack(config) {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@splinetool/react-spline": path.resolve(
        process.cwd(),
        "node_modules",
        "@splinetool",
        "react-spline",
        "dist",
        "react-spline.js"
      ),
    }
    return config
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // In development, this proxies requests to your backend server
      // to avoid CORS issues. In production, your hosting environment
      // (like Vercel or Netlify) should handle this.
      destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
}

export default nextConfig
