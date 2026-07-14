import PageContainer from "@/src/components/layout/PageContainer";

import Hero from "@/src/features/landing/components/Hero";
import SampleFeedback from "@/src/features/landing/components/SampleFeedback";
import SmartMentor from "@/src/features/landing/components/SmartMentor";
import PersonalNotebooks from "@/src/features/landing/components/PersonalNotebooks";

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