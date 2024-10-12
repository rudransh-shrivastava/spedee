/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // ["localhost", "lh3.googleusercontent.com"
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "3000" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      {
        protocol: "https",
        hostname: "spedee-product-images.s3.ap-south-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
