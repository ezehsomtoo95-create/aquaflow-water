import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // This forces the app to build properly for Vercel when deploying,
  // but keeps it working perfectly inside Lovable's preview.
  nitro: process.env.VERCEL ? true : false,
  tanstackStart: {
    server: {
      entry: "server",
    },
  },
});