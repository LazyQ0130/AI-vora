export const PROGRESS_KEY = "aivora:learning:v1";
export const LESSON_ID = "ML201-C04-L01";
export const sectionIds = [
  "intuition",
  "loss",
  "gradient",
  "experiment",
  "code",
  "quiz",
  "summary",
] as const;
export type LocalProgress = {
  version: 1;
  lessonId: typeof LESSON_ID;
  percent: number;
  completed: boolean;
  section: string;
  updatedAt: number;
};
export function parseProgress(raw: string | null): LocalProgress | null {
  if (!raw) return null;
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object") return null;
    const value = data as Record<string, unknown>;
    if (
      value.version !== 1 ||
      value.lessonId !== LESSON_ID ||
      typeof value.percent !== "number" ||
      !Number.isFinite(value.percent) ||
      typeof value.completed !== "boolean" ||
      typeof value.updatedAt !== "number" ||
      !Number.isSafeInteger(value.updatedAt) ||
      value.updatedAt <= 0 ||
      value.updatedAt > 8640000000000000 ||
      typeof value.section !== "string" ||
      !sectionIds.includes(value.section as (typeof sectionIds)[number])
    )
      return null;
    return {
      version: 1,
      lessonId: LESSON_ID,
      percent: value.completed
        ? 100
        : Math.max(0, Math.min(100, Math.round(value.percent))),
      completed: value.completed,
      section: value.section,
      updatedAt: value.updatedAt,
    };
  } catch {
    return null;
  }
}
export function mergeProgress(
  previous: LocalProgress | null,
  percent: number,
  section: string,
  completed = false,
  now = Date.now(),
): LocalProgress {
  const done = completed || previous?.completed === true;
  return {
    version: 1,
    lessonId: LESSON_ID,
    percent: done
      ? 100
      : Math.max(
          previous?.percent ?? 0,
          Number.isFinite(percent)
            ? Math.max(0, Math.min(100, Math.round(percent)))
            : 0,
        ),
    completed: done,
    section: sectionIds.includes(section as (typeof sectionIds)[number])
      ? section
      : "intuition",
    updatedAt: now,
  };
}
