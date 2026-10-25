"use client";
import { useMemo, useSyncExternalStore } from "react";
import { mergeProgress, parseProgress, PROGRESS_KEY } from "./progress";
let memory: string | null = null;
let storageUnavailable = false;
const eventName = "aivora-local-progress";
export function getLocalProgressSnapshot() {
  if (storageUnavailable) return memory;
  try {
    return localStorage.getItem(PROGRESS_KEY) ?? memory;
  } catch {
    return memory;
  }
}
function subscribe(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === PROGRESS_KEY || event.key === null) {
      memory = null;
      storageUnavailable = false;
      callback();
    }
  };
  window.addEventListener(eventName, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(eventName, callback);
    window.removeEventListener("storage", onStorage);
  };
}
export function saveLocalProgress(
  percent: number,
  section: string,
  completed = false,
) {
  const previous = parseProgress(getLocalProgressSnapshot());
  const value = mergeProgress(previous, percent, section, completed);
  memory = JSON.stringify(value);
  let persisted = true;
  try {
    localStorage.setItem(PROGRESS_KEY, memory);
  } catch {
    storageUnavailable = true;
    persisted = false;
  }
  window.dispatchEvent(new Event(eventName));
  return persisted;
}
export function useLocalProgress() {
  const raw = useSyncExternalStore(
    subscribe,
    getLocalProgressSnapshot,
    () => null,
  );
  return useMemo(() => parseProgress(raw), [raw]);
}
