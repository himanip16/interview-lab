// src/features/library/components/EmptyState.tsx
"use client";

import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";

type Props = {
  message: string;
};

export default function EmptyState({ message }: Props) {
  return (
    <Card className="p-12 text-center">
      <Text variant="muted">{message}</Text>
    </Card>
  );
}
