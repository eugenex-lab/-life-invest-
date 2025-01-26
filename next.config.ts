import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "assets.aceternity.com",
      "res.cloudinary.com",
      "images.pexels.com",
      "img.freepik.com",
      "images.unsplash.com",
    ], // Add the domain here
  },
};

export default nextConfig;
