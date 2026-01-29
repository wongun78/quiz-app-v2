import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "https://storage.googleapis.com/gen-lang-client-0115774747-frontend/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setup.ts",
    css: true,
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router")
            ) {
              return "react-vendor";
            }
            if (id.includes("@tanstack/react-query")) {
              return "query-vendor";
            }
            if (id.includes("react-hook-form") || id.includes("zod")) {
              return "form-vendor";
            }
            if (
              id.includes("lucide-react") ||
              id.includes("class-variance-authority") ||
              id.includes("clsx") ||
              id.includes("tailwind-merge")
            ) {
              return "ui-vendor";
            }
            return "vendor";
          }
        },
      },
    },
    target: "esnext",
    sourcemap: false,
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
    ],
  },
});
