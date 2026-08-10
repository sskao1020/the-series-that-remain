import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const data = await readFile(new URL("../app/data/shows.ts", import.meta.url), "utf8");
const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const showBlock = data.slice(data.indexOf("export const shows"), data.indexOf("export const tiers"));

test("expanded preview contains forty-two reviewed works", () => {
  assert.equal([...showBlock.matchAll(/reviewedAt:"2026-08-10"/g)].length, 42);
  assert.equal([...showBlock.matchAll(/id:"[^"]+"/g)].length, 42);
});

test("every reviewed work carries editorial and recommendation fields", () => {
  for (const field of ["strengths", "reason", "barrier", "audience", "critics", "taste", "feelings", "tone", "sources"]) {
    assert.equal([...showBlock.matchAll(new RegExp(`${field}:`, "g"))].length, 42, field);
  }
});

test("new interface rejects legacy scoring language", () => {
  assert.doesNotMatch(page, /active\.score|personalScore|className="[^"]*score|作品評分<\/|契合度<\//);
  assert.match(page, /時間之選/);
  assert.match(page, /先知道這些，再決定要不要看/);
  assert.match(page, /這些資料從哪裡來/);
  assert.match(page, /EDITORIAL BETA/);
});

test("catalog uses a small controlled category set", () => {
  assert.match(data, /\["犯罪", "劇情", "喜劇", "歷史", "政治", "科幻", "動畫", "運動"\]/);
  assert.match(page, /categories\.map\(category/);
  assert.doesNotMatch(page, /tonightFeelings/);
});
