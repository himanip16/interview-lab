import Hero from "@/src/components/landing/Hero";
import Features from "@/src/components/landing/Features";
import InterviewCatalog from "@/src/components/catalog/InterviewCatalog";
import Navbar from "@/src/components/layout/Navbar";
import PageContainer from "@/src/components/layout/PageContainer";

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