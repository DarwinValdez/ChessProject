"use client";

import clsx from "clsx";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { t } from "@/i18n";
import { Logo } from "./Logo";
import { NAV, isActive } from "./nav";
import { ThemeSwitcher } from "./theme";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Principal" className="flex flex-col gap-5">
      {NAV.map((group, gi) => (
        <div key={gi} className="flex flex-col gap-0.5">
          {group.label && <p className="label mb-1 px-3">{group.label}</p>}
          {group.items.map(({ href, label, icon: Icon, phase }) => {
            if (phase) {
              return (
                <span
                  key={href}
                  aria-disabled="true"
                  title={`${t.nav.soon}: ${t.nav.phase(phase)}`}
                  className="flex cursor-default items-center gap-3 rounded-lg px-3 py-2 text-sm text-faint"
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="flex-1">{label}</span>
                  <span className="rounded border border-border px-1.5 text-[10px] font-medium uppercase tracking-wide">
                    {t.nav.phase(phase)}
                  </span>
                </span>
              );
            }
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active ? "bg-accent-soft font-medium text-text" : "text-muted hover:bg-surface-2 hover:text-text",
                )}
              >
                <Icon className={clsx("h-4 w-4 shrink-0", active && "text-accent")} aria-hidden />
                {label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function GuestNote() {
  return (
    <div className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-xs text-muted">
      <p className="font-medium text-text">{t.guest.badge}</p>
      <p className="mt-0.5">{t.guest.note}</p>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="flex min-h-dvh">
      <a
        href="#contenido"
        className="sr-only z-50 rounded bg-accent px-3 py-2 text-accent-contrast focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        {t.app.skipToContent}
      </a>

      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-6 overflow-y-auto border-r border-border bg-surface px-3 py-5 lg:flex">
        <Link href="/" className="px-3">
          <Logo />
        </Link>
        <NavLinks />
        <div className="mt-auto flex flex-col gap-3 px-1">
          <GuestNote />
          <ThemeSwitcher />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface/90 px-4 py-2.5 backdrop-blur lg:hidden">
          <Link href="/">
            <Logo />
          </Link>
          <button type="button" className="icon-btn" aria-label={t.nav.openMenu} aria-expanded={open} onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {open && (
          <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú">
            <button type="button" aria-label={t.nav.closeMenu} className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col gap-6 overflow-y-auto bg-surface px-3 py-4 shadow-xl">
              <div className="flex items-center justify-between px-3">
                <Logo />
                <button type="button" className="icon-btn" aria-label={t.nav.closeMenu} onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <NavLinks key={pathname} onNavigate={() => setOpen(false)} />
              <div className="mt-auto flex flex-col gap-3 px-1">
                <GuestNote />
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        )}

        <main id="contenido" className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
