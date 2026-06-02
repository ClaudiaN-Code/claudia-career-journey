import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  generateBuildId: async () => `build-${Date.now()}`,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      {
        source: "/resume.pdf",
        headers: [
          { key: "Content-Disposition", value: 'attachment; filename="Claudia_A._Nasraty_Resume.pdf"' },
        ],
      },
    ];
  },
};

export default nextConfig;
