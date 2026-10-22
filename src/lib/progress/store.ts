"use client";

/**
 * Client-side progress store: a single in-memory copy of ProgressData,
 * persisted through a ProgressRepository and exposed to React with
 * useSyncExternalStore. Other tabs are kept in sync via the storage event.
 */
import { useSyncExternalStore } from "react";
import * as actions from "./actions";
import { LocalStorageRepository, MemoryRepository, type ProgressRepository, STORAGE_KEY } from "./repository";
import { type Goals, type ProgressData, type RepertoireEntry, type StudyActivity, emptyProgress, goalsSchema } from "./schema";

type Listener = () => void;

let repository: ProgressRepository | null = null;
let state: ProgressData | null = null;
let recovered = false;
const listeners = new Set<Listener>();

function ensureLoaded(): ProgressData {
  if (state) return state;
  if (typeof window === "undefined") return emptyProgress();
  let storage: Storage | null = null;
  try {
    storage = window.localStorage;
  } catch {
    storage = null;
  }
  repository = storage ? new LocalStorageRepository(storage) : new MemoryRepository();
  const result = repository.load();
  state = result.data;
  recovered = result.recovered;
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY || !repository) return;
    state = repository.load().data;
    emit();
  });
  return state;
}

function emit() {
  for (const listener of listeners) listener();
}

function update(transform: (data: ProgressData) => ProgressData) {
  const next = transform(ensureLoaded());
  if (next === state) return;
  state = next;
  repository?.save(next);
  emit();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Progress data, or null during server render / hydration. */
export function useProgress(): ProgressData | null {
  return useSyncExternalStore(subscribe, ensureLoaded, () => null);
}

export function storageWasRecovered(): boolean {
  return recovered;
}

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const progressStore = {
  recordAttempt(attempt: actions.NewAttempt) {
    update((d) => actions.addAttempt(d, attempt, new Date(), newId()));
  },
  visitLesson(lessonId: string, stepIndex: number) {
    update((d) => actions.visitLesson(d, lessonId, stepIndex, new Date()));
  },
  completeLesson(lessonId: string) {
    update((d) => actions.completeLesson(d, lessonId, new Date()));
  },
  addStudyTime(activity: StudyActivity, seconds: number) {
    update((d) => actions.addStudyTime(d, activity, seconds, new Date()));
  },
  setGoals(goals: Goals) {
    const parsed = goalsSchema.safeParse(goals);
    if (parsed.success) update((d) => actions.setGoals(d, parsed.data));
    return parsed.success;
  },
  toggleRepertoire(entry: RepertoireEntry) {
    update((d) => actions.toggleRepertoire(d, entry));
  },
  exportJson(): string {
    return JSON.stringify(ensureLoaded(), null, 2);
  },
  reset() {
    repository?.clear();
    state = emptyProgress();
    repository?.save(state);
    emit();
  },
};
