import Link from "next/link";
import { PageContainer } from "@/components/ui/PageHeader";

export default function NotFound() {
  return (
    <PageContainer>
      <div className="card flex flex-col items-start gap-3 p-8">
        <p className="label">Error 404</p>
        <h1 className="text-xl font-semibold">Esta página no existe</h1>
        <p className="text-sm text-muted">Puede que el curso o la lección se haya movido.</p>
        <Link href="/cursos" className="btn-primary">
          Ir al catálogo
        </Link>
      </div>
    </PageContainer>
  );
}
