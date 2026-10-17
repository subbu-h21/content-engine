/** Render one frame of a project as a small JPEG (for Claude to look at). One render at a time per project. */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const queues = new Map();

export function renderFrame(dir, frame, { scale = 0.5 } = {}) {
  const prev = queues.get(dir) ?? Promise.resolve();
  const job = prev.catch(() => undefined).then(() => run(dir, frame, scale));
  queues.set(dir, job);
  return job;
}

function run(dir, frame, scale) {
  const outDir = path.join(dir, "_tmp", "frames");
  fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, `f_${frame}.jpg`);
  const cli = path.join(dir, "node_modules", "@remotion", "cli", "remotion-cli.js");
  const args = [cli, "still", "src/index.ts", "Reel", out, `--frame=${frame}`, `--scale=${scale}`, "--image-format=jpeg", "--jpeg-quality=82", "--log=error"];
  return new Promise((resolve, reject) => {
    const p = spawn(process.execPath, args, { cwd: dir, windowsHide: true });
    let err = "";
    p.stderr.on("data", (d) => (err += d));
    p.stdout.on("data", (d) => (err += d));
    p.on("exit", (code) => {
      if (code === 0 && fs.existsSync(out)) {
        const data = fs.readFileSync(out);
        fs.rmSync(out, { force: true });
        resolve(data);
      } else reject(new Error(`frame render failed (${code}): ${err.slice(-600)}`));
    });
  });
}
