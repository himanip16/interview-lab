import PageContainer from "@/components/layout/PageContainer";

import Hero from "@/features/landing/components/Hero";
import SampleFeedback from "@/features/landing/components/SampleFeedback";
import SmartMentor from "@/features/landing/components/SmartMentor";
import PersonalNotebooks from "@/features/landing/components/PersonalNotebooks";

export default function Home() {
  return (
    <PageContainer>
      <Hero />

      <SmartMentor />

      <PersonalNotebooks />

      <SampleFeedback />
    </PageContainer>
  );
}