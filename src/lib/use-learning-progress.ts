"use client";
import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import {
  createProgressStore,
  parseReadingProgress,
  type ProgressScope,
} from "./learning-progress";
import type { Lesson, LessonSummary } from "../content/models";

const listeners = new Set<() => void>();
export const learningProgressStore = createProgressStore(
  () => window.localStorage,
  () => listeners.forEach((callback) => callback()),
);
const onStorage = (event: StorageEvent) => {
  if (event.key === null || event.key.startsWith("aivora:learning:"))
    learningProgressStore.externalChanged(event.key);
};
function subscribe(callback: () => void) {
  listeners.add(callback);
  // 一个全局 storage 监听，避免同时订阅多个样章时重复通知。
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}
export const lessonProgressScope = (lesson: Lesson): ProgressScope => ({
  courseId: lesson.courseId,
  lessonId: lesson.id,
  contentVersion: lesson.contentVersion,
  sectionIds: lesson.sections.map((s) => s.id),
});
export const summaryProgressScope = (lesson: LessonSummary): ProgressScope => ({
  courseId: lesson.courseId,
  lessonId: lesson.lessonId,
  contentVersion: lesson.contentVersion,
  sectionIds: lesson.sectionTitles.map((s) => s.id),
});
export function useLessonProgress(scope: ProgressScope) {
  const getSnapshot = useCallback(
    () => learningProgressStore.getSnapshot(scope),
    [scope],
  );
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => null);
  useEffect(() => {
    learningProgressStore.migrate(scope);
  }, [scope]);
  return useMemo(() => parseReadingProgress(raw, scope), [raw, scope]);
}
export function useLearningRecords(lessons: LessonSummary[]) {
  const scopes = useMemo(() => lessons.map(summaryProgressScope), [lessons]);
  const getSnapshot = useCallback(
    () =>
      JSON.stringify(
        scopes.map((scope) => learningProgressStore.getSnapshot(scope)),
      ),
    [scopes],
  );
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  useEffect(() => {
    scopes.forEach((scope) => learningProgressStore.migrate(scope));
  }, [scopes]);
  return useMemo(() => {
    const snapshots: (string | null)[] = JSON.parse(raw);
    return lessons
      .flatMap((lesson, index) => {
        const progress = parseReadingProgress(
          snapshots[index] ?? null,
          scopes[index],
        );
        return progress ? [{ lesson, progress }] : [];
      })
      .sort((a, b) => b.progress.updatedAt - a.progress.updatedAt);
  }, [raw, scopes, lessons]);
}
