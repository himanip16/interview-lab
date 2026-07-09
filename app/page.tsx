import Hero from "@/components/landing/Hero";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import InterviewCatalog from "@/components/catalog/InterviewCatalog";
export default function Home() {
  return (
    <PageContainer>

      <Navbar />

      <Hero />
       <InterviewCatalog />

    </PageContainer>
  );
}