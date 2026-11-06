/**
 * One job at a time across processes: the website's button and Claude's own `ce review .` run in different processes and
 * share their working folders. A lock left by a process that's gone (a crash, a restart) doesn't count.
 */
import fs from "node:fs";

const alive = (pid) => {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return e.code === "EPERM";
  }
};

/** Whether a live process holds this lock. */
export function isLocked(file) {
  const pid = Number.parseInt(fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "", 10);
  return Number.isInteger(pid) && pid !== process.pid && alive(pid);
}

/** Write a file a page may be reading: it sees the old one or the new one, never half of it. */
export function writeWhole(file, text) {
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, text);
  try {
    fs.renameSync(tmp, file);
  } catch {
    // antivirus or a reader holding the file: losing a finished report would be worse than a brief half-written read
    fs.writeFileSync(file, text);
    fs.rmSync(tmp, { force: true });
  }
}

/** Run fn holding the lock, or throw `busy` if another process has it. */
export function withLock(file, busy, fn) {
  if (isLocked(file)) throw new Error(busy);
  fs.writeFileSync(file, String(process.pid));
  try {
    return fn();
  } finally {
    fs.rmSync(file, { force: true });
  }
}
