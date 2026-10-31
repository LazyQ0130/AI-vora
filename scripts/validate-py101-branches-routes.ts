import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { publicationManifest } from "../src/content/publication-manifest";
import { isReadable } from "../src/content/models";
import { evidencePath } from "./evidence-path";
const base = process.env.AIVORA_BASE_URL ?? "http://127.0.0.1:3007";
const p = publicationManifest.find(p => p.lessonId === "PY101-C03-L02")!;
const cases: [string, number][] = [
  ["/learn/PY101/PY101-C03-L02", isReadable(p) ? 200 : 404],
  ["/learn/PY101/PY101-C03-L01", 200],
  ...Array.from({ length: 6 }, (_, i): [string, number] => [`/learn/PY101/PY101-C03-L0${i + 3}`, 404]),
  ["/learn/ML201/PY101-C03-L02", 404], ["/learn/AI000/PY101-C03-L02", 404],
];
const rows = await Promise.all(cases.map(async ([path, expected]) => {
  const response = await fetch(new URL(path, base)), html = await response.text(); assert.equal(response.status, expected, path);
  if (expected === 404) assert.ok(html.includes("这里，还没有被探索"));
  return { path, expected, actual: response.status, passed: true };
}));
writeFileSync(evidencePath(isReadable(p) ? "PREVIEW_HTTP_GATE.json" : "DRAFT_HTTP_GATE.json"), JSON.stringify({ checkedAt: new Date().toISOString(), publication: p, productionServer: "next start", rows }, null, 2) + "\n");
console.log(`${rows.length}/${rows.length} P17 production gates passed (${p.status}/${p.access}).`);
