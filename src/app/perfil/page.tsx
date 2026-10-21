import type { Metadata } from "next";
import { ProfileData } from "@/components/profile/ProfileData";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Mis datos" };

export default function ProfilePage() {
  return (
    <PageContainer>
      <PageHeader title="Mis datos" description="Preferencias y control sobre la información de progreso guardada." />
      <ProfileData />
    </PageContainer>
  );
}
