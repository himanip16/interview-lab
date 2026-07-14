import PageContainer from "@/components/layout/PageContainer";

import Hero from "@/features/landing/components/Hero";
import SampleFeedback from "@/features/landing/components/SampleFeedback";
import SmartMentor from "@/features/landing/components/SmartMentor";
import PersonalNotebooks from "@/features/landing/components/PersonalNotebooks";

import ActionCards from "@/features/landing/components/ActionCards";

export default function Home() {
  return (
    <PageContainer>
      <Hero />
      <ActionCards />  {/* ADD THIS */}
      <SmartMentor />
      <PersonalNotebooks />
      <SampleFeedback />
    </PageContainer>
  );
}