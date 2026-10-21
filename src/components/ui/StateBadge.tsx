import clsx from "clsx";
import { CheckCircle2, Circle, CircleDot, RotateCcw } from "lucide-react";
import { TOPIC_STATE_LABEL, type TopicState } from "@/lib/progress/mastery";

const STYLES: Record<TopicState, { className: string; icon: typeof Circle }> = {
  "no-iniciado": { className: "text-faint", icon: Circle },
  "en-curso": { className: "text-info", icon: CircleDot },
  "necesita-repaso": { className: "text-warn", icon: RotateCcw },
  "dominado-provisional": { className: "text-accent", icon: CheckCircle2 },
};

/** Topic state with icon + text, never colour alone. */
export function StateBadge({ state, compact = false, title }: { state: TopicState; compact?: boolean; title?: string }) {
  const { className, icon: Icon } = STYLES[state];
  return (
    <span className={clsx("inline-flex items-center gap-1.5 text-xs font-medium", className)} title={title ?? TOPIC_STATE_LABEL[state]}>
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {compact ? <span className="sr-only">{TOPIC_STATE_LABEL[state]}</span> : TOPIC_STATE_LABEL[state]}
    </span>
  );
}
