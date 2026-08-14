import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const data = await readFile(new URL("../app/data/shows.ts", import.meta.url), "utf8");
const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const posters = await readFile(new URL("../app/data/posters.ts", import.meta.url), "utf8").catch(() => "");
const showBlock = data.slice(data.indexOf("export const shows"), data.indexOf("export const tiers"));
const showIds = [...showBlock.matchAll(/id:"([^"]+)"/g)].map((match) => match[1]);

test("every reviewed work has a stable poster URL", () => {
  for (const id of showIds) {
    assert.match(posters, new RegExp(`"${id}":\\s*"(?:https://|/posters/)`), `missing poster: ${id}`);
  }
});

test("the browser never searches the poster service at runtime", () => {
  assert.doesNotMatch(page, /api\.tvmaze\.com/);
  assert.doesNotMatch(page, /Promise\.all\(shows\.map/);
});
