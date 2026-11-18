import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type { TestProject } from "vitest/node";

declare module "vitest" {
  export interface ProvidedContext {
    /** The directory of the build the tests read. */
    readonly site: string;
  }
}

/**
 * Builds the site once, as `npm run build` does but into a directory of its
 * own, for the tests that read the build (the tags, the policy, the weight).
 * The build runs in a process of its own, outside Vitest's environment.
 */
export default function setup(project: TestProject): () => void {
  const site = mkdtempSync(join(tmpdir(), "landing-build-"));
  const env = { ...process.env };
  delete env.NODE_ENV;
  delete env.VITEST;
  execFileSync(
    process.execPath,
    [
      "node_modules/vite/bin/vite.js",
      "build",
      "--outDir",
      site,
      "--emptyOutDir",
      "--logLevel",
      "warn",
    ],
    { env, stdio: "inherit" },
  );
  project.provide("site", site);
  return () => {
    rmSync(site, { recursive: true, force: true });
  };
}
