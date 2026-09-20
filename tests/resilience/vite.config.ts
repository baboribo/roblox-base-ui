import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
export default defineConfig({
  root: path.resolve(import.meta.dirname, "fixture"),
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5198,
    strictPort: true,
    fs: { allow: [path.resolve(import.meta.dirname, "../..")] },
  },
});
