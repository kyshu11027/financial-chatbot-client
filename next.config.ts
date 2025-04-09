/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Enable logging in development
  logging: {
    level: "debug",
  },
  // Configure headers for Supabase authentication
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-Requested-With, Content-Type, Authorization",
          },
        ],
      },
    ];
  },

  // Configure redirects for authentication
  async redirects() {
    return [
      {
        source: "/login",
        has: [
          {
            type: "cookie",
            key: "sb-access-token",
          },
        ],
        destination: "/",
        permanent: false,
      },
      {
        source: "/signup",
        has: [
          {
            type: "cookie",
            key: "sb-access-token",
          },
        ],
        destination: "/",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
