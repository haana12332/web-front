import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4500,
    host: "0.0.0.0", // すべてのIPからアクセスを許可
  },
});
