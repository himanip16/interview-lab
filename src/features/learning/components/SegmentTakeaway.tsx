interface SegmentTakeawayProps {
  takeaway: string | null;
}

export function SegmentTakeaway({ takeaway }: SegmentTakeawayProps) {
  if (!takeaway) {
    return null;
  }

  return (
    <div className="my-6 mx-4 px-6 py-4 bg-accent/50 border-l-4 border-primary rounded-r-lg">
      <p className="text-sm font-medium text-foreground italic">
        "{takeaway}"
      </p>
    </div>
  );
}
