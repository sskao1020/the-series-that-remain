import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../app/data/posters.ts", import.meta.url), "utf8");
const posters = [...source.matchAll(/"([^"]+)":\s*"(https:[^"]+|\/posters\/[^"]+)"/g)].map((match) => ({ id: match[1], url: match[2] }));
const remote = posters.filter(({ url }) => url.startsWith("https://"));
const failures = [];

for (let index = 0; index < remote.length; index += 8) {
  await Promise.all(remote.slice(index, index + 8).map(async ({ id, url }) => {
    try {
      const response = await fetch(url, { method: "HEAD" });
      if (!response.ok) failures.push(`${id}: HTTP ${response.status}`);
    } catch (error) {
      failures.push(`${id}: ${error instanceof Error ? error.message : "request failed"}`);
    }
  }));
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`verified ${remote.length} remote posters and ${posters.length - remote.length} local editorial cover`);
