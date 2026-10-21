import type { ReactNode } from "react";

export function PageHeader({ title, description, actions, eyebrow }: { title: string; description?: ReactNode; actions?: ReactNode; eyebrow?: ReactNode }) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <div className="label mb-1.5">{eyebrow}</div>}
        <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-[15px] text-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function PageContainer({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return <div className={`mx-auto flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8 ${wide ? "max-w-[1400px]" : "max-w-6xl"}`}>{children}</div>;
}
