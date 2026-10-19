/**
 * Deleting a video project from the website: the folder goes to the Windows Recycle Bin (restorable there).
 * The project's Studio and Claude terminal are stopped first (they hold files open), and its node_modules junction is
 * removed before recycling so the shared engine packages are never touched.
 */
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/** Size and file count of a project, not following the node_modules junction or other links. */
export function projectSize(dir) {
  let bytes = 0;
  let files = 0;
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name);
      if (e.isSymbolicLink()) continue;
      if (e.isDirectory()) {
        if (full === path.join(dir, "node_modules")) continue;
        walk(full);
      } else if (e.isFile()) {
        files++;
        bytes += fs.statSync(full).size;
      }
    }
  };
  walk(dir);
  return { bytes, files };
}

export function deleteInfo(dir) {
  const manifest = JSON.parse(fs.readFileSync(path.join(dir, "project.json"), "utf8"));
  const { bytes, files } = projectSize(dir);
  const has = (rel) => fs.existsSync(path.join(dir, rel));
  return {
    title: manifest.title,
    folder: path.basename(dir),
    path: dir,
    bytes,
    files,
    hasFinalVideo: has("out/video.mp4") || has("out/delivery.mp4"),
    hasRenders: has("renders"),
  };
}

/** Move the folder to the Recycle Bin (Windows Shell via .NET). Throws with a readable message on failure. */
export function recycle(dir) {
  // the junction first: unlinking removes only the link, never the shared packages it points to
  const nm = path.join(dir, "node_modules");
  try {
    if (fs.lstatSync(nm).isSymbolicLink()) fs.unlinkSync(nm);
  } catch {
    // no node_modules
  }
  const script =
    "$ErrorActionPreference='Stop'; Add-Type -AssemblyName Microsoft.VisualBasic; " +
    "[Microsoft.VisualBasic.FileIO.FileSystem]::DeleteDirectory($env:CE_DELETE_DIR, 'OnlyErrorDialogs', 'SendToRecycleBin')";
  return new Promise((resolve, reject) => {
    execFile(
      "powershell.exe",
      ["-NoProfile", "-NonInteractive", "-Command", script],
      { env: { ...process.env, CE_DELETE_DIR: dir }, timeout: 180000, windowsHide: true },
      (err, stdout, stderr) => {
        if (fs.existsSync(dir)) {
          const why = (stderr || err?.message || "").trim().split("\n").slice(-3).join(" ");
          return reject(new Error(`Could not move ${path.basename(dir)} to the Recycle Bin${why ? `: ${why}` : ""}. A file in it may be open in another program.`));
        }
        resolve();
      },
    );
  });
}
