import { CourseCatalog } from "@/components/catalog/CourseCatalog";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";
import { AREAS } from "@/lib/content/catalog";
import type { ReactNode } from "react";
import type { Area } from "@/lib/content/types";

export function AreaPage({ area, intro, actions }: { area: Area; intro: string; actions?: ReactNode }) {
  const info = AREAS.find((a) => a.id === area)!;
  return (
    <PageContainer>
      <PageHeader eyebrow="Área de estudio" title={info.label} description={intro} actions={actions} />
      <CourseCatalog fixedArea={area} />
    </PageContainer>
  );
}
