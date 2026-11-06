import type { ProgressScope } from "./learning-progress";

type Point = { percent: number; section: string };
type Save = (scope: ProgressScope, percent: number, section: string, completed?: boolean) => boolean;
type Clock = { later: (callback: () => void, ms: number) => number; cancel: (id: number) => void };

// UI geometry is observable during mounting/routing too. Only reading input or an
// explicit anchor may nominate a bookmark; cleanup never samples the departing DOM.
export function createReaderProgressSession(scope: ProgressScope, save: Save, clock: Clock) {
  let live = true, reading = false, dirty = false, point: Point | null = null, timer: number | undefined;
  const cancel = () => { if (timer !== undefined) clock.cancel(timer); timer = undefined; };
  function flush(completed = false) {
    cancel(); reading = false;
    if (!live || !point || !dirty) return true;
    dirty = false;
    return save(scope, point.percent, point.section, completed);
  }
  function accept(next: Point) {
    if (!live || !scope.sectionIds.includes(next.section) || !Number.isFinite(next.percent)) return;
    point = { ...next }; dirty = true; cancel(); timer = clock.later(() => flush(), 450);
  }
  return {
    activate() { if (!live) { live = true; reading = false; dirty = false; point = null; } },
    arm() { if (live) { reading = true; cancel(); timer = clock.later(() => flush(), 450); } },
    observe(next: Point) { if (reading) accept(next); },
    anchor(next: Point) { reading = false; accept(next); },
    complete(next: Point) { reading = false; accept({ ...next, percent: 100 }); return flush(true); },
    flush,
    dispose() { flush(); live = false; },
  };
}
