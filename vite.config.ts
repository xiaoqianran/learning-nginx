import type { Plugin } from "vite";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
// @ts-expect-error JS plugin alongside the TS vite config
import { grokPwaPlugin } from "./scripts/grok-pwa-plugin.mjs";
import { LESSON_SLUGS } from "./src/generated/lesson-manifest";

const isGitHubPages =
  process.env.GITHUB_PAGES === "true" ||
  process.env.NITRO_PRESET === "github_pages";

/** Project Pages site: https://xiaoqianran.github.io/learning-nginx/ */
const base = isGitHubPages ? "/learning-nginx/" : "/";

const lessonPaths = LESSON_SLUGS.map((slug) => ({ path: `/lesson/${slug}` }));

const staticPages = [
  { path: "/" },
  { path: "/hub" },
  { path: "/lab" },
  { path: "/mistakes" },
  { path: "/certificate" },
  { path: "/playground" },
  { path: "/studio" },
  { path: "/cheatsheet" },
  { path: "/docs" },
  ...lessonPaths,
];

function pgliteBootstrapPlugin(): Plugin {
  return {
    name: "app-builder:pglite-bootstrap",
    apply: "serve",
    async configureServer(server) {
      try {
        const mod = (await server.ssrLoadModule("/src/lib/db.ts")) as {
          ensureDbReady?: () => Promise<void>;
        };
        if (typeof mod.ensureDbReady === "function") {
          await mod.ensureDbReady();
        }
      } catch (err) {
        console.error("[app-builder] DB bootstrap failed:", err);
        throw err;
      }
    },
  };
}

export default defineConfig(({ command }) => ({
  base,
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: true,
  },
  resolve: { tsconfigPaths: true },
  plugins: [
    pgliteBootstrapPlugin(),
    grokPwaPlugin(),
    tailwindcss(),
    tanstackStart(
      isGitHubPages
        ? {
            spa: { enabled: true },
            prerender: {
              enabled: true,
              crawlLinks: true,
              autoStaticPathsDiscovery: true,
              failOnError: false,
            },
            pages: staticPages,
          }
        : undefined,
    ),
    ...(command === "build" && !isGitHubPages
      ? [
          nitro({
            preset: "vercel",
            serverDir: "./server",
          }),
        ]
      : []),
    viteReact(),
  ],
}));
