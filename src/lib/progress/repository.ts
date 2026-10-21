/**
 * Persistence boundary for progress. Phase 1 ships the guest (browser)
 * implementation; phase 4 adds a Supabase implementation of the same
 * interface and merges guest progress into the account on sign-in.
 */
import { type ProgressData, emptyProgress, progressSchema } from "./schema";

export interface LoadResult {
  data: ProgressData;
  /** True when stored data was unreadable and a fresh profile was started. */
  recovered: boolean;
}

export interface ProgressRepository {
  load(): LoadResult;
  save(data: ProgressData): void;
  clear(): void;
}

export const STORAGE_KEY = "chess-academy:progress:v1";
const BACKUP_KEY = `${STORAGE_KEY}:corrupt-backup`;

/** Parses stored JSON, never throwing: invalid data yields an empty profile. */
export function parseProgress(raw: string | null): LoadResult {
  if (raw === null) return { data: emptyProgress(), recovered: false };
  try {
    const parsed = progressSchema.safeParse(JSON.parse(raw));
    if (parsed.success) return { data: parsed.data, recovered: false };
  } catch {
    // fall through
  }
  return { data: emptyProgress(), recovered: true };
}

export class LocalStorageRepository implements ProgressRepository {
  constructor(private readonly storage: Storage) {}

  load(): LoadResult {
    let raw: string | null = null;
    try {
      raw = this.storage.getItem(STORAGE_KEY);
    } catch {
      return { data: emptyProgress(), recovered: false };
    }
    const result = parseProgress(raw);
    if (result.recovered && raw !== null) {
      // Keep the unreadable data instead of silently destroying it.
      try {
        this.storage.setItem(BACKUP_KEY, raw);
      } catch {
        /* storage full or blocked */
      }
    }
    return result;
  }

  save(data: ProgressData): void {
    try {
      this.storage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* private mode or quota exceeded: progress stays in memory for this visit */
    }
  }

  clear(): void {
    try {
      this.storage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
}

/** In-memory repository, used in tests and when storage is unavailable. */
export class MemoryRepository implements ProgressRepository {
  constructor(private data: ProgressData = emptyProgress()) {}
  load(): LoadResult {
    return { data: structuredClone(this.data), recovered: false };
  }
  save(data: ProgressData): void {
    this.data = structuredClone(data);
  }
  clear(): void {
    this.data = emptyProgress();
  }
}
