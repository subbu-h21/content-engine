// Build the website into dist/ (esbuild: one JS bundle + one CSS file).   npm run build
// `node build.mjs <folder>` builds into another folder instead (tests: a running engine keeps serving dist/).
import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";

const out = process.argv[2] || "dist";
fs.rmSync(out, { recursive: true, force: true });
await build({
  entryPoints: { main: "web/src/main.tsx" },
  bundle: true,
  outdir: out,
  minify: true,
  sourcemap: true,
  target: "es2022",
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "warning",
});
fs.copyFileSync("web/index.html", path.join(out, "index.html"));
console.log(`built ${out}/`);
