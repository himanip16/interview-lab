import type { FC } from "react";
import Card from "@/src/components/ui/Card";
import Heading from "@/src/components/ui/Heading";
import Text from "@/src/components/ui/Text";

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