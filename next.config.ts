import { withWorkflow } from "workflow/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default withWorkflow(nextConfig, {
  workflows: {
    // Scan only the workflows directory for better build performance
    dirs: ['workflows', 'app/api'],
  },
});
