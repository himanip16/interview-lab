type Props = {
  children: React.ReactNode;
};

export default function PageContainer({
  children,
}: Props) {
  return (
    <main className="min-h-screen bg-background px-6 text-foreground">
      {children}
    </main>
  );
}