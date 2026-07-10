type Props = {
  children: React.ReactNode;
};

export default function PageContainer({
  children,
}: Props) {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 text-white">
      {children}
    </main>
  );
}