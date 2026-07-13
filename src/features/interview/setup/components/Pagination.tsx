type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded border border-border bg-card px-3 py-1.5 text-sm text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:border-foreground/40"
      >
        Previous
      </button>
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded border border-border bg-card px-3 py-1.5 text-sm text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:border-foreground/40"
      >
        Next
      </button>
    </div>
  );
}
