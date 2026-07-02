import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

const scenesDir = new URL("../src/scenes/", import.meta.url);

const readCh2Scene = async (name) => {
  const sceneDirs = await readdir(scenesDir, { withFileTypes: true });
  const ch2Dir = sceneDirs.find((entry) => entry.isDirectory() && entry.name.startsWith("02-"));
  assert.ok(ch2Dir, "Ch2 scenes directory exists");

  return readFile(new URL(`${ch2Dir.name}/${name}`, scenesDir), "utf8");
};

test("Ch2 game overlays use Ch3 lower-third style with opening white fill", async () => {
  const scenes = [
    ["Ch2Page3S07RhythmDoctorOverlay.tsx", "節奏醫生 Rhythm Doctor"],
    ["Ch2Page4S11CelesteOverlay.tsx", "蔚藍 Celeste"],
  ];

  for (const [fileName, gameName] of scenes) {
    const source = await readCh2Scene(fileName);

    assert.match(source, /const OPEN_FILL = \[6, 34\] as const;/);
    assert.match(source, /const openFill = interpolate\(frame, OPEN_FILL, \[1, 0\], clamp\);/);
    assert.match(source, /BLACK, NEUTRAL_50, WHITE, withAlpha/);
    assert.match(source, /bottom: 0,/);
    assert.match(source, /height: 72,/);
    assert.match(source, /padding: "0 64px",/);
    assert.match(source, /backgroundColor: withAlpha\(BLACK, 0\.82\),/);
    assert.match(source, /此影片僅用於教學實驗/);
    assert.match(source, new RegExp(gameName));
    assert.match(source, /backgroundColor: NEUTRAL_50, opacity: openFill/);
    assert.doesNotMatch(source, /GLOW_IN|TITLE_IN|TITLE_OUT/);
    assert.doesNotMatch(source, /radial-gradient|YELLOW|easeStandard/);
  }
});
