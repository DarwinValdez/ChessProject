export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 1) return seconds > 0 ? "< 1 min" : "0 min";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h} h ${m.toString().padStart(2, "0")} min` : `${m} min`;
}

export function formatPercent(rate: number | null): string {
  return rate === null ? "—" : `${Math.round(rate * 100)} %`;
}

const relative = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

export function formatRelative(iso: string, now: Date): string {
  const diff = (new Date(iso).getTime() - now.getTime()) / 1000;
  const abs = Math.abs(diff);
  if (abs < 60) return "hace un momento";
  if (abs < 3600) return relative.format(Math.round(diff / 60), "minute");
  if (abs < 86400) return relative.format(Math.round(diff / 3600), "hour");
  return relative.format(Math.round(diff / 86400), "day");
}

const dayFormat = new Intl.DateTimeFormat("es", { weekday: "long", day: "numeric", month: "long" });

export function formatDay(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return dayFormat.format(new Date(y, m - 1, d));
}
