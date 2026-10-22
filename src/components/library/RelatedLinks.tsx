import Link from "next/link";
import { getUnit } from "@/lib/content/units";

export function RelatedLinks({ ids }: { ids: string[] }) {
  const units = ids.map(getUnit).filter((u) => u !== undefined);
  if (units.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {units.map((u) => (
        <li key={u.id}>
          <Link href={u.href} className="rounded-full border border-border px-2 py-0.5 text-xs text-muted hover:border-border-strong hover:text-text">
            {u.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
