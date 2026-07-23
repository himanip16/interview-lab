// src/features/landing/components/FeatureCard.tsx

import type { FC } from "react";
import Card from "@/shared/ui/Card";
import Heading from "@/shared/ui/Heading";
import Text from "@/shared/ui/Text";

type Props = {
  title: string;
  description: string;
};

const FeatureCard: FC<Props> = ({
  title,
  description,
}) => {
  return (
    <Card>
      <Heading level="h4">{title}</Heading>

      <Text variant="small" className="mt-3 leading-6">
        {description}
      </Text>
    </Card>
  );
};

export default FeatureCard;