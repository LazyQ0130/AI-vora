/* eslint-disable @typescript-eslint/no-explicit-any -- Execute the real component with small deterministic host/hook doubles, not a second Reader. */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";
import { createProgressStore, parseReadingProgress, progressKey } from "../../src/lib/learning-progress";
import { lessonProgressScope } from "../../src/lib/use-learning-progress";
import { lessonRegistry, getLearningCourse } from "../../src/lib/course-engine";
import { publicationManifest } from "../../src/content/publication-manifest";

// Node-only injected storage/geometry/clock evidence. This is NOT browser localStorage.
export function readerLifecycle(lessonId = "PY101-C03-L03", options: { denied?: boolean; data?: Map<string, string> } = {}) {
  const lesson = lessonRegistry.get(lessonId)!, scope = lessonProgressScope(lesson);
  const data = options.data ?? new Map<string, string>(), writes: any[] = [], events = new Map<string, Set<any>>();
  let now = 0, id = 0, cursor = 0, dirty = false, mounted = false, tree: any;
  const hooks: any[] = [], effects: any[] = [], pending: any[] = [], timers = new Map<number, { at: number; fn: any }>();
  let position = 0, pathname = `/learn/${lesson.courseId}/${lesson.id}`, hash = "";
  const add = (name: string, fn: any) => { if (!events.has(name)) events.set(name, new Set()); events.get(name)!.add(fn); };
  const remove = (name: string, fn: any) => events.get(name)?.delete(fn);
  const timer = (fn: any, ms = 0) => { const n = ++id; timers.set(n, { at: now + ms, fn }); return n; };
  const store = createProgressStore(() => ({
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => { if (options.denied) throw new Error("denied"); writes.push({ time: now, pathname, key, before: data.get(key) ?? null, after: value }); data.set(key, value); },
  }), () => { dirty = true; });
  const sections = lesson.sections.map((s, index) => ({
    id: s.id, parentElement: null, querySelector: (selector: string) => selector.startsWith("details") ? null : { focus() {} }, matches: () => false,
    closest: () => sections[index],
    getBoundingClientRect: () => ({ top: index < position ? -100 : index === position ? 100 : 1000, bottom: 1000, height: 500 }),
    scrollIntoView() {},
  }));
  const article = { getBoundingClientRect: () => ({ top: position ? -1500 : 600, height: 10000 }), querySelectorAll: () => sections, addEventListener: add, removeEventListener: remove };
  const document = {
    querySelector: (s: string) => s === ".reader-section-nav" ? { getBoundingClientRect: () => ({ bottom: 150 }) } : null,
    getElementById: (s: string) => sections.find(x => x.id === s) ?? null,
    addEventListener: add, removeEventListener: remove,
    documentElement: { clientWidth: 1440 }, visibilityState: "visible",
  };
  const window = {
    location: { get pathname() { return pathname; }, get hash() { return hash; }, get href() { return `http://test${pathname}${hash}`; }, origin: "http://test" },
    history: { replaceState(_a: any, _b: any, s: string) { hash = s; } },
    setTimeout: timer, clearTimeout: (n: number) => timers.delete(n),
    addEventListener: add, removeEventListener: remove, matchMedia: () => ({ matches: false }), innerWidth: 1440,
  };
  const changed = (a: any[], b: any[]) => !a || !b || a.length !== b.length || a.some((v, i) => !Object.is(v, b[i]));
  const react = {
    useState(value: any) { const i = cursor++; hooks[i] ??= { value: typeof value === "function" ? value() : value }; return [hooks[i].value, (v: any) => { const next = typeof v === "function" ? v(hooks[i].value) : v; if (!Object.is(next, hooks[i].value)) { hooks[i].value = next; dirty = true; } }]; },
    useRef(value: any) { const i = cursor++; return hooks[i] ??= { current: value }; },
    useMemo(fn: any, deps: any[]) { const i = cursor++; if (!hooks[i] || changed(hooks[i].deps, deps)) hooks[i] = { deps, value: fn() }; return hooks[i].value; },
    useCallback(fn: any, deps: any[]) { return react.useMemo(() => fn, deps); },
    useEffect(fn: any, deps: any[]) { const i = cursor++; if (!effects[i] || changed(effects[i].deps, deps)) pending.push({ i, fn, deps }); },
  };
  const nativeRequire = createRequire(import.meta.url);
  const stub = new Proxy({}, { get: (_t, key) => key === "useReducedMotion" ? () => false : key === "useToast" ? () => () => {} : () => null });
  const componentModule = { exports: {} as any };
  const source = readFileSync("src/components/lesson/reader.tsx", "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText;
  const require = (name: string) => {
    if (name === "react") return react;
    if (name === "react/jsx-runtime") return { jsx: (type: any, props: any) => ({ type, props }), jsxs: (type: any, props: any) => ({ type, props }) };
    if (name === "@/lib/use-learning-progress") return { learningProgressStore: store, lessonProgressScope, useLessonProgress: () => parseReadingProgress(store.getSnapshot(scope), scope) };
    if (name === "@/lib/reader-progress-session") return nativeRequire("../../src/lib/reader-progress-session.ts");
    if (name === "@/lib/course-numbering") return { chapterNumber: () => "3", lessonNumber: () => "3.3" };
    return stub;
  };
  vm.runInNewContext(compiled, { module: componentModule, exports: componentModule.exports, require, window, document, innerHeight: 1000, URL, HTMLDetailsElement: class {}, requestAnimationFrame: (fn: any) => timer(fn, 16), cancelAnimationFrame: (n: number) => timers.delete(n), console });
  const props = { course: getLearningCourse(lesson.courseId)!, chapter: getLearningCourse(lesson.courseId)!.chapters.find(x => x.id === lesson.chapterId)!, lesson, publication: publicationManifest.find(p => p.lessonId === lesson.id)!, adjacent: {}, progressLessons: [] };
  function render() {
    if (!mounted) return;
    let rounds = 0;
    do {
      dirty = false; cursor = 0; tree = componentModule.exports.Reader(props);
      const visit = (node: any) => { if (!node || typeof node !== "object") return; if (node.type === "article" && node.props.ref) node.props.ref.current = article; const children = node.props?.children; (Array.isArray(children) ? children : [children]).forEach(visit); };
      visit(tree);
      for (const e of pending.splice(0)) { effects[e.i]?.cleanup?.(); effects[e.i] = { deps: e.deps, cleanup: e.fn() }; }
      if (++rounds > 25) throw new Error("Unstable component harness");
    } while (dirty);
  }
  function fire(name: string, patch: any = {}) { for (const fn of [...events.get(name) ?? []]) fn({ type: name, ...patch }); render(); }
  return {
    scope, store, data, writes, key: progressKey(scope),
    seed(section = "short-circuit", percent = 74, completed = false) { store.save(scope, percent, section, completed); writes.length = 0; },
    mount(section = "reverse-result") { position = lesson.sections.findIndex(s => s.id === section); mounted = true; render(); },
    advance(ms: number) { const end = now + ms; while (true) { const next = [...timers].filter(([, t]) => t.at <= end).sort((a, b) => a[1].at - b[1].at)[0]; if (!next) break; timers.delete(next[0]); now = next[1].at; next[1].fn(); render(); } now = end; },
    scroll(section: string, user = false) { if (user) fire("wheel", { deltaY: 100 }); position = lesson.sections.findIndex(s => s.id === section); fire("scroll"); },
    route(path = "/courses/PY101") { pathname = path; },
    fire,
    complete() { const find = (node: any): any => { if (!node || typeof node !== "object") return; if (node.type === "button" && node.props.onClick) return node; const children = node.props?.children; for (const child of Array.isArray(children) ? children : [children]) { const found = find(child); if (found) return found; } }; find(tree).props.onClick(); render(); },
    anchor(section: string) { const find = (node: any): any => { if (!node || typeof node !== "object") return; if (node.type === "a" && node.props.href === `#${section}`) return node; const children = node.props?.children; for (const child of Array.isArray(children) ? children : [children]) { const found = find(child); if (found) return found; } }; const link = find(tree); if (!link) throw new Error(`No Reader anchor ${section}`); link.props.onClick({ preventDefault() {} }); render(); },
    unmount() { for (const e of effects) e?.cleanup?.(); mounted = false; },
    reactivate() { effects.length = 0; mounted = true; render(); },
    get progress() { return parseReadingProgress(store.getSnapshot(scope), scope); },
  };
}
