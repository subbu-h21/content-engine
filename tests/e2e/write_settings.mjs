import fs from "node:fs";
fs.writeFileSync(
  "D:/tmp/ce-x/settings.json",
  JSON.stringify({ workspace: "D:\\tmp\\ce-x", python: "python", blender: "C:\\Program Files\\Blender Foundation\\Blender 5.1\\blender.exe" }, null, 2) + "\n",
);
console.log(fs.readFileSync("D:/tmp/ce-x/settings.json", "utf8"));
