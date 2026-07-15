"use client";

import Card from "@/components/ui/Card";

type Props = {
  content: string;
};

export default function TakeawayCard({ content }: Props) {
  return (
    <Card className="border-blue-500/20 bg-blue-500/5 p-5">
      <div className="mb-2 text-xs font-mono uppercase tracking-wider text-blue-400">
        Takeaway
      </div>

      <p className="text-sm leading-7">
        {content}
      </p>
    </Card>
  );
}