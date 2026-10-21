import { t } from "@/i18n";

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
        <rect width="32" height="32" rx="7" className="fill-accent" />
        <rect x="6" y="6" width="10" height="10" fill="white" opacity="0.92" />
        <rect x="16" y="16" width="10" height="10" fill="white" opacity="0.92" />
        <rect x="16" y="6" width="10" height="10" fill="white" opacity="0.25" />
        <rect x="6" y="16" width="10" height="10" fill="white" opacity="0.25" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-tight text-text">{t.app.name}</span>
        <span className="mt-0.5 text-[11px] text-faint">{t.app.tagline}</span>
      </span>
    </span>
  );
}
