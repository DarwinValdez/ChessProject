"use client";

import { useState } from "react";

/**
 * Current time, fixed for the component's lifetime, or null while
 * prerendering on the server (Cache Components rejects `new Date()` there).
 * Progress-based UI renders only once browser data is available anyway.
 */
export function useNow(): Date | null {
  const [now] = useState<Date | null>(() => (typeof window === "undefined" ? null : new Date()));
  return now;
}
