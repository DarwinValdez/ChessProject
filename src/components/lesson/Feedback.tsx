import clsx from "clsx";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import type { ReactNode } from "react";

export type FeedbackTone = "success" | "error" | "info";

const STYLE: Record<FeedbackTone, { box: string; icon: typeof Info; label: string }> = {
  success: { box: "border-accent/40 bg-accent-soft", icon: CheckCircle2, label: "Correcto" },
  error: { box: "border-danger/40 bg-danger-soft", icon: XCircle, label: "Incorrecto" },
  info: { box: "border-border bg-surface-2", icon: Info, label: "Información" },
};

export function Feedback({ tone, children }: { tone: FeedbackTone; children: ReactNode }) {
  const { box, icon: Icon, label } = STYLE[tone];
  return (
    <div className={clsx("flex gap-2.5 rounded-lg border p-3 text-sm", box)} role={tone === "error" ? "alert" : "status"}>
      <Icon
        className={clsx("mt-0.5 h-4 w-4 shrink-0", tone === "success" ? "text-accent" : tone === "error" ? "text-danger" : "text-muted")}
        aria-label={label}
      />
      <div className="min-w-0 flex-1 leading-relaxed">{children}</div>
    </div>
  );
}
