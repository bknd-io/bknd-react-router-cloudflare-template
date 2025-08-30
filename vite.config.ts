import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { cloudflare } from "@cloudflare/vite-plugin";
import { devFsVitePlugin } from "bknd/adapter/cloudflare";

export default defineConfig({
   plugins: [
      devFsVitePlugin({ configFile: "config.ts" }),
      cloudflare({ viteEnvironment: { name: "ssr" } }),
      tailwindcss(),
      reactRouter(),
      tsconfigPaths(),
   ],
});
