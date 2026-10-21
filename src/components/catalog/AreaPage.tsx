import { CourseCatalog } from "@/components/catalog/CourseCatalog";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";
import { AREAS } from "@/lib/content/catalog";
import type { Area } from "@/lib/content/types";

export function AreaPage({ area, intro }: { area: Area; intro: string }) {
  const info = AREAS.find((a) => a.id === area)!;
  return (
    <PageContainer>
      <PageHeader eyebrow="Área de estudio" title={info.label} description={intro} />
      <CourseCatalog fixedArea={area} />
    </PageContainer>
  );
}
