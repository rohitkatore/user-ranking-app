import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['axios']
        }
      }
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Only for local development
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});
