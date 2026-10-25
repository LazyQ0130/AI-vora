import test from "node:test";
import assert from "node:assert/strict";
import { mergeProgress, parseProgress } from "../src/lib/progress";
import {
  getLocalProgressSnapshot,
  saveLocalProgress,
} from "../src/lib/use-progress";
test("存储写入被拒绝时，即使旧记录可读也使用本次会话的新状态", () => {
  const old = JSON.stringify(mergeProgress(null, 20, "loss", false, 123));
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: new EventTarget(),
  });
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: () => old,
      setItem: () => {
        throw new Error("QuotaExceeded");
      },
    },
  });
  assert.equal(parseProgress(getLocalProgressSnapshot())?.percent, 20);
  assert.equal(saveLocalProgress(100, "summary", true), false);
  assert.equal(parseProgress(getLocalProgressSnapshot())?.percent, 100);
  assert.equal(parseProgress(getLocalProgressSnapshot())?.completed, true);
});
