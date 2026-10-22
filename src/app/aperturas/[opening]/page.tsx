import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OpeningView } from "@/components/openings/OpeningView";
import { OPENINGS, getOpening } from "@/lib/content/openings";

export function generateStaticParams() {
  return OPENINGS.map((o) => ({ opening: o.slug }));
}

export async function generateMetadata({ params }: PageProps<"/aperturas/[opening]">): Promise<Metadata> {
  const { opening } = await params;
  const o = getOpening(opening);
  return o ? { title: o.name, description: o.summary } : { title: "Apertura" };
}

export default async function OpeningPage({ params }: PageProps<"/aperturas/[opening]">) {
  const { opening: slug } = await params;
  const opening = getOpening(slug);
  if (!opening) notFound();
  return <OpeningView opening={opening} />;
}
