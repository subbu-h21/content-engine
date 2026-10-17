// Contact sheet of the whole video from the current code: one frame every 1.5 s, four rows.  npm run stills
import { execSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
const project = JSON.parse(readFileSync("project.json", "utf8"));
const timing = JSON.parse(readFileSync("src/data/timing.json", "utf8"));
const FPS = project.format.fps, STEP = Math.round(FPS * 1.5), TOTAL = Math.round(timing.total * FPS);
mkdirSync("out/_stills", { recursive: true });
let n = 0;
for (let f = 0; f < TOTAL; f += STEP, n++) {
  execSync(`npx remotion still src/index.ts Reel out/_stills/f_${String(n).padStart(5, "0")}.png --frame=${f} --scale=0.25 --log=error`, { stdio: "inherit" });
}
const cols = Math.ceil(n / 4);
execSync(`ffmpeg -y -loglevel error -framerate 1 -i out/_stills/f_%05d.png -vf "tile=${cols}x4" -frames:v 1 out/contact_sheet.png`, { stdio: "inherit" });
console.log("out/contact_sheet.png");
