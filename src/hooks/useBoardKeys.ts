"use client";

import { useEffect } from "react";

/** Arrow-key navigation (←/→, Home/End) unless the user is typing. */
export function useBoardKeys(handlers: { back?: () => void; forward?: () => void; start?: () => void; end?: () => void }) {
  const { back, forward, start, end } = handlers;
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable=true]")) return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const action = { ArrowLeft: back, ArrowRight: forward, Home: start, End: end }[event.key];
      if (action) {
        event.preventDefault();
        action();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [back, forward, start, end]);
}
