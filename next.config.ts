import type { NextConfig } from "next"

const nextConfig: NextConfig = {
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
