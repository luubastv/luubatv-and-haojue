import type { NextConfig } from "next";

const repo = "luubatv-and-haojue";
const isPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: isPages ? `/${repo}` : "",
  assetPrefix: isPages ? `/${repo}/` : "",
  trailingSlash: true,
};

export default nextConfig;
