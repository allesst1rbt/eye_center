import react from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  plugins: [
    laravel({
      input: ["resources/css/app.css", "resources/ts/app.tsx"],
      refresh: true,
    }),
    react(),
  ],
  server: {
    host: "0.0.0.0",
    historyApiFallback: true,
    hmr: {
      host: "localhost",
    },
    watch: {
      usePolling: true,
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
