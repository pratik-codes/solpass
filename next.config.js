/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "seo-heist.s3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "github.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ansubkhan.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media1.tenor.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.dribbble.com",
        port: "",
        pathname: "/**",
      },
      {
        hostname: "img.icons8.com",
        protocol: "https",
        port: "",
        pathname: "/**",
      },
      {
        hostname: "logo.clearbit.com",
        protocol: "https",
        port: "",
        pathname: "/**",
      },
      {
        hostname: "img.freepik.com",
        protocol: "https",
        port: "",
        pathname: "/**",
      },
 
    ],
  },
};
module.exports = nextConfig;
