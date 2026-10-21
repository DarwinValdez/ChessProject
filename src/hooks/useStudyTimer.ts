"use client";

import { useEffect } from "react";
import { progressStore } from "@/lib/progress/store";
import type { StudyActivity } from "@/lib/progress/schema";

const TICK_SECONDS = 15;
const IDLE_AFTER_MS = 90_000;

/**
 * Records active study time: only while the tab is visible and the user
 * has interacted in the last 90 s. Time on a forgotten open tab is not
 * counted. Effects are cleaned up when the route is hidden or unmounted.
 */
export function useStudyTimer(activity: StudyActivity) {
  useEffect(() => {
    let lastInput = Date.now();
    const touch = () => {
      lastInput = Date.now();
    };
    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    for (const e of events) window.addEventListener(e, touch, { passive: true });
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - lastInput > IDLE_AFTER_MS) return;
      progressStore.addStudyTime(activity, TICK_SECONDS);
    }, TICK_SECONDS * 1000);
    return () => {
      window.clearInterval(timer);
      for (const e of events) window.removeEventListener(e, touch);
    };
  }, [activity]);
}
