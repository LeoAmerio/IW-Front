/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    distDir: 'dist',
    images: {
      unoptimized: true,
    },
    experimental: {
      disablePostCssPresetEnv: true,
    },
    typescript: {
      ignoreBuildErrors: true,  // Ignora los errores de compilación relacionados con TypeScript
    },
  };
  
  export default nextConfig;