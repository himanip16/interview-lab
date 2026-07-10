import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import InterviewCatalog from "@/components/catalog/InterviewCatalog";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";

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