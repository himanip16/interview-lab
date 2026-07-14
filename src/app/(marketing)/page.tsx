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