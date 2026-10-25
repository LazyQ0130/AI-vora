import { parseProgress, PROGRESS_KEY, LESSON_ID } from "./progress";

export type ProgressScope = {
  courseId: string;
  lessonId: string;
  contentVersion: number;
  sectionIds: readonly string[];
};
export type ReadingProgress = {
  version: 2;
  courseId: string;
  lessonId: string;
  contentVersion: number;
  percent: number;
  completed: boolean;
  section: string;
  updatedAt: number;
};
export const progressKey = (scope: ProgressScope) =>
  `aivora:learning:v2:${scope.courseId}:${scope.lessonId}:r${scope.contentVersion}`;
export function parseReadingProgress(
  raw: string | null,
  scope: ProgressScope,
): ReadingProgress | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    const v = value as Record<string, unknown>;
    if (
      v.version !== 2 ||
      v.courseId !== scope.courseId ||
      v.lessonId !== scope.lessonId ||
      v.contentVersion !== scope.contentVersion ||
      typeof v.percent !== "number" ||
      !Number.isFinite(v.percent) ||
      typeof v.completed !== "boolean" ||
      typeof v.section !== "string" ||
      !scope.sectionIds.includes(v.section) ||
      typeof v.updatedAt !== "number" ||
      !Number.isSafeInteger(v.updatedAt) ||
      v.updatedAt <= 0 ||
      v.updatedAt > 8640000000000000
    )
      return null;
    return {
      version: 2,
      courseId: scope.courseId,
      lessonId: scope.lessonId,
      contentVersion: scope.contentVersion,
      percent: v.completed
        ? 100
        : Math.max(0, Math.min(100, Math.round(v.percent))),
      completed: v.completed,
      section: v.section,
      updatedAt: v.updatedAt,
    };
  } catch {
    return null;
  }
}
export function migrateLegacyProgress(
  raw: string | null,
  scope: ProgressScope,
): ReadingProgress | null {
  if (
    scope.courseId !== "ML201" ||
    scope.lessonId !== LESSON_ID ||
    scope.contentVersion !== 1
  )
    return null;
  const legacy = parseProgress(raw);
  if (!legacy || !scope.sectionIds.includes(legacy.section)) return null;
  return {
    ...legacy,
    version: 2,
    courseId: scope.courseId,
    lessonId: scope.lessonId,
    contentVersion: scope.contentVersion,
  };
}
export function mergeReadingProgress(
  previous: ReadingProgress | null,
  scope: ProgressScope,
  percent: number,
  section: string,
  completed = false,
  now = Date.now(),
): ReadingProgress {
  const done = completed || previous?.completed === true;
  return {
    version: 2,
    courseId: scope.courseId,
    lessonId: scope.lessonId,
    contentVersion: scope.contentVersion,
    percent: done
      ? 100
      : Math.max(
          previous?.percent ?? 0,
          Number.isFinite(percent)
            ? Math.max(0, Math.min(100, Math.round(percent)))
            : 0,
        ),
    completed: done,
    section: scope.sectionIds.includes(section) ? section : scope.sectionIds[0],
    updatedAt: now,
  };
}

type StoragePort = Pick<Storage, "getItem" | "setItem">;
// 可注入存储，便于测试权限失败；模块中无浏览器副作用。
export function createProgressStore(
  storage: () => StoragePort,
  notify: () => void = () => {},
) {
  const memory = new Map<string, string>();
  const unsaved = new Set<string>();
  function readKey(key: string) {
    if (unsaved.has(key)) return memory.get(key) ?? null;
    try {
      return storage().getItem(key);
    } catch {
      return memory.get(key) ?? null;
    }
  }
  function getSnapshot(scope: ProgressScope): string | null {
    const raw = readKey(progressKey(scope));
    if (parseReadingProgress(raw, scope)) return raw;
    if (raw !== null) return null;
    const legacy = migrateLegacyProgress(readKey(PROGRESS_KEY), scope);
    return legacy ? JSON.stringify(legacy) : null;
  }
  function write(scope: ProgressScope, value: ReadingProgress) {
    const key = progressKey(scope),
      raw = JSON.stringify(value);
    memory.set(key, raw);
    let persisted = true;
    try {
      storage().setItem(key, raw);
      unsaved.delete(key);
    } catch {
      unsaved.add(key);
      persisted = false;
    }
    notify();
    return persisted;
  }
  return {
    getSnapshot,
    save(
      scope: ProgressScope,
      percent: number,
      section: string,
      completed = false,
    ) {
      return write(
        scope,
        mergeReadingProgress(
          parseReadingProgress(getSnapshot(scope), scope),
          scope,
          percent,
          section,
          completed,
        ),
      );
    },
    migrate(scope: ProgressScope) {
      if (readKey(progressKey(scope)) !== null) return;
      const legacy = migrateLegacyProgress(readKey(PROGRESS_KEY), scope);
      if (legacy) write(scope, legacy);
    },
    externalChanged(key: string | null) {
      // 未落盘的会话记录不能被“旧但可读”的存储覆盖。
      if (key === null) {
        for (const savedKey of memory.keys())
          if (!unsaved.has(savedKey)) memory.delete(savedKey);
      } else if (!unsaved.has(key)) memory.delete(key);
      notify();
    },
  };
}
