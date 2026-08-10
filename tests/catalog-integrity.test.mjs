import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageUrl = new URL("../app/page.tsx", import.meta.url);
const cssUrl = new URL("../app/overrides.css", import.meta.url);

test("all series use curated subgenres", async () => {
  const page = await readFile(pageUrl, "utf8");
  const genreBlock = page.slice(
    page.indexOf("const genreByOriginal"),
    page.indexOf("const moreTitles"),
  );
  const catalogEntries = [...genreBlock.matchAll(/"([^"]+)":"[^"]+"/g)];
  const imageBlock = page.slice(
    page.indexOf("const imageSearchNames"),
    page.indexOf("const imageQueryByTitle"),
  );
  const firstFifty = [...imageBlock.matchAll(/"([^"]+)"/g)].map(match=>match[1]);
  const extraBlock = page.slice(
    page.indexOf("const extraShowSeeds"),
    page.indexOf("const extraShows"),
  );
  const finalFifty = [...extraBlock.matchAll(/\["[^"]+","([^"]+)"/g)].map(match=>match[1]);
  const catalogTitles = new Set(catalogEntries.map(match=>match[1]));

  assert.equal(catalogEntries.length, 100);
  assert.deepEqual([...new Set([...firstFifty,...finalFifty])].filter(title=>!catalogTitles.has(title)), []);
  assert.match(genreBlock, /"Narcos":"犯罪／傳記"/);
  assert.doesNotMatch(page, /genre:\["劇情","犯罪","喜劇"/);
  assert.match(page, /genre:genreByOriginal\[x\[1\]\]/);
});

test("detail highlights come from each series profile", async () => {
  const page = await readFile(pageUrl, "utf8");
  const profileBlock = page.slice(
    page.indexOf("const strengthOverrides"),
    page.indexOf("const topCriteriaFor"),
  );
  const profiles = [...profileBlock.matchAll(/"([^"]+)":\[(\d),(\d),(\d)\]/g)];

  assert.equal(profiles.length, 100);
  assert.equal(new Set(profiles.map(match=>match[1])).size, 100);
  assert.match(page, /topCriteriaFor\(active\)\.map/);
  assert.doesNotMatch(page, /criteria\.slice\(0,3\)/);
  assert.doesNotMatch(page, /criterionProfiles|\?\?\[1,4,6\]/);
  assert.match(page, /Missing score profile/);
  assert.match(page, /"The Wire":\[0,1,7\]/);
  assert.match(page, /"Breaking Bad":\[1,2,4\]/);
  assert.match(page, /"Narcos":\[4,5,7\]/);
});

test("award totals remain data-only while major awards appear", async () => {
  const [page, css] = await Promise.all([
    readFile(pageUrl, "utf8"),
    readFile(cssUrl, "utf8"),
  ]);
  assert.match(page, /重大獎項/);
  assert.doesNotMatch(page, /獎項紀錄|獲獎／入圍|awardTallies/);
  assert.match(page, /award\.result!=="nominated"/);
  assert.doesNotMatch(css, /outside-voice>article:nth-of-type\(3\)/);
});
