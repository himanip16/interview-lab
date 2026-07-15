// src/app/(marketing)/page.tsx
import PageContainer from "@/components/layout/PageContainer";

import Hero from "@/features/landing/components/Hero";
import SmartMentor from "@/features/landing/components/SmartMentor";
import ActionCards from "@/features/landing/components/ActionCards";

export default function Home() {
  return (
    <PageContainer>
      <Hero />
      <ActionCards />
      <SmartMentor />
    </PageContainer>
  );
}