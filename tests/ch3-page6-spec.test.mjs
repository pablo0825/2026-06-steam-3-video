import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page6Path = new URL(
  "../src/scenes/03-程式實作/Ch3Page6Spec.tsx",
  import.meta.url,
);
const workflowPath = new URL(
  "../src/scenes/03-程式實作/Ch3Page6SpecWorkflow.tsx",
  import.meta.url,
);

test("S14 is split into definition and workflow while preserving its duration", async () => {
  const page6 = await readFile(page6Path, "utf8");
  const workflow = await readFile(workflowPath, "utf8");

  assert.match(page6, /Ch3Page6SpecWorkflow/);
  assert.match(page6, /durationInFrames=\{150\}/);
  assert.match(page6, /from=\{150\}\s+durationInFrames=\{660\}/);
  assert.match(page6, /from=\{810\}\s+durationInFrames=\{1020\}/);
  assert.match(workflow, /feature-spec\.md|SpecDocumentCard/);
  assert.match(workflow, /維護與擴充有依據/);
  assert.match(workflow, /減少重複掃描與 Token 消耗/);
});

test("S14 cards rise in sequentially, collect quickly, and use the shared card surface", async () => {
  const workflow = await readFile(workflowPath, "utf8");

  assert.match(workflow, /const CARD_ENTER_STAGGER = 18/);
  assert.match(workflow, /const CARD_ENTER_DURATION = 30/);
  assert.match(workflow, /const collect = interpolate\(frame, \[112, 212\]/);
  assert.match(workflow, /translate\(-50%, calc\(-50% \+ \$\{rise\}px\)\)/);
  assert.match(workflow, /backgroundColor: WHITE/);
});

test("Page 6 keeps an opaque white background across scene transitions", async () => {
  const page6 = await readFile(page6Path, "utf8");

  assert.match(page6, /import \{ WHITE \} from "\.\.\/\.\.\/theme\/colors"/);
  assert.match(page6, /<AbsoluteFill style=\{\{ backgroundColor: WHITE \}\}>/);
});
