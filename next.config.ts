import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/perfil", destination: "/profile", permanent: false },
      { source: "/fila", destination: "/queue", permanent: false },
      { source: "/ideias", destination: "/ideas", permanent: false },
      { source: "/equipe/revelacao", destination: "/team/reveal", permanent: false },
      { source: "/equipe/:id", destination: "/team/:id", permanent: false },
    ];
  },
};

export default nextConfig;
