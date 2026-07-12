import InterviewCatalog from "@/src/components/catalog/InterviewCatalog";
import Navbar from "@/src/components/layout/Navbar";
import PageContainer from "@/src/components/layout/PageContainer";

import Hero from "@/src/features/landing/components/Hero";
import Features from "@/src/features/landing/components/Features";

export default function Home() {
  return (
    <PageContainer>
      <Navbar />

      <Hero />

      <InterviewCatalog />

      <Features />
    </PageContainer>
  );
}