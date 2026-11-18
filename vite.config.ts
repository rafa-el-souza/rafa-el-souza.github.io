/// <reference types="vitest/config" />
import { readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, type Plugin } from "vite";

import { robots, sitemap } from "./src/pages/files.ts";
import { PAGES } from "./src/pages/pages.ts";

const ROOT = fileURLToPath(new URL(".", import.meta.url));

/** The path a request names, or nothing if it cannot be read. */
function requestPath(url: string | undefined): string | undefined {
  try {
    return decodeURIComponent(new URL(url ?? "/", "http://localhost").pathname);
  } catch {
    return undefined;
  }
}

function isFile(path: string): boolean {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

/**
 * The pages, made from templates (docs/design.md §6.2). Each is an HTML
 * entry of the build that exists only as the string its template returns,
 * and Vite treats it as it treats any HTML file: its stylesheet is bundled
 * and hashed, and the link to it is written relative to the page. The
 * sitemap and robots.txt come from the same constants. The development
 * server answers the same paths from the templates (the pages' policy keeps
 * out the script Vite adds there, so nothing reloads by itself); the
 * preview server answers an unknown path as GitHub Pages does, with
 * 404.html and the status 404.
 */
function pages(): Plugin {
  const entries = new Map(
    Object.entries(PAGES).map(([file, render]) => [
      resolve(ROOT, file),
      render,
    ]),
  );
  return {
    name: "landing:pages",
    enforce: "pre",
    config: () => ({
      build: { rolldownOptions: { input: [...entries.keys()] } },
    }),
    resolveId: (id) => (entries.has(id) ? id : null),
    load: (id) => entries.get(id)?.() ?? null,
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: sitemap(),
      });
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: robots(),
      });
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const path = requestPath(request.url);
        const file = path?.endsWith("/") ? `${path}index.html` : path;
        const render = file === undefined ? undefined : PAGES[file.slice(1)];
        if (path === undefined || render === undefined) {
          next();
          return;
        }
        server.transformIndexHtml(path, render()).then((html) => {
          response.setHeader("Content-Type", "text/html; charset=utf-8");
          response.end(html);
        }, next);
      });
    },
    configurePreviewServer(server) {
      const dist = resolve(server.config.root, server.config.build.outDir);
      // after the static files and the pages, so that only what they did not answer gets here
      return () => {
        server.middlewares.use((request, response, next) => {
          const path = requestPath(request.url);
          if (path !== undefined && isFile(join(dist, path))) {
            next();
            return;
          }
          response.statusCode = 404;
          response.setHeader("Content-Type", "text/html; charset=utf-8");
          response.end(readFileSync(join(dist, "404.html")));
        });
      };
    },
  };
}

export default defineConfig({
  base: "./",
  // every page is a file of its own; an unknown path is not answered with the root
  appType: "mpa",
  plugins: [pages()],
  experimental: {
    // GitHub Pages serves 404.html at any unknown path, however deep, so the
    // links from it to the build's assets start from the root
    renderBuiltUrl: (filename, { hostId, hostType }) =>
      hostType === "html" && hostId === "404.html" ? `/${filename}` : undefined,
  },
  server: { host: "127.0.0.1", port: 5173, strictPort: true },
  preview: { host: "127.0.0.1", port: 4173, strictPort: true },
  test: {
    include: ["src/**/*.test.ts", "test/**/*.test.ts"],
    environment: "node",
    // the tests in test/ read a build of the site, made once for the run
    globalSetup: ["test/global-setup.ts"],
  },
});
