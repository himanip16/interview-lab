import PageContainer from "@/components/layout/PageContainer";
import Hero from "@/features/landing/components/Hero";
import ActionCards from "@/features/landing/components/ActionCards";
import SmartMentor from "@/features/landing/components/SmartMentor";
import PersonalNotebooks from "@/features/landing/components/PersonalNotebooks";
import SampleFeedback from "@/features/landing/components/SampleFeedback";

export default function Home() {
  return (
    <PageContainer>
      <Hero />
      <ActionCards />
      <SmartMentor />
      <PersonalNotebooks />
      <SampleFeedback />
    </PageContainer>
  );
}