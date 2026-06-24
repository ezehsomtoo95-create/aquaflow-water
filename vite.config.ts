import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    // This tells Nitro to target Vercel specifically
    build: {
      rollupOptions: {
        external: [],
      },
    },
  },
});