import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // GitHub Pages project site: https://terry-xu-2077.github.io/Terry_React_UI_Library/
  base: "/Terry_React_UI_Library/",
  plugins: [react()],
  server: { port: 5173 },
  build: { target: "es2022" }
});
