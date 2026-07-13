import { access, readdir, readFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ignoredDirectories = new Set([".git", "node_modules", "dist", "build"]);

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (ignoredDirectories.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await markdownFiles(path)));
    if (entry.isFile() && extname(entry.name).toLowerCase() === ".md") files.push(path);
  }

  return files;
}

const failures = [];
for (const file of await markdownFiles(root)) {
  const source = await readFile(file, "utf8");
  const links = source.matchAll(/!?(?:\[[^\]]*\])\(([^)]+)\)/g);

  for (const match of links) {
    const target = match[1].trim().replace(/^<|>$/g, "");
    if (!target || target.startsWith("#") || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue;

    const [pathPart] = target.split("#", 1);
    const localPath = resolve(dirname(file), decodeURIComponent(pathPart));
    try {
      await access(localPath);
    } catch {
      failures.push(`${file.slice(root.length + 1)} -> ${target}`);
    }
  }
}

if (failures.length > 0) {
  console.error("Broken local documentation links:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("Documentation links are valid.");
}
