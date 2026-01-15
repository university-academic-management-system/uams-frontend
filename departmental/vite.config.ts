import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/departmental-admin/",
  server: {
    allowedHosts: ['computerscience.uniport.edu.ng', 'localhost'],
    port: 3000,
    host: "0.0.0.0",
    strictPort: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
