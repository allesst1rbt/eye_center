import react from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    laravel({
      input: ["resources/css/app.css", "resources/ts/app.tsx"],
      refresh: true,
      buildDirectory: "build", // Specify build directory
    }),
    react(),
  ],
  build: {
    manifest: {
      path: "public", // This will put manifest.json directly in public folder
    },
    outDir: "public/build",
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    hmr: {
      host: "localhost",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "resources/ts"),
      "@components": path.resolve(__dirname, "resources/ts/components"),
      "@pages": path.resolve(__dirname, "resources/ts/pages"),
      "@utils": path.resolve(__dirname, "resources/ts/utils"),
      "@hooks": path.resolve(__dirname, "resources/ts/hooks"),
      "@css": path.resolve(__dirname, "resources/css"),
      "@assets": path.resolve(__dirname, "resources/ts/assets"),
      "@schemas": path.resolve(__dirname, "resources/ts/schemas"),
    },
  },
});
