import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  base: "/admin/",
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // server: {
  //   allowedHosts: ["localhost", "7997-2a09-bac5-3800-1f19-00-319-113.ngrok-free.app"]
  // },
})
