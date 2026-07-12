import Link from "next/link";

import { Interview } from "@/src/features/interview/types/interview";
import Card from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import Heading from "@/src/components/ui/Heading";
import Text from "@/src/components/ui/Text";

type Props = {
  interview: Interview;
};

export default function InterviewCard({
  interview,
}: Props) {
  return (
    <Card className="shadow-sm transition hover:border-border/80">
      <Heading level="h3">
        {interview.title}
      </Heading>

      <Text variant="body" className="mt-2">
        {interview.description}
      </Text>

      <div className="mt-6 flex items-center justify-between">
        <Text variant="small">
          {interview.duration} min •{" "}
          {interview.difficulty}
        </Text>

        <Link
          href={`/interview/setup?problemId=${interview.id}&type=hld`}
        >
          <Button variant="primary" className="px-4 py-2 text-sm">
            Start →
          </Button>
        </Link>
      </div>
    </Card>
  );
}