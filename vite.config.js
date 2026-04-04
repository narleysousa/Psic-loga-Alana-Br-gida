import { defineConfig } from "vite";

// Caminhos relativos: funcionam no GitHub Pages (projeto ou usuário) e em preview local
export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
