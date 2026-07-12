import InterviewCatalog from "@/src/components/catalog/InterviewCatalog";
import Navbar from "@/src/components/layout/Navbar";
import PageContainer from "@/src/components/layout/PageContainer";

import Hero from "@/src/features/landing/components/Hero";
import Features from "@/src/features/landing/components/Features";
import SmartMentor from "@/src/features/landing/components/SmartMentor";
import PersonalNotebooks from "@/src/features/landing/components/PersonalNotebooks";

export default function Home() {
  return (
    <PageContainer>
      <Navbar />

      <Hero />

      <SmartMentor />

      <PersonalNotebooks />

      <InterviewCatalog />

      <Features />
    </PageContainer>
  );
}